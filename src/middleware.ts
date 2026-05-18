import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

const publicRoutes = ["/", "/login", "/register", "/api/auth/login", "/api/auth/register"];
const protectedRoutes = ["/dashboard", "/api/generate", "/api/credits"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Obtener token del header
  const token = request.cookies.get("token")?.value;

  // Si es ruta pública, permite acceso
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // Si tiene token y accede a login/register, redirige a dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Si es ruta protegida y no tiene token, redirige a login
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verificar validez del token
    const decoded = await verifyToken(token);
    if (!decoded) {
      // Token inválido, redirige a login
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
