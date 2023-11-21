import { BadRequestException, Injectable } from "@nestjs/common";
import { flows, projects } from "db";
import { and, arrayContains, eq, or } from "drizzle-orm";

import { DatabaseService } from "../database/database.service";
import type { GetFlowsDto } from "./flows.dto";

@Injectable()
export class FlowsService {
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
}
