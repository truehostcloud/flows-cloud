import { Body, Controller, Post } from "@nestjs/common";

import { CreateEventDto } from "./events.dto";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto): Promise<void> {
    return this.eventsService.createEvent(createEventDto);
  }
}
