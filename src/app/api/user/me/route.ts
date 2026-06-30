import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    const { user } = auth;
    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        agencyName: user.agencyName,
        credits: user.credits,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionStatus: user.subscriptionStatus,
        articlesLimitPerMonth: user.articlesLimitPerMonth,
        articlesUsedThisMonth: user.articlesUsedThisMonth,
        defaultLanguage: user.defaultLanguage,
        defaultTone: user.defaultTone,
      },
    });
  } catch (error) {
    console.error("Error obteniendo usuario:", (error as Error).message);
    return NextResponse.json({ success: false, error: "Error en el servidor" }, { status: 500 });
  }
}
