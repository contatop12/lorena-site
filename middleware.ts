import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BLOCKED_PATH_PATTERNS: RegExp[] = [
  /^\/wp-admin(?:\/|$)/i,
  /^\/wp-login\.php$/i,
  /^\/xmlrpc\.php$/i,
  /^\/phpinfo\.php$/i,
  /^\/\.env(?:\.|$|\/|$)/i,
  /^\/\.git(?:\/|$)/i,
  /^\/(?:backup|tmp)(?:\/|$)/i,
  /wlwmanifest\.xml$/i,
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const shouldBlock = BLOCKED_PATH_PATTERNS.some((pattern) =>
    pattern.test(pathname)
  );

  if (shouldBlock) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)"],
};
