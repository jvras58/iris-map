import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  if (!session || !session.user)
    return NextResponse.redirect(new URL("/auth", request.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth|map|forgot-password|recovery-password|$).*)",
  ],
};
