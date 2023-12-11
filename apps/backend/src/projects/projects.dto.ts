import { IsOptional, IsString, Length, MinLength } from "class-validator";

export class GetProjectsDto {
  id: string;
  human_id: string;
  human_id_alias: string | null;
  organization_id: string;
  name: string;
  description: string | null;
  domains: string[];
  created_at: Date;
  updated_at: Date;
}

export class GetProjectDetailDto extends GetProjectsDto {}

export class CreateProjectDto {
  @IsString()
  @MinLength(3)
  name: string;
}

export class UpdateProjectDto extends CreateProjectDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsString({ each: true })
  domains: string[];

  @IsString()
  @Length(3, 32)
  human_id: string;
  @IsString()
  @Length(3, 32)
  @IsOptional()
  human_id_alias?: string;
}
