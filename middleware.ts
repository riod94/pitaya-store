import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server";

export default auth((request: NextRequest) => {
  const { pathname } = request.nextUrl;
  
  // Get session dari auth
  const session = (request as any).auth;
  
  // Jika user sudah login tapi mencoba akses halaman login
  if (session?.user && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Jika user belum login tapi mencoba akses halaman yang memerlukan auth
  const protectedPaths = ['/dashboard', '/profile', '/orders', '/admin'];
  if (!session?.user && protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);
  return response;
})

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
