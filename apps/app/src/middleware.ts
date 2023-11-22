import type { NextRequest, NextResponse } from "next/server";

import { getMiddlewareAuth } from "./auth/server";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { response } = await getMiddlewareAuth(req);

  return response;
}
