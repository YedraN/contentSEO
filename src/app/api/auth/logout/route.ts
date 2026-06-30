import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { success: true, message: "Sesión cerrada" },
      { status: 200 }
    );

    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Error en logout:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
