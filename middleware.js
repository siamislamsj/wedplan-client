import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";


export function middleware(req) {
  if (!getSessionCookie(req)) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("redirect", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/services/:path*", "/payment/:path*"] };
