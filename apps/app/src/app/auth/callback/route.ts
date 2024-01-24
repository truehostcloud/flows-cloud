import { createClient } from "auth/server";
import { cookies, headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { routes } from "routes";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createClient(cookies());
    await supabase.auth.exchangeCodeForSession(code);
  }

  const origin = headers().get("x-forwarded-host");
  const protocol = headers().get("x-forwarded-proto");
  const redirectTo = `${protocol}://${origin}${routes.home}`;

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(redirectTo);
}
