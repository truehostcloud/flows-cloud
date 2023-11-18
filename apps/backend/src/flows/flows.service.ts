import { BadRequestException, Injectable } from "@nestjs/common";
import { flows, projects } from "db";
import { and, eq } from "drizzle-orm";

import { DatabaseService } from "../database/database.service";
import type { GetFlowsDto } from "./flows.dto";

@Injectable()
export class FlowsService {
  constructor(private databaseService: DatabaseService) {}

  async getFlows({
    projectId,
    requestDomain,
  }: {
    projectId: string;
    requestDomain: string;
  }): Promise<GetFlowsDto[]> {
    if (!projectId) throw new BadRequestException("projectId is required");
    if (!requestDomain) throw new BadRequestException("host is required");

    const project = await this.databaseService.db.query.projects.findFirst({
      where: eq(projects.id, projectId),
    });
    if (!project) throw new BadRequestException("project not found");
    if (!project.domains.includes(requestDomain))
      throw new BadRequestException("domain not allowed");

    const dbFlows = await this.databaseService.db.query.flows.findMany({
      where: and(eq(flows.project_id, projectId), eq(flows.flow_type, "cloud")),
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
