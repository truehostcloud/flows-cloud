import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Auth, Authorization } from "../auth";
import type { GetProjectsDto } from "./projects.dto";
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
}
