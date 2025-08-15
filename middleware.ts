import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // Check if the request is for a dashboard route
  const requestUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // If no token, redirect to login
    if (!token) {
      const loginUrl = new URL("/auth/login", requestUrl);
      loginUrl.searchParams.set("callbackUrl", requestUrl);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access control
    let role = "";
    if (
      typeof token?.user === "object" &&
      token.user &&
      "role" in token.user &&
      typeof token.user.role === "string"
    ) {
      role = token.user.role.toLowerCase();
    } else if (typeof token?.role === "string") {
      role = token.role.toLowerCase();
    }
    const pathname = request.nextUrl.pathname;

    // Route to allowed roles mapping
    const routeRoles = [
      { pattern: /^\/dashboard$/, roles: ["everybody"] },
      { pattern: /^\/dashboard\/orders(\/.*)?$/, roles: ["everybody"] },
      {
        pattern: /^\/dashboard\/distributors(\/.*)?$/,
        roles: ["super-admin", "operations"],
      },
      {
        pattern: /^\/dashboard\/ime-vss(\/.*)?$/,
        roles: ["super-admin", "operations"],
      },
      { pattern: /^\/dashboard\/users(\/.*)?$/, roles: ["super-admin"] },
      {
        pattern: /^\/dashboard\/brands(\/.*)?$/,
        roles: ["super-admin", "operations"],
      },
      {
        pattern: /^\/dashboard\/markets(\/.*)?$/,
        roles: ["super-admin", "operations"],
      },
      {
        pattern: /^\/dashboard\/locations(\/.*)?$/,
        roles: ["super-admin", "operations"],
      },
      {
        pattern: /^\/dashboard\/deliveries(\/.*)?$/,
        roles: ["super-admin", "operations"],
      },
      {
        pattern: /^\/dashboard\/vehicles(\/.*)?$/,
        roles: ["super-admin", "operations"],
      },
      {
        pattern: /^\/dashboard\/warehouses(\/.*)?$/,
        roles: ["super-admin", "operations"],
      },
      { pattern: /^\/dashboard\/roles(\/.*)?$/, roles: ["super-admin"] },
      { pattern: /^\/dashboard\/reports(\/.*)?$/, roles: ["everybody"] },
      { pattern: /^\/dashboard\/settings(\/.*)?$/, roles: ["everybody"] },
    ];

    const matched = routeRoles.find((r) => r.pattern.test(pathname));
    if (matched) {
      if (
        !(matched.roles.includes("everybody") || matched.roles.includes(role))
      ) {
        // Redirect to dashboard if not authorized
        return NextResponse.redirect(new URL("/dashboard", requestUrl));
      }
    }
  }

  // If accessing login page while authenticated, redirect to dashboard
  if (request.nextUrl.pathname === "/auth/login") {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      return NextResponse.redirect(new URL("/dashboard", requestUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/login"],
};
