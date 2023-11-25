import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString } from "class-validator";

export class GetSdkFlowsDto {
  id: string;
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
