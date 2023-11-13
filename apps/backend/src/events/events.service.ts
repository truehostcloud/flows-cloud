import { BadRequestException, Injectable } from "@nestjs/common";

import { SupabaseService } from "../supabase.service";
import type { CreateEventDto } from "./events.dto";

@Injectable()
export class EventsService {
  constructor(private supabaseService: SupabaseService) {}

  async createEvent(event: CreateEventDto): Promise<void> {
    const { error } = await this.supabaseService.supabase.from("user_event").insert({
      event_time: event.event_time.toString(),
      action: event.action,
      flow_id: event.flow_id,
      step_index: event.step_index,
      user_hash: event.user_hash,
    });

    if (error) throw new BadRequestException(error.message, { cause: error });
  }
}
