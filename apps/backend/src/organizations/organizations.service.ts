import { Injectable } from "@nestjs/common";
import { organizations, organizationsToUsers } from "db";
import { eq } from "drizzle-orm";

import type { Auth } from "../auth";
import { DatabaseService } from "../database/database.service";
import type { GetOrganizationsDto } from "./organizations.dto";

@Injectable()
export class OrganizationsService {
  constructor(private databaseService: DatabaseService) {}

  async getOrganizations({ auth }: { auth: Auth }): Promise<GetOrganizationsDto[]> {
    const orgs = await this.databaseService.db
      .select()
      .from(organizations)
      .leftJoin(organizationsToUsers, eq(organizations.id, organizationsToUsers.organization_id))
      .where(eq(organizationsToUsers.user_id, auth.userId));

    return orgs.map(({ organization }) => ({
      id: organization.id,
      name: organization.name,
      description: organization.description,
      created_at: organization.created_at,
      updated_at: organization.updated_at,
    }));
  }
}
