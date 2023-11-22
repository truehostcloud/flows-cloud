import { BadRequestException, Injectable } from "@nestjs/common";
import { events, flows, projects } from "db";
import { and, arrayContains, eq, or } from "drizzle-orm";

import { DatabaseService } from "../database/database.service";
import type { CreateEventDto, GetFlowsDto } from "./sdk.dto";

@Injectable()
export class SdkService {
  constructor(private databaseService: DatabaseService) {}

  async getFlows({
    projectId,
    requestOrigin,
  }: {
    projectId: string;
    requestOrigin: string;
  }): Promise<GetFlowsDto[]> {
    if (!projectId) throw new BadRequestException("projectId is required");
    if (!requestOrigin) throw new BadRequestException("host is required");

    const project = await this.databaseService.db.query.projects.findFirst({
      where: and(
        or(eq(projects.human_id, projectId), eq(projects.human_id_alias, projectId)),
        arrayContains(projects.domains, [requestOrigin]),
      ),
    });
    if (!project) throw new BadRequestException("project not found");

    const dbFlows = await this.databaseService.db.query.flows.findMany({
      where: and(eq(flows.project_id, project.id), eq(flows.flow_type, "cloud")),
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
      // TODO: add custom logger that doesnt log in test env
      if (error) throw new BadRequestException("error saving event", { cause: error });
    }
  }
}
