import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import type { Role } from "@prisma/client";

const SESSION_COOKIE = "royal_ci_session";

function getSecret() {
  return new TextEncoder().encode(process.env.SESSION_SECRET ?? "");
}

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as { role?: Role };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!session || session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  if (pathname.startsWith("/student") && !pathname.startsWith("/student/register")) {
    if (!session || session.role !== "STUDENT") {
      return NextResponse.redirect(new URL("/student-login", request.url));
    }
  }

  if (pathname === "/admin/login" && session?.role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/student/:path*"],
};
