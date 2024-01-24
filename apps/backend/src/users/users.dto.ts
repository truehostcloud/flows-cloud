import { IsEmail, IsString } from "class-validator";

export class Invite {
  id: string;
  expires_at: Date;
  organizationName: string;
}

export class GetMeDto {
  pendingInvites: Invite[];
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
