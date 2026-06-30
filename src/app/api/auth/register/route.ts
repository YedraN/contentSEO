import { NextRequest, NextResponse } from "next/server";
import { registerUser, createToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/ratelimit";

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
    if (!rl.success) {
      return NextResponse.json(
        { success: false, error: "Demasiados registros desde esta IP. Espera 1 hora." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } }
      );
    }

    const { email, password, name, agencyName } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, contraseña y nombre son requeridos",
        },
        { status: 400 }
      );
    }

    const result = await registerUser(email, password, name, agencyName);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const token = await createToken(result.user!.id, 1);

    const response = NextResponse.json(
      {
        success: true,
        data: result.user,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    console.error("Error en registro:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
