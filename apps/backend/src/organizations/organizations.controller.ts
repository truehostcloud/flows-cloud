import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

import { Auth, Authorization } from "../auth";
import type { GetOrganizationsDto } from "./organizations.dto";
import { OrganizationsService } from "./organizations.service";

@ApiTags("organizations")
@ApiBearerAuth()
@Controller()
export class OrganizationsController {
  constructor(private organizationsService: OrganizationsService) {}

  @Get("organizations")
  getOrganizations(@Authorization() auth: Auth): Promise<GetOrganizationsDto[]> {
    return this.organizationsService.getOrganizations({ auth });
  }
}
