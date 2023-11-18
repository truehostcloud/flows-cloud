import { Module } from "@nestjs/common";

import { SupabaseService } from "../supabase.service";
import { FlowsController } from "./flows.controller";
import { FlowsService } from "./flows.service";

@Module({
  controllers: [FlowsController],
  providers: [FlowsService, SupabaseService],
})
export class FlowsModule {}
