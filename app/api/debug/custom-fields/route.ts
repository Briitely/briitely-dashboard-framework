import { NextResponse } from "next/server";
import { getLocationId } from "@/config/client";
import { GhlClient } from "@/lib/ghl/client";

type CustomField = {
  id?: string;
  name?: string;
  fieldKey?: string;
  key?: string;
  model?: string;
};

type CustomFieldsResponse = {
  customFields?: CustomField[];
};

export async function GET() {
  try {
    const client = new GhlClient();
    const locationId = getLocationId();
    const data = await client.request<CustomFieldsResponse>(
      `/locations/${encodeURIComponent(locationId)}/customFields?model=contact`,
    );

    const matches = (data.customFields ?? [])
      .filter((field) => {
        const haystack = `${field.name ?? ""} ${field.fieldKey ?? ""} ${field.key ?? ""}`.toLowerCase();
        return haystack.includes("direct referrer") ||
          haystack.includes("direct_referrer") ||
          haystack.includes("revenue referrer") ||
          haystack.includes("revenue_referrer");
      })
      .map((field) => ({
        id: field.id ?? "",
        name: field.name ?? "",
        key: field.fieldKey ?? field.key ?? "",
        model: field.model ?? "",
      }));

    return NextResponse.json({ fields: matches });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Custom field lookup failed." },
      { status: 500 },
    );
  }
}
