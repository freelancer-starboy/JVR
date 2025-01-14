import { NextResponse } from "next/server";
import { parseCookies } from "nookies";

export function middleware(request) {
  const token = request.cookies.get('firebaseToken')?.value;

  if(!token){
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  const response = NextResponse.next();
  response.headers.set('x-token', token)
  return response.redirect(new URL('/', request.url));
}

export const config = {
  matcher: ['/shop-2/:path*'], // Protect these pages
};
