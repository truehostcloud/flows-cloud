import type { CookieMethods, CookieOptions } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";
import type { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies as nextHeadersCookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "../lib/constants";
import type { Auth } from "./types";

type GetAuthReturn = Promise<Auth | undefined>;

const getRouteCookies = (): CookieMethods => {
  const cookieStore = nextHeadersCookies();
  return {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
    set(name: string, value: string, options: CookieOptions) {
      cookieStore.set({ name, value, ...options } as RequestCookie);
    },
    remove(name: string, options: CookieOptions) {
      cookieStore.set({ name, value: "", ...options } as RequestCookie);
    },
  };
};
const getServerCmpCookies = (): CookieMethods => {
  const cookieStore = nextHeadersCookies();
  return {
    get(name: string) {
      return cookieStore.get(name)?.value;
    },
  };
};

export const getRouteClient = (): ReturnType<typeof createServerClient> => {
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: getRouteCookies(),
  });
};

const _getAuth = async (cookies: CookieMethods): GetAuthReturn => {
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies,
  });

  const result = await supabase.auth.getSession();

  if (result.error) {
    // TODO: handle error
    // eslint-disable-next-line no-console -- useful for debugging
    console.log(result.error);
  }
  if (!result.data.session) return;
  const session = result.data.session;

  return { token: session.access_token, user: { email: session.user.email ?? "" } };
};

export const getAuth = (): GetAuthReturn => _getAuth(getServerCmpCookies());

export const getMiddlewareAuth = async (
  request: NextRequest,
): Promise<{ auth: Auth | undefined; response: NextResponse }> => {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  return {
    response,
    auth: await _getAuth({
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
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
    }),
  };
};
