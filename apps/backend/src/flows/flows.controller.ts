import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { type Auth, Authorization } from "../auth";
import type {
  GetFlowAnalyticsDto,
  GetFlowDetailDto,
  GetFlowsDto,
  GetFlowVersionsDto,
} from "./flows.dto";
import { CreateFlowDto, UpdateFlowDto } from "./flows.dto";
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
  async updateFlow(
    @Authorization() auth: Auth,
    @Param("flowId") flowId: string,
    @Body() body: UpdateFlowDto,
  ): Promise<GetFlowDetailDto> {
    await this.flowsService.updateFlow({ auth, flowId, data: body });
    return this.flowsService.getFlowDetail({ auth, flowId });
  }

  @Post("projects/:projectId/flows")
  createFlow(
    @Authorization() auth: Auth,
    @Param("projectId") projectId: string,
    @Body() body: CreateFlowDto,
  ): Promise<GetFlowsDto> {
    return this.flowsService.createFlow({ auth, projectId, data: body });
  }

  @Delete("flows/:flowId")
  deleteFlow(@Authorization() auth: Auth, @Param("flowId") flowId: string): Promise<void> {
    return this.flowsService.deleteFlow({ auth, flowId });
  }

  @Get("flows/:flowId/versions")
  getFlowVersions(
    @Authorization() auth: Auth,
    @Param("flowId") flowId: string,
  ): Promise<GetFlowVersionsDto[]> {
    return this.flowsService.getFlowVersions({ auth, flowId });
  }

  @Get("flows/:flowId/analytics")
  getFlowAnalytics(
    @Authorization() auth: Auth,
    @Param("flowId") flowId: string,
  ): Promise<GetFlowAnalyticsDto> {
    return this.flowsService.getFlowAnalytics({ flowId, auth });
  }
}
