import { BadRequestException, Injectable } from "@nestjs/common";
import { events, flows, projects } from "db";
import { and, eq, or } from "drizzle-orm";

import { DatabaseService } from "../database/database.service";
import type { CreateEventDto } from "./events.dto";

@Injectable()
export class EventsService {
  constructor(private databaseService: DatabaseService) {}

  async createEvent(event: CreateEventDto): Promise<void> {
    const project = await this.databaseService.db.query.projects.findFirst({
      where: or(
        eq(projects.human_id, event.projectId),
        eq(projects.human_id_alias, event.projectId),
      ),
    });
    if (!project) throw new BadRequestException("project not found");
    const flow = await this.databaseService.db.query.flows.findFirst({
      where: and(
        eq(flows.project_id, project.id),
        or(eq(flows.human_id, event.flowId), eq(flows.human_id_alias, event.flowId)),
      ),
    });
    if (!flow) throw new BadRequestException("flow not found");

    const newEvent: typeof events.$inferInsert = {
      event_time: event.eventTime,
      type: event.type,
      flow_id: flow.id,
      user_hash: event.userHash,
      project_id: project.id,
      step_index: event.stepIndex,
      flow_hash: event.flowHash,
      step_hash: event.stepHash,
    };

    try {
      await this.databaseService.db.insert(events).values(newEvent);
    } catch (error) {
      // eslint-disable-next-line no-console -- useful for debugging
      console.log(error);
      // TODO: log error
      if (error) throw new BadRequestException("error saving event", { cause: error });
    }
  }
}
