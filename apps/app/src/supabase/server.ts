import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "lib/constants";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { type cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options } as ResponseCookie);
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options } as ResponseCookie);
        } catch (error) {
          // The `delete` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}
