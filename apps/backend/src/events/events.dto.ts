import { IsDateString, IsString } from "class-validator";

export class CreateEventDto {
  @IsDateString()
  event_time: Date;

  @IsString()
  action: string;

  @IsString()
  user_hash: string;

  @IsString()
  flow_id: string;

  @IsString()
  project_id: string;

  @IsString()
  step_index: string;

  @IsString()
  step_hash: string;

  @IsString()
  flow_hash: string;
}
