import { Controller, Get, Headers, Query } from "@nestjs/common";

import type { GetFlowsDto } from "./flows.dto";
import { FlowsService } from "./flows.service";

@Controller("flows")
export class FlowsController {
  constructor(private flowsService: FlowsService) {}

  @Get()
  getFlows(
    @Query("projectId") projectId: string,
    @Headers("origin") origin: unknown,
  ): Promise<GetFlowsDto[]> {
    return this.flowsService.getFlows({ projectId, requestDomain: origin as string });
  }
}
