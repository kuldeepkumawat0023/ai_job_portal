import { NextResponse, NextRequest } from 'next/server';

/**
 * 🛡️ Next.js Middleware for Admin Portal
 * Handles redirection of logged-in admins away from auth screens,
 * and restricts admin dashboard routes to authenticated admin sessions.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static assets, public files, next internals, and APIs from middleware check
  const isPublicAsset = 
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/icons') ||
    pathname.startsWith('/images');

  if (isPublicAsset) {
    return NextResponse.next();
  }
  
  // Get token and role from cookies
  const token = request.cookies.get('portal_token')?.value;
  const role = request.cookies.get('user_role')?.value;

  console.log('🛡️ [Middleware Debug] URL:', pathname, 'Token:', token ? 'exists' : 'null', 'Role:', role);

  const authPaths = [
    '/login',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/reactivate-account'
  ];

  const isAuthPath = authPaths.some(path => pathname === path);

  // 1. If admin user is already logged in and tries to access login/auth screens, redirect to dashboard root (/)
  if (isAuthPath && token && (role === 'admin' || role === 'super_admin')) {
    console.log('🛡️ [Middleware] Redirecting logged in admin to /');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Protect admin dashboard routes
  // If not logged in as admin/super_admin, redirect to /login
  if (!isAuthPath && (!token || (role !== 'admin' && role !== 'super_admin'))) {
    console.log('🛡️ [Middleware] Redirecting to /login because:', !token ? 'no token' : `invalid role: ${role}`);
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
