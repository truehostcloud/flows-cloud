import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { events, flows, organizations, organizationsToUsers, projects } from "db";
import { eq, sql } from "drizzle-orm";

import type { Auth } from "../auth";
import { DatabaseService } from "../database/database.service";
import type { GetFlowDetailDto, GetFlowsDto } from "./flows.dto";

@Injectable()
export class FlowsService {
  constructor(private databaseService: DatabaseService) {}

  async getFlows({ auth, projectId }: { auth: Auth; projectId: string }): Promise<GetFlowsDto[]> {
    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) throw new BadRequestException("project not found");

    const org = await this.databaseService.db.query.organizations.findFirst({
      where: eq(organizations.id, project.organization_id),
      with: {
        organizationsToUsers: {
          where: eq(organizationsToUsers.user_id, auth.userId),
        },
      },
    });
    const userHasAccessToOrg = !!org?.organizationsToUsers.length;
    if (!userHasAccessToOrg) throw new ForbiddenException();

    const projectFlows = await this.databaseService.db.query.flows.findMany({
      where: eq(flows.project_id, projectId),
    });

    return projectFlows.map((flow) => ({
      id: flow.id,
      name: flow.name,
      description: flow.description,
      created_at: flow.created_at,
      updated_at: flow.updated_at,
      project_id: flow.project_id,
      flow_type: flow.flow_type,
      human_id: flow.human_id,
      human_id_alias: flow.human_id_alias,
    }));
  }

  async getFlowDetail({ auth, flowId }: { auth: Auth; flowId: string }): Promise<GetFlowDetailDto> {
    const plainFlow = await this.databaseService.db.query.flows.findFirst({
      where: eq(flows.id, flowId),
    });
    if (!plainFlow) throw new BadRequestException("flow not found");
    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, plainFlow.project_id),
    });
    if (!project) throw new BadRequestException("project not found");
    const org = await this.databaseService.db.query.organizations.findFirst({
      where: eq(organizations.id, project.organization_id),
      with: {
        organizationsToUsers: {
          where: eq(organizationsToUsers.user_id, auth.userId),
        },
      },
    });
    const userHasAccessToOrg = !!org?.organizationsToUsers.length;
    if (!userHasAccessToOrg) throw new ForbiddenException();
    const flow = await this.databaseService.db.query.flows.findFirst({
      where: eq(flows.id, flowId),
      with: {
        version: true,
      },
    });
    if (!flow) throw new BadRequestException("flow not found");

    const dailyStats = await this.databaseService.db
      .select({
        date: sql<Date>`date_trunc('day', ${events.event_time})`,
        type: events.type,
        count: sql<number>`cast(count(${events.id}) as int)`,
      })
      .from(events)
      .where(eq(events.flow_id, flowId))
      .groupBy((row) => [row.date, row.type]);

    return {
      id: flow.id,
      name: flow.name,
      description: flow.description,
      created_at: flow.created_at,
      updated_at: flow.updated_at,
      project_id: flow.project_id,
      flow_type: flow.flow_type,
      human_id: flow.human_id,
      human_id_alias: flow.human_id_alias,
      data: flow.version?.data,
      daily_stats: dailyStats,
    };
  }
}
