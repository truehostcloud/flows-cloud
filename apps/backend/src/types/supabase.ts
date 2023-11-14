export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_event: {
        Row: {
          event_time: string
          flow_hash: string | null
          flow_id: string | null
          id: string
          project_id: string | null
          step_hash: string | null
          step_index: string | null
          type: string | null
          user_hash: string | null
        }
        Insert: {
          event_time: string
          flow_hash?: string | null
          flow_id?: string | null
          id?: string
          project_id?: string | null
          step_hash?: string | null
          step_index?: string | null
          type?: string | null
          user_hash?: string | null
        }
        Update: {
          event_time?: string
          flow_hash?: string | null
          flow_id?: string | null
          id?: string
          project_id?: string | null
          step_hash?: string | null
          step_index?: string | null
          type?: string | null
          user_hash?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

