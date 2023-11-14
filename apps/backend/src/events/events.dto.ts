import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @IsDateString()
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
