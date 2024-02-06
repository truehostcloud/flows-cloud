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
  location?: string;
  userProperties?: unknown;
  _incompleteSteps?: boolean;
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

  @IsString()
  sdkVersion: string;

  @IsString()
  @IsOptional()
  targetElement?: string;

  @IsString()
  location: string;
}

export class CreateEventResponseDto {
  id: string;
}
