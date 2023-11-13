import { Module } from "@nestjs/common";

import { SupabaseService } from "../supabase.service";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
  controllers: [EventsController],
  providers: [EventsService, SupabaseService],
})
export class EventsModule {}
