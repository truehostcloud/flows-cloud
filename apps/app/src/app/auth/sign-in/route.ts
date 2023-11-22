import { NextResponse } from "next/server";

import { getRouteClient } from "../../../auth/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const client = getRouteClient();

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=Could not authenticate user`, {
      // a 301 status is required to redirect from a POST to a GET route
      status: 301,
    });
  }

  return NextResponse.redirect(requestUrl.origin, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
