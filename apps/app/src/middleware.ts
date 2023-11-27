import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createClient } from "./auth/middleware";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createClient(request, response);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const sessionCookies = {
    name: "sb-admin-auth-token",
    value: JSON.stringify(session),
    path: "/",
    expires: new Date(new Date().getTime() + 60 * 60 * 1000 * 24 * 365), // 1 year,
  };

  response.cookies.set(sessionCookies);

  return response;
}
