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
      `/contacts/?locationId=${encodeURIComponent(locationId)}&limit=100`,
    );

    const contacts = Array.isArray(data.contacts) ? data.contacts : [];

    const contactSummaries = contacts.map((contact) => ({
      id: contact.id ?? null,
      contactName: contact.contactName ?? contact.name ?? null,
      companyName: contact.companyName ?? null,
      customFields: Array.isArray(contact.customFields)
        ? contact.customFields
        : [],
    }));

    return NextResponse.json({
      contactCount: contacts.length,
      contacts: contactSummaries,
      topLevelResponseKeys: Object.keys(data),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
