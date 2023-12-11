import { IsEmail, IsString, MinLength } from "class-validator";

export class GetOrganizationsDto {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;
  updated_at: Date;
}

export class GetOrganizationDetailDto extends GetOrganizationsDto {}

export class CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  name: string;
}

export class InviteUserDto {
  @IsEmail()
  email: string;
}

export class GetOrganizationMembersDto {
  id: string;
  email: string;
}
