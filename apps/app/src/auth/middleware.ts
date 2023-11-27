import { type CookieOptions, createServerClient } from "@supabase/ssr";
import { getCookie, setCookie } from "cookies-next";
import type { NextRequest, NextResponse } from "next/server";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export const createClient = (req: NextRequest, res: NextResponse) => {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return getCookie(name, { req, res });
      },
      set(name: string, value: string, options: CookieOptions) {
        // If the cookie is updated, update the cookies for the request and response
        setCookie(name, value, { req, res, ...options });
      },
      remove(name: string, options: CookieOptions) {
        // If the cookie is removed, update the cookies for the request and response
        setCookie(name, "", { req, res, ...options });
      },
    },
  });
};
