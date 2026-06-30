import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthenticatedUser(request);
    if (!auth) {
      return NextResponse.json({ success: false, error: "No autorizado" }, { status: 401 });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          credits: auth.user.credits,
          name: auth.user.name,
          subscriptionPlan: auth.user.subscriptionPlan,
          subscriptionStatus: auth.user.subscriptionStatus,
          articlesLimitPerMonth: auth.user.articlesLimitPerMonth,
          articlesUsedThisMonth: auth.user.articlesUsedThisMonth,
          billingCycleEnd: auth.user.billingCycleEnd,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verificando créditos:", (error as Error).message);
    return NextResponse.json(
      { success: false, error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
