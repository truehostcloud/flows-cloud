import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";
import { type FlowFrequency, FlowFrequencyEnum } from "db";

export class GetSdkFlowsDto {
  id: string;
  @ApiProperty({ enum: FlowFrequencyEnum, required: false })
  frequency: FlowFrequency | null;
  element?: string;
  steps: unknown[];
}

export class CreateEventDto {
  @Type(() => Date)
  @IsDate()
  eventTime: Date;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  userHash?: string;

  @IsString()
  flowId: string;

  @IsString()
  projectId: string;

  @IsString()
  @IsOptional()
  stepIndex?: string;

  @IsString()
  @IsOptional()
  stepHash?: string;

  @IsString()
  flowHash: string;
}
