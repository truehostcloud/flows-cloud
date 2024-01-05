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
