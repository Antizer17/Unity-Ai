import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Middleware
 *
 * TODO: Add authentication checking logic here.
 * For now, all requests pass through. Once the backend auth is integrated:
 * - Check for JWT token in cookies/headers
 * - Redirect unauthenticated users from /dashboard, /lectures to /login
 * - Redirect authenticated users from /login, /register to /dashboard
 */
export function middleware(request: NextRequest) {
  // Pass through all requests for now
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
};
