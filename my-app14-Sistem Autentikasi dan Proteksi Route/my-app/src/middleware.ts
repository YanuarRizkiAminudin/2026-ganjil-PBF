import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log("Middleware running for:", pathname); // cek di terminal

  // Hanya lindungi /profile
  if (pathname === "/profile") {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    console.log("Token found?", !!token);

    if (!token) {
      const url = new URL("/", request.url);
      console.log("Redirecting to:", url.toString());
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

// Pastikan middleware hanya berjalan untuk /profile
export const config = {
  matcher: "/profile",
};