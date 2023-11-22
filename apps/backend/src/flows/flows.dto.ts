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
