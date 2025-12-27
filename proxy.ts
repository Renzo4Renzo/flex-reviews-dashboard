import { NextResponse, NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const authCookie = request.cookies.get('auth');

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!authCookie || authCookie.value !== 'true') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
};
