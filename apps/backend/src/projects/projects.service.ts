import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { organizations, organizationsToUsers, projects } from "db";
import { asc, eq } from "drizzle-orm";
import slugify from "slugify";

import type { Auth } from "../auth";
import { DatabaseService } from "../database/database.service";
import type {
  CreateProjectDto,
  GetProjectDetailDto,
  GetProjectsDto,
  UpdateProjectDto,
} from "./projects.dto";

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
      orderBy: [asc(projects.name)],
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

  async getProjectDetail({
    auth,
    projectId,
  }: {
    auth: Auth;
    projectId: string;
  }): Promise<GetProjectDetailDto> {
    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) throw new NotFoundException();
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

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      created_at: project.created_at,
      updated_at: project.updated_at,
      organization_id: project.organization_id,
      human_id: project.human_id,
      human_id_alias: project.human_id_alias,
      domains: project.domains,
    };
  }

  async createProject({
    auth,
    data,
    organizationId,
  }: {
    auth: Auth;
    organizationId: string;
    data: CreateProjectDto;
  }): Promise<GetProjectDetailDto> {
    const org = await this.databaseService.db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
      with: {
        organizationsToUsers: {
          where: eq(organizationsToUsers.user_id, auth.userId),
        },
      },
    });
    if (!org) throw new NotFoundException();
    const userHasAccessToOrg = !!org.organizationsToUsers.length;
    if (!userHasAccessToOrg) throw new ForbiddenException();

    const newProjs = await this.databaseService.db
      .insert(projects)
      .values({
        name: data.name,
        organization_id: organizationId,
        domains: [],
        human_id: slugify(data.name),
      })
      .returning();
    const project = newProjs.at(0);
    if (!project) throw new BadRequestException("Failed to create project");

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      created_at: project.created_at,
      updated_at: project.updated_at,
      organization_id: project.organization_id,
      human_id: project.human_id,
      human_id_alias: project.human_id_alias,
      domains: project.domains,
    };
  }

  async updateProject({
    auth,
    data,
    projectId,
  }: {
    auth: Auth;
    projectId: string;
    data: UpdateProjectDto;
  }): Promise<GetProjectDetailDto> {
    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) throw new NotFoundException();
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

    const updatedProjects = await this.databaseService.db
      .update(projects)
      .set({
        updated_at: new Date(),
        description: data.description,
        domains: data.domains,
        human_id: data.human_id,
        human_id_alias: data.human_id_alias,
        name: data.name,
      })
      .where(eq(projects.id, projectId))
      .returning();
    const updatedProj = updatedProjects.at(0);
    if (!updatedProj) throw new BadRequestException("Failed to update project");

    return {
      id: updatedProj.id,
      name: updatedProj.name,
      description: updatedProj.description,
      created_at: updatedProj.created_at,
      updated_at: updatedProj.updated_at,
      organization_id: updatedProj.organization_id,
      human_id: updatedProj.human_id,
      human_id_alias: updatedProj.human_id_alias,
      domains: updatedProj.domains,
    };
  }

  async deleteProject({ auth, projectId }: { auth: Auth; projectId: string }): Promise<void> {
    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) throw new NotFoundException();
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

    await this.databaseService.db.delete(projects).where(eq(projects.id, projectId));
  }
}
