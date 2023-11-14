import { BadRequestException, Injectable } from "@nestjs/common";

import { SupabaseService } from "../supabase.service";
import type { CreateEventDto } from "./events.dto";

@Injectable()
export class EventsService {
  constructor(private supabaseService: SupabaseService) {}

  async createEvent(event: CreateEventDto): Promise<void> {
    const { error } = await this.supabaseService.supabase.from("user_event").insert({
      event_time: event.eventTime.toString(),
      type: event.type,
      flow_id: event.flowId,
      user_hash: event.userHash,
      project_id: event.projectId,
      step_index: event.stepIndex,
      step_hash: event.stepHash,
      flow_hash: event.flowHash,
    });

    if (error) throw new BadRequestException(error.message, { cause: error });
  }
}
