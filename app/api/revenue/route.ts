import { NextResponse } from "next/server";
import { getRevenueDashboard } from "@/lib/revenue/dashboard";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dashboard = await getRevenueDashboard();
    return NextResponse.json(dashboard, {
      headers: {
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Failed to build revenue dashboard", error);
    return NextResponse.json(
      { error: "Revenue data is temporarily unavailable." },
      {
        status: 500,
        headers: {
          "Cache-Control": "private, no-store",
        },
      },
    );
  }
}
