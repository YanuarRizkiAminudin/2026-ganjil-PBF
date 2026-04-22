// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isLogin = false; // ubah ke true untuk test akses

  if (isLogin) {
    return NextResponse.next();
  } else {
    // Redirect ke halaman login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
}

// Hanya terapkan untuk route /produk dan /about
export const config = {
  matcher: ['/produk', '/about'],
};