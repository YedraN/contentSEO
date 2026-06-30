import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Demasiados intentos. Espera 15 minutos." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const result = await loginUser(email, password);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        data: result.user,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: result.token!,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Error en login:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
