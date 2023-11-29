import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import type { GetSdkFlowsDto } from "./sdk.dto";
import { CreateEventDto } from "./sdk.dto";
import { SdkService } from "./sdk.service";

@ApiTags("sdk")
@Controller("sdk")
export class SdkController {
  constructor(private sdkService: SdkService) {}

  @Get("flows")
  getFlows(
    @Query("projectId") projectId: string,
    @Headers("origin") origin: string,
  ): Promise<GetSdkFlowsDto[]> {
    return this.sdkService.getFlows({ projectId, requestOrigin: origin });
  }

  @Post("events")
  createEvent(
    @Headers("origin") origin: string,
    @Body() createEventDto: CreateEventDto,
  ): Promise<void> {
    return this.sdkService.createEvent({ event: createEventDto, requestOrigin: origin });
  }
}
