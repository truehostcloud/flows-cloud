import { Global, Injectable } from "@nestjs/common";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types/supabase";

@Global()
@Injectable()
export class SupabaseService {
  supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    );
  }
}
