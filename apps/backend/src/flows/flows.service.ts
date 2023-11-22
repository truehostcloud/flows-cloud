import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { flows, organizations, projects } from "db";
import { eq } from "drizzle-orm";

import { DatabaseService } from "../database/database.service";
import { verifyJwt } from "../lib/jwt";
import type { GetFlowsDto } from "./flows.dto";

@Injectable()
export class FlowsService {
  constructor(private databaseService: DatabaseService) {}

  async getFlows({
    authorization,
    projectId,
  }: {
    authorization: string;
    projectId: string;
  }): Promise<GetFlowsDto[]> {
    const auth = verifyJwt(authorization);
    if (!auth) throw new UnauthorizedException();

    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) throw new BadRequestException("project not found");

    const org = await this.databaseService.db.query.organizations.findFirst({
      where: eq(organizations.id, project.organization_id),
      with: {
        usersToOrganizations: true,
      },
    });
    if (!org) throw new BadRequestException("organization not found");
    const userHasAccessToOrg = org.usersToOrganizations.some(
      (userToOrg) => userToOrg.user_id === auth.userId,
    );
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
}
