export class GetProjectsDto {
  id: string;
  human_id: string;
  human_id_alias: string | null;
  organization_id: string;
  name: string;
  description: string | null;
  domains: string[];
  created_at: Date;
  updated_at: Date;
}
