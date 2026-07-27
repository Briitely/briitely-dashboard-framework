import { getLocationId } from "@/config/client";
import { GhlClient } from "@/lib/ghl/client";
import type { GhlOpportunity } from "@/lib/ghl/models";

type OpportunitiesResponse = {
  opportunities?: GhlOpportunity[];
  meta?: { nextPageUrl?: string; nextPage?: string | number };
};

export async function fetchAllOpportunities(client = new GhlClient()): Promise<GhlOpportunity[]> {
  const items: GhlOpportunity[] = [];
  const locationId = getLocationId();
  let url: string | null = `/opportunities/search?location_id=${encodeURIComponent(locationId)}&limit=100`;
  const visited = new Set<string>();

  while (url && !visited.has(url)) {
    visited.add(url);
    const response = await client.request<OpportunitiesResponse>(url);
    const page = response.opportunities ?? [];
    items.push(...page);

    if (response.meta?.nextPageUrl) url = response.meta.nextPageUrl;
    else if (response.meta?.nextPage !== undefined && page.length > 0) {
      url = `/opportunities/search?location_id=${encodeURIComponent(locationId)}&limit=100&page=${encodeURIComponent(String(response.meta.nextPage))}`;
    } else url = null;
  }

  return items;
}
