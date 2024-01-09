import { PartialType } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

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

export class CompleteUpdateProjectDto extends CreateProjectDto {
  @IsString()
  description: string;

  @IsString({ each: true })
  domains: string[];
}

export class UpdateProjectDto extends PartialType(CompleteUpdateProjectDto) {}
