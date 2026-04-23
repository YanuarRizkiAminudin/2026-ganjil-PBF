import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import withAuth from "./middleware/withAuth";

function middleware(request: NextRequest) {
  return NextResponse.next();
}

export default withAuth(middleware, ["/produk", "/about", "/admin", "/profile"]);

export const config = {
  matcher: ["/produk", "/about", "/admin", "/profile"],
};
