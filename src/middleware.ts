import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
};

async function verifyToken(token: string): Promise<{ userId: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as { userId: string };
  } catch {
    return null;
  }
}

function isPublicPath(pathname: string): boolean {
  return (
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/features") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/api/auth/")
  );
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/generator") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/credits") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/articles") ||
    pathname.startsWith("/api/generate") ||
    pathname.startsWith("/api/credits") ||
    pathname.startsWith("/api/articles") ||
    pathname.startsWith("/api/user") ||
    pathname.startsWith("/api/stripe") ||
    pathname.startsWith("/api/wordpress") ||
    pathname.startsWith("/api/voice") ||
    pathname.startsWith("/api/clients")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Redirect logged-in users away from auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token) {
      const decoded = await verifyToken(token);
      if (decoded) {
        const response = NextResponse.redirect(new URL("/dashboard", request.url));
        applySecurityHeaders(response);
        return response;
      }
    }
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  // Protect dashboard and API routes
  if (isProtectedPath(pathname)) {
    if (!token) {
      const isApi = pathname.startsWith("/api/");
      if (isApi) {
        return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      const isApi = pathname.startsWith("/api/");
      if (isApi) {
        return NextResponse.json({ success: false, error: "Token inválido" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next();
  applySecurityHeaders(response);
  return response;
}

function applySecurityHeaders(response: NextResponse): void {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
