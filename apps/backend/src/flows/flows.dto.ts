import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsJSON, IsString, Length, MinLength } from "class-validator";
import type { FlowFrequency } from "db";
import { FlowFrequencyEnum, FlowType, FlowTypeEnum } from "db";

export class GetFlowsDto {
  id: string;
  human_id: string;
  human_id_alias: string | null;
  project_id: string;
  name: string;
  @ApiProperty({ enum: FlowTypeEnum })
  flow_type: FlowType;
  description: string;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
  @ApiProperty({ enum: FlowFrequencyEnum, required: false })
  frequency: FlowFrequency | null;
  preview_url: string | null;
}

export class GetFlowDetailDto extends GetFlowsDto {
  data?: unknown;
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
  @IsBoolean()
  published: boolean;
  @IsJSON()
  data: string;
  @IsEnum(FlowFrequencyEnum)
  @ApiProperty({ enum: FlowFrequencyEnum })
  frequency: FlowFrequencyEnum;
  @IsString()
  preview_url: string;
}

export class UpdateFlowDto extends PartialType(CompleteUpdateFlowDto) {}

export class CreateFlowDto {
  @IsString()
  @MinLength(3)
  name: string;
}

export class GetFlowVersionsDto {
  id: string;
  created_at: Date;
  data: unknown;
}

export class StatBucketDto {
  date: Date;
  count: number;
  type: string;
}
export class GetFlowAnalyticsDto {
  daily_stats: StatBucketDto[];
}
