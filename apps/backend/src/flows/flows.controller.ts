import { Controller, Get, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Auth, Authorization } from "../auth";
import type { GetFlowsDto } from "./flows.dto";
import { FlowsService } from "./flows.service";

@ApiTags("flows")
@ApiBearerAuth()
@Controller()
export class FlowsControllers {
  constructor(private flowsService: FlowsService) {}

  @Get("projects/:projectId/flows")
  getFlows(
    @Authorization() auth: Auth,
    @Param("projectId") projectId: string,
  ): Promise<GetFlowsDto[]> {
    return this.flowsService.getFlows({ auth, projectId });
  }
}
