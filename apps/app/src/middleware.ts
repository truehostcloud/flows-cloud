import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { createClient } from "./auth/middleware";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next();

  const supabase = createClient(request, response);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  await supabase.auth.getSession();

  return response;
}
