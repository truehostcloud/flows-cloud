import { ForbiddenException, Injectable } from "@nestjs/common";
import { organizations, organizationsToUsers, projects } from "db";
import { eq } from "drizzle-orm";

import type { Auth } from "../auth";
import { DatabaseService } from "../database/database.service";
import type { GetProjectsDto } from "./projects.dto";

@Injectable()
export class ProjectsService {
  constructor(private databaseService: DatabaseService) {}

  async getProjects({
    auth,
    organizationId,
  }: {
    organizationId: string;
    auth: Auth;
  }): Promise<GetProjectsDto[]> {
    const org = await this.databaseService.db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
      with: {
        organizationsToUsers: {
          where: eq(organizationsToUsers.user_id, auth.userId),
        },
      },
    });
    const userHasAccessToOrg = !!org?.organizationsToUsers.length;
    if (!userHasAccessToOrg) throw new ForbiddenException();

    const orgProjects = await this.databaseService.db.query.projects.findMany({
      where: eq(projects.organization_id, organizationId),
    });

    return orgProjects.map((project) => ({
      id: project.id,
      name: project.name,
      description: project.description,
      created_at: project.created_at,
      updated_at: project.updated_at,
      organization_id: project.organization_id,
      human_id: project.human_id,
      human_id_alias: project.human_id_alias,
      domains: project.domains,
    }));
  }
}
