import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/supabase/auth';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect /admin routes
  if (pathname.startsWith('/admin')) {
    const session = await getAdminSession();

    if (!session) {
      // Redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
