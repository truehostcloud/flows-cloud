import { Module } from "@nestjs/common";

import { FlowsControllers } from "./flows.controller";
import { FlowsService } from "./flows.service";

@Module({
  controllers: [FlowsControllers],
  providers: [FlowsService],
})
export class FlowsModule {}
