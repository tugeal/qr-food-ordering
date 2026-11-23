import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Next.js 16 request proxy (the renamed middleware). It only runs for admin pages and admin APIs.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
