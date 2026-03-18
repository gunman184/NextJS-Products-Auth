import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("jwt");
  console.log("COOKIE:", refreshToken);

  const isPublic =
    pathname.startsWith("/login") || pathname.startsWith("/register");

  if (!refreshToken && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (refreshToken && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
