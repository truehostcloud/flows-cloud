import { IsOptional, IsString, MinLength } from "class-validator";

export class GetProjectsDto {
  id: string;
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
}
