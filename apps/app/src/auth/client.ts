import { createBrowserClient } from "@supabase/ssr";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export const createClient = () => createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
