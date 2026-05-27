import { NextResponse, NextRequest } from 'next/server';

/**
 * 🛡️ Next.js Middleware for Admin Portal
 * Handles redirection of logged-in admins away from auth screens,
 * and restricts admin dashboard routes to authenticated admin sessions.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token and role from cookies
  const token = request.cookies.get('portal_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  const authPaths = [
    '/login',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/reactivate-account'
  ];

  const isAuthPath = authPaths.some(path => pathname === path);

  // 1. If admin user is already logged in and tries to access login/auth screens, redirect to dashboard root (/)
  if (isAuthPath && token && role === 'admin') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Protect admin dashboard routes
  // If not logged in as admin (no token or role !== admin), redirect to /login
  if (!isAuthPath && (!token || role !== 'admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (our public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
