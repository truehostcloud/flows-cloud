import { PartialType } from "@nestjs/swagger";
import { IsJSON, IsString, Length } from "class-validator";

export class GetFlowsDto {
  id: string;
  human_id: string;
  human_id_alias: string | null;
  project_id: string;
  name: string;
  flow_type: string;
  description: string;
  created_at: Date;
  updated_at: Date;
}

export class StatBucketDto {
  date: Date;
  count: number;
  type: string;
}

export class GetFlowDetailDto extends GetFlowsDto {
  data: unknown;
  daily_stats: StatBucketDto[];
}

export class CompleteUpdateFlowDto {
  @IsString()
  name: string;
  @IsString()
  description: string;
  @IsString()
  @Length(3, 32)
  human_id: string;
  @IsString()
  @Length(3, 32)
  human_id_alias: string;
  @IsJSON()
  data: string;
}

export class UpdateFlowDto extends PartialType(CompleteUpdateFlowDto) {}

export class CreateFlowDto {
  @IsString()
  name: string;
}
