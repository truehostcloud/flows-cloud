import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { events, flows, flowVersions, organizations, organizationsToUsers, projects } from "db";
import { desc, eq, sql } from "drizzle-orm";
import slugify from "slugify";

import type { Auth } from "../auth";
import { DatabaseService } from "../database/database.service";
import type {
  CreateFlowDto,
  GetFlowDetailDto,
  GetFlowsDto,
  GetFlowVersionsDto,
  UpdateFlowDto,
} from "./flows.dto";

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
      orderBy: [desc(flows.updated_at)],
    });

    return projectFlows.map((flow) => ({
      id: flow.id,
      name: flow.name,
      description: flow.description,
      created_at: flow.created_at,
      updated_at: flow.updated_at,
      published_at: flow.published_at,
      project_id: flow.project_id,
      flow_type: flow.flow_type,
      human_id: flow.human_id,
      human_id_alias: flow.human_id_alias,
      frequency: flow.frequency,
      preview_url: flow.preview_url,
    }));
  }

  async getFlowDetail({ auth, flowId }: { auth: Auth; flowId: string }): Promise<GetFlowDetailDto> {
    const plainFlow = await this.databaseService.db.query.flows.findFirst({
      where: eq(flows.id, flowId),
    });
    if (!plainFlow) throw new NotFoundException();
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
      published_at: flow.published_at,
      project_id: flow.project_id,
      flow_type: flow.flow_type,
      human_id: flow.human_id,
      human_id_alias: flow.human_id_alias,
      data: flow.version?.data,
      daily_stats: dailyStats,
      frequency: flow.frequency,
      preview_url: flow.preview_url,
    };
  }

  async updateFlow({
    auth,
    data,
    flowId,
  }: {
    auth: Auth;
    flowId: string;
    data: UpdateFlowDto;
  }): Promise<void> {
    const flow = await this.databaseService.db.query.flows.findFirst({
      where: eq(flows.id, flowId),
    });
    if (!flow) throw new NotFoundException();
    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, flow.project_id),
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

    const newVersion = await (async () => {
      if (!data.data) return;
      const versions = await this.databaseService.db
        .insert(flowVersions)
        .values({ data: JSON.parse(data.data), flow_id: flowId })
        .returning({ id: flowVersions.id });
      const version = versions.at(0);
      if (!version) throw new BadRequestException("failed to create new version");
      return version;
    })();

    const published_at = (() => {
      if (data.published === undefined) return undefined;
      if (flow.published_at && data.published) return undefined;
      if (!flow.published_at && data.published) return new Date();
      if (flow.published_at && !data.published) return null;
    })();
    await this.databaseService.db
      .update(flows)
      .set({
        name: data.name,
        description: data.description,
        human_id: data.human_id,
        human_id_alias: data.human_id_alias,
        updated_at: new Date(),
        flow_version_id: newVersion ? newVersion.id : undefined,
        published_at,
        frequency: data.frequency,
        preview_url: data.preview_url,
      })
      .where(eq(flows.id, flowId));
  }

  async createFlow({
    auth,
    data,
    projectId,
  }: {
    auth: Auth;
    projectId: string;
    data: CreateFlowDto;
  }): Promise<GetFlowsDto> {
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

    const newFlows = await this.databaseService.db
      .insert(flows)
      .values({
        name: data.name,
        description: "",
        project_id: projectId,
        flow_type: "cloud",
        human_id: slugify(data.name, { lower: true, strict: true }),
      })
      .returning();
    const flow = newFlows.at(0);
    if (!flow) throw new BadRequestException("failed to create flow");

    return {
      id: flow.id,
      name: flow.name,
      description: flow.description,
      created_at: flow.created_at,
      updated_at: flow.updated_at,
      published_at: flow.published_at,
      project_id: flow.project_id,
      flow_type: flow.flow_type,
      human_id: flow.human_id,
      human_id_alias: flow.human_id_alias,
      frequency: flow.frequency,
      preview_url: flow.preview_url,
    };
  }

  async deleteFlow({ auth, flowId }: { auth: Auth; flowId: string }): Promise<void> {
    const flow = await this.databaseService.db.query.flows.findFirst({
      where: eq(flows.id, flowId),
    });
    if (!flow) throw new NotFoundException();
    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, flow.project_id),
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

    await this.databaseService.db.delete(flows).where(eq(flows.id, flowId));
  }

  async getFlowVersions({
    auth,
    flowId,
  }: {
    auth: Auth;
    flowId: string;
  }): Promise<GetFlowVersionsDto[]> {
    const flow = await this.databaseService.db.query.flows.findFirst({
      where: eq(flows.id, flowId),
    });
    if (!flow) throw new NotFoundException();
    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, flow.project_id),
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

    const versions = await this.databaseService.db.query.flowVersions.findMany({
      where: eq(flowVersions.flow_id, flowId),
      orderBy: [desc(flowVersions.created_at)],
    });

    return versions.map((version) => ({
      id: version.id,
      created_at: version.created_at,
      data: version.data,
    }));
  }
}
