
import { auth } from './auth';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(request: NextRequest) {
  
    const user = await auth();
    if(user && request.nextUrl.pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard/overview', request.url))
    }
    if (!user) {
        return NextResponse.redirect(new URL('/', request.url))
    }
  
}

export const config = { matcher: [ '/dashboard/:path*'] };
