import { Injectable } from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types/supabase";

@Injectable()
export class SupabaseService {
  supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient(
      process.env.BACKEND_SUPABASE_URL,
      process.env.BACKEND_SUPABASE_SERVICE_ROLE_KEY,
    );
  }
}
