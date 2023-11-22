import { NextResponse } from "next/server";

import { getRouteClient } from "../../../auth/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const requestUrl = new URL(request.url);
  const client = getRouteClient();
  await client.auth.signOut();

  return NextResponse.redirect(`${requestUrl.origin}/login`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  });
}
