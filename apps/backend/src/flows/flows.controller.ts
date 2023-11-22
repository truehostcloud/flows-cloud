import { Controller, Get, Headers, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import type { GetFlowsDto } from "./flows.dto";
import { FlowsService } from "./flows.service";

@ApiTags("flows")
@Controller()
export class FlowsControllers {
  constructor(private flowsService: FlowsService) {}

  @Get("projects/:projectId/flows")
  getFlows(
    @Headers("authorization") authorization: string,
    @Param("projectId") projectId: string,
  ): Promise<GetFlowsDto[]> {
    return this.flowsService.getFlows({ authorization, projectId });
  }
}
