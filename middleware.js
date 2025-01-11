import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get cookies from the request headers
  const token = request.cookies.get('firebaseToken')?.value;

  if (token) {
    return NextResponse.next(); // If token exists, continue to the page
  } else {
    return NextResponse.redirect(new URL('/sign-in', request.url)); // Redirect to sign-in if no token
  }
}

export const config = {
  matcher: ['/shop-2/:path*'], // Protect these pages
};
