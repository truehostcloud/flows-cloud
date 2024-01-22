import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { events, flows, projects } from "db";
import { and, arrayContains, desc, eq, inArray, isNotNull } from "drizzle-orm";

import { DatabaseService } from "../database/database.service";
import { getDefaultCssTemplate, getDefaultCssVars } from "../lib/css";
import type { CreateEventDto, GetSdkFlowsDto } from "./sdk.dto";

@Injectable()
export class SdkService {
  constructor(private databaseService: DatabaseService) {}

  async getCss({ projectId }: { projectId: string }): Promise<string> {
    if (!projectId) throw new NotFoundException();

    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, projectId),
      columns: {
        css_vars: true,
        css_template: true,
      },
    });
    if (!project) throw new NotFoundException();

    const css_vars = project.css_vars?.trim() || getDefaultCssVars();
    const css_template = project.css_template?.trim() || getDefaultCssTemplate();
    const css = await Promise.all([css_vars, css_template]);

    return css.join("\n");
  }

  async getFlows({
    projectId,
    requestOrigin,
    userHash,
  }: {
    projectId: string;
    requestOrigin: string;
    userHash?: string;
  }): Promise<GetSdkFlowsDto[]> {
    if (!projectId || !requestOrigin) throw new NotFoundException();

    const project = await this.databaseService.db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), arrayContains(projects.domains, [requestOrigin])),
    });
    if (!project) throw new NotFoundException();

    const dbFlows = await this.databaseService.db.query.flows.findMany({
      where: and(
        eq(flows.project_id, project.id),
        eq(flows.flow_type, "cloud"),
        isNotNull(flows.enabled_at),
      ),
      with: {
        publishedVersion: true,
      },
    });

    const seenEvents = await (() => {
      if (!userHash) return;
      return this.databaseService.db
        .selectDistinctOn([events.flow_id], {
          flow_id: events.flow_id,
          event_time: events.event_time,
        })
        .from(events)
        .where(
          and(
            eq(events.user_hash, userHash),
            inArray(events.type, ["finishFlow", "cancelFlow"]),
            inArray(
              events.flow_id,
              dbFlows.map((f) => f.id),
            ),
          ),
        )
        .groupBy(events.flow_id, events.event_time)
        .orderBy(events.flow_id, desc(events.event_time));
    })();

    const seenEventsByFlowId = new Map(seenEvents?.map((e) => [e.flow_id, e]));

    return dbFlows
      .filter((flow) => {
        if (!userHash) return true;
        if (flow.publishedVersion?.frequency === "every-time") return true;
        const event = seenEventsByFlowId.get(flow.id);
        if (flow.publishedVersion?.frequency === "once" && event) return false;
        return true;
      })
      .flatMap((f) => {
        if (!f.publishedVersion) return [];
        return {
          id: f.human_id,
          frequency: f.publishedVersion.frequency,
          steps: f.publishedVersion.data.steps,
          element: f.publishedVersion.data.element,
          location: f.publishedVersion.data.location,
          userProperties: f.publishedVersion.data.userProperties,
        };
      });
  }

  async getPreviewFlow({
    flowId,
    projectId,
    requestOrigin,
  }: {
    requestOrigin: string;
    projectId: string;
    flowId: string;
  }): Promise<GetSdkFlowsDto> {
    if (!projectId || !flowId || !requestOrigin) throw new NotFoundException();

    const project = await this.databaseService.db.query.projects.findFirst({
      where: and(eq(projects.id, projectId), arrayContains(projects.domains, [requestOrigin])),
    });
    if (!project) throw new NotFoundException();

    const flow = await this.databaseService.db.query.flows.findFirst({
      where: and(
        eq(flows.project_id, project.id),
        eq(flows.flow_type, "cloud"),
        eq(flows.human_id, flowId),
      ),
      with: {
        draftVersion: true,
        publishedVersion: true,
      },
    });
    if (!flow) throw new NotFoundException();

    const version = flow.draftVersion ?? flow.publishedVersion;
    if (!version) throw new NotFoundException();

    const data = version.data as
      | undefined
      | { steps: unknown[]; element?: string; location?: string; userProperties?: unknown };
    if (!data) throw new NotFoundException();
    return {
      id: flow.human_id,
      steps: data.steps,
      element: data.element,
      location: data.location,
      userProperties: data.userProperties,
      frequency: version.frequency,
    };
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
        eq(projects.id, event.projectId),
        arrayContains(projects.domains, [requestOrigin]),
      ),
    });
    if (!project) throw new BadRequestException("project not found");
    const flow = await (async () => {
      const existingFlow = await this.databaseService.db.query.flows.findFirst({
        where: and(eq(flows.project_id, project.id), eq(flows.human_id, event.flowId)),
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
