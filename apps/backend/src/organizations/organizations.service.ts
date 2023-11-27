import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { organizations, organizationsToUsers } from "db";
import { eq } from "drizzle-orm";

import type { Auth } from "../auth";
import { DatabaseService } from "../database/database.service";
import type {
  CreateOrganizationDto,
  GetOrganizationDetailDto,
  GetOrganizationsDto,
} from "./organizations.dto";

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

  async getOrganizationDetail({
    auth,
    organizationId,
  }: {
    auth: Auth;
    organizationId: string;
  }): Promise<GetOrganizationDetailDto> {
    const org = await this.databaseService.db.query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
      with: {
        organizationsToUsers: {
          where: eq(organizationsToUsers.user_id, auth.userId),
        },
      },
    });
    if (!org) throw new NotFoundException();
    const userHasAccessToOrg = !!org.organizationsToUsers.length;
    if (!userHasAccessToOrg) throw new ForbiddenException();

    return {
      id: org.id,
      name: org.name,
      description: org.description,
      created_at: org.created_at,
      updated_at: org.updated_at,
    };
  }

  async createOrganization({
    auth,
    data,
  }: {
    auth: Auth;
    data: CreateOrganizationDto;
  }): Promise<GetOrganizationDetailDto> {
    const orgs = await this.databaseService.db
      .insert(organizations)
      .values({
        name: data.name,
      })
      .returning();
    const org = orgs.at(0);
    if (!org) throw new BadRequestException("Failed to create organization");
    await this.databaseService.db.insert(organizationsToUsers).values({
      organization_id: org.id,
      user_id: auth.userId,
    });
    return {
      id: org.id,
      name: org.name,
      description: org.description,
      created_at: org.created_at,
      updated_at: org.updated_at,
    };
  }
}
