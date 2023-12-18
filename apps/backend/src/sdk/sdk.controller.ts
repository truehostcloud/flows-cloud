import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { minutes, Throttle } from "@nestjs/throttler";

import type { GetSdkFlowsDto } from "./sdk.dto";
import { CreateEventDto } from "./sdk.dto";
import { SdkService } from "./sdk.service";

@ApiTags("sdk")
@Controller("sdk")
export class SdkController {
  constructor(private sdkService: SdkService) {}

  @Get("flows")
  @Throttle({ default: { limit: 20, ttl: minutes(1) } })
  @ApiQuery({ name: "userHash", required: false })
  getFlows(
    @Headers("origin") origin: string,
    @Query("projectId") projectId: string,
    @Query("userHash") userHash?: string,
  ): Promise<GetSdkFlowsDto[]> {
    return this.sdkService.getFlows({ projectId, requestOrigin: origin, userHash });
  }

  @Post("events")
  createEvent(
    @Headers("origin") origin: string,
    @Body() createEventDto: CreateEventDto,
  ): Promise<void> {
    return this.sdkService.createEvent({ event: createEventDto, requestOrigin: origin });
  }
}
