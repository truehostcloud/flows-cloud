import { IsEmail, IsString } from "class-validator";

import type { GetOrganizationsDto } from "../organizations/organizations.dto";

export class Invite {
  id: string;
  expires_at: Date;
  organizationName: string;
}

export class GetMeDto {
  pendingInvites: Invite[];
  organizations: GetOrganizationsDto[];
}

export class AcceptInviteResponseDto {
  organization_id: string;
}

export class JoinWaitlistDto {
  @IsEmail()
  email: string;
  @IsString()
  captchaToken: string;
}
