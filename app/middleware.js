import { NextResponse } from "next/server";
import { parseCookies } from "nookies";

export function middleware(request) {
  const cookies = parseCookies({ req: request });
  const token = cookies.firebaseToken;

  if (token) {
    return NextResponse.next(); // If token exists, continue to the page
  } else {
    return NextResponse.redirect(new URL('/sign-in', request.url)); // Redirect to sign-in if no token
  }
}

export const config = {
  matcher: ['/shop-2/:path*'], // Protect these pages
};
