import { getLocationId } from "@/config/client";
import { GhlClient } from "@/lib/ghl/client";
import type { GhlContact } from "@/lib/ghl/models";

type ContactsResponse = {
  contacts?: GhlContact[];
  meta?: {
    nextPageUrl?: string;
    nextPage?: string | number;
    total?: number;
  };
};

export async function fetchAllContacts(client = new GhlClient()): Promise<GhlContact[]> {
  const contacts: GhlContact[] = [];
  const locationId = getLocationId();
  let url: string | null = `/contacts/?locationId=${encodeURIComponent(locationId)}&limit=100`;
  const visited = new Set<string>();

  while (url && !visited.has(url)) {
    visited.add(url);
    const response: ContactsResponse = await client.request<ContactsResponse>(url);
    const page = response.contacts ?? [];
    contacts.push(...page);

    if (response.meta?.nextPageUrl) {
      url = response.meta.nextPageUrl;
    } else if (response.meta?.nextPage !== undefined && page.length > 0) {
      url = `/contacts/?locationId=${encodeURIComponent(locationId)}&limit=100&page=${encodeURIComponent(String(response.meta.nextPage))}`;
    } else {
      url = null;
    }
  }

  return contacts;
}
