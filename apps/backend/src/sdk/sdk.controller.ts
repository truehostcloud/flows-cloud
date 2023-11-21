import { Body, Controller, Get, Headers, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import type { GetFlowsDto } from "./sdk.dto";
import { CreateEventDto } from "./sdk.dto";
import { SdkService } from "./sdk.service";

@ApiTags("sdk")
@Controller("sdk")
export class SdkController {
  constructor(private sdkService: SdkService) {}

  @Get("flows")
  getFlows(
    @Query("projectId") projectId: string,
    @Headers("origin") origin: unknown,
  ): Promise<GetFlowsDto[]> {
    return this.sdkService.getFlows({ projectId, requestOrigin: origin as string });
  }

  @Post("events")
  createEvent(@Body() createEventDto: CreateEventDto): Promise<void> {
    return this.sdkService.createEvent(createEventDto);
  }
}
