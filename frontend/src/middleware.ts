import { NextResponse, NextRequest } from 'next/server';

/**
 * 🛡️ Next.js Middleware
 * Handles persistent session redirection and route protection.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token and role from cookies
  const token = request.cookies.get('portal_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  // 1. If user is logged in and tries to access landing page (root) or auth pages
  if ((pathname === '/' || pathname === '/login' || pathname === '/register') && token) {
    if (role === 'candidate') {
      return NextResponse.redirect(new URL('/candidate/dashboard', request.url));
    }
    if (role === 'recruiter') {
      return NextResponse.redirect(new URL('/recruiter/dashboard', request.url));
    }
  }

  // 2. Protect candidate routes
  if (pathname.startsWith('/candidate') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 3. Protect recruiter routes
  if (pathname.startsWith('/recruiter') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/candidate/:path*',
    '/recruiter/:path*',
  ],
};
