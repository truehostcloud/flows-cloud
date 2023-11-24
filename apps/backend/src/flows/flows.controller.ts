import { Body, Controller, Get, Param, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Auth, Authorization } from "../auth";
import type { GetFlowDetailDto, GetFlowsDto } from "./flows.dto";
import { UpdateFlowDto } from "./flows.dto";
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

  @Get("flows/:flowId")
  getFlowDetail(
    @Authorization() auth: Auth,
    @Param("flowId") flowId: string,
  ): Promise<GetFlowDetailDto> {
    return this.flowsService.getFlowDetail({ auth, flowId });
  }

  @Patch("flows/:flowId")
  updateFlow(
    @Authorization() auth: Auth,
    @Param("flowId") flowId: string,
    @Body() body: UpdateFlowDto,
  ): Promise<void> {
    return this.flowsService.updateFlow({ auth, flowId, data: body });
  }
}
