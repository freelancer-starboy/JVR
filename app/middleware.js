import { NextResponse } from "next/server";

export function middleware(request) {
  const cookies = request.cookies.getAll();
  console.log(cookies); // Check if firebaseToken is present

  const token = cookies.find(cookie => cookie.name === 'firebaseToken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}
