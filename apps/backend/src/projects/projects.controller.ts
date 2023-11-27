import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Auth, Authorization } from "../auth";
import type { GetProjectDetailDto, GetProjectsDto } from "./projects.dto";
import { CreateProjectDto } from "./projects.dto";
import { ProjectsService } from "./projects.service";

@ApiTags("projects")
@ApiBearerAuth()
@Controller()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Get("organizations/:organizationId/projects")
  getProjects(
    @Authorization() auth: Auth,
    @Param("organizationId") organizationId: string,
  ): Promise<GetProjectsDto[]> {
    return this.projectsService.getProjects({ auth, organizationId });
  }

  @Get("projects/:projectId")
  getProjectDetail(
    @Authorization() auth: Auth,
    @Param("projectId") projectId: string,
  ): Promise<GetProjectDetailDto> {
    return this.projectsService.getProjectDetail({ auth, projectId });
  }

  @Post("organizations/:organizationId/projects")
  createProject(
    @Authorization() auth: Auth,
    @Param("organizationId") organizationId: string,
    @Body() body: CreateProjectDto,
  ): Promise<GetProjectDetailDto> {
    return this.projectsService.createProject({ auth, organizationId, data: body });
  }
}
