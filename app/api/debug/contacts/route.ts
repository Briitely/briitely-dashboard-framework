import { NextResponse } from "next/server";
import { GhlClient } from "@/lib/ghl/client";

type ContactRecord = Record<string, unknown>;

type ContactsResponse = {
  contacts?: ContactRecord[];
  meta?: unknown;
  [key: string]: unknown;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const locationId = process.env.GHL_LOCATION_ID;

  if (!locationId) {
    return NextResponse.json(
      { error: "Missing GHL_LOCATION_ID environment variable." },
      { status: 500 },
    );
  }

  try {
    const client = new GhlClient();
    const data = await client.request<ContactsResponse>(
      `/contacts/?locationId=${encodeURIComponent(locationId)}&limit=20`,
    );

    const contacts = Array.isArray(data.contacts) ? data.contacts : [];
    const preferred = contacts.find((contact) => {
      const name = String(
        contact.contactName ??
          contact.name ??
          contact.companyName ??
          contact.firstName ??
          "",
      ).toLowerCase();

      return name.includes("scattered acres") || name.includes("inspired vacations");
    });

    return NextResponse.json({
      contactCount: contacts.length,
      sampleContact: preferred ?? contacts[0] ?? null,
      topLevelResponseKeys: Object.keys(data),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
