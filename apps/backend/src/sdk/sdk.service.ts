import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { events, flows, projects } from "db";
import { and, arrayContains, eq, isNotNull, or } from "drizzle-orm";

import { DatabaseService } from "../database/database.service";
import type { CreateEventDto, GetSdkFlowsDto } from "./sdk.dto";

@Injectable()
export class SdkService {
  constructor(private databaseService: DatabaseService) {}

  async getFlows({
    projectId,
    requestOrigin,
  }: {
    projectId: string;
    requestOrigin: string;
  }): Promise<GetSdkFlowsDto[]> {
    if (!projectId) throw new NotFoundException();
    if (!requestOrigin) throw new BadRequestException("Origin is required");

    const project = await this.databaseService.db.query.projects.findFirst({
      where: and(
        or(eq(projects.human_id, projectId), eq(projects.human_id_alias, projectId)),
        arrayContains(projects.domains, [requestOrigin]),
      ),
    });
    if (!project) throw new NotFoundException();

    const dbFlows = await this.databaseService.db.query.flows.findMany({
      where: and(
        eq(flows.project_id, project.id),
        eq(flows.flow_type, "cloud"),
        isNotNull(flows.published_at),
      ),
      with: {
        version: true,
      },
    });

    return dbFlows.flatMap((f) => {
      const data = f.version?.data as undefined | { steps: unknown[]; element?: string };
      if (!data) return [];
      return {
        id: f.human_id,
        steps: data.steps,
        element: data.element,
      };
    });
  }

  async createEvent({
    event,
    requestOrigin,
  }: {
    event: CreateEventDto;
    requestOrigin: string;
  }): Promise<void> {
    if (!requestOrigin) throw new BadRequestException("Origin is required");

    const project = await this.databaseService.db.query.projects.findFirst({
      where: and(
        or(eq(projects.human_id, event.projectId), eq(projects.human_id_alias, event.projectId)),
        arrayContains(projects.domains, [requestOrigin]),
      ),
    });
    if (!project) throw new BadRequestException("project not found");
    const flow = await (async () => {
      const existingFlow = await this.databaseService.db.query.flows.findFirst({
        where: and(
          eq(flows.project_id, project.id),
          or(eq(flows.human_id, event.flowId), eq(flows.human_id_alias, event.flowId)),
        ),
      });
      if (existingFlow) return existingFlow;
      const newFlows = await this.databaseService.db
        .insert(flows)
        .values({
          human_id: event.flowId,
          project_id: project.id,
          flow_type: "local",
          description: "",
          name: event.flowId,
        })
        .returning();
      const newFlow = newFlows.at(0);
      if (!newFlow) throw new BadRequestException("error creating flow");
      return newFlow;
    })();

    const newEvent: typeof events.$inferInsert = {
      event_time: event.eventTime,
      type: event.type,
      flow_id: flow.id,
      user_hash: event.userHash,
      step_index: event.stepIndex,
      flow_hash: event.flowHash,
      step_hash: event.stepHash,
    };

    try {
      await this.databaseService.db.insert(events).values(newEvent);
    } catch (error) {
      // eslint-disable-next-line no-console -- useful for debugging
      console.log(error);
      // TODO: add custom logger that doesnt log in test env
      if (error) throw new BadRequestException("error saving event", { cause: error });
    }
  }
}
