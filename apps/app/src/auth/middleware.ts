import { type CookieOptions, createServerClient } from "@supabase/ssr";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { type NextRequest, NextResponse } from "next/server";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- not needed
export const createClient = (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        // If the cookie is updated, update the cookies for the request and response
        request.cookies.set({
          name,
          value,
          ...options,
        } as RequestCookie);
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value,
          ...options,
        } as RequestCookie);
      },
      remove(name: string, options: CookieOptions) {
        // If the cookie is removed, update the cookies for the request and response
        request.cookies.set({
          name,
          value: "",
          ...options,
        } as RequestCookie);
        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });
        response.cookies.set({
          name,
          value: "",
          ...options,
        } as RequestCookie);
      },
    },
  });

  return { supabase, response };
};
