import { revenueFields } from "@/config/revenue";
import { GhlClient } from "@/lib/ghl/client";

type CustomField = { id?: string; value?: unknown; fieldValue?: unknown; field_value?: unknown };
type Contact = {
  id?: string;
  contactName?: string;
  name?: string;
  companyName?: string;
  customFields?: CustomField[];
};
type Opportunity = {
  id?: string;
  contactId?: string;
  contact?: { id?: string };
  customFields?: CustomField[];
};

function fieldValue(fields: CustomField[] | undefined, id: string): unknown {
  const field = fields?.find((item) => item.id === id);
  return field?.value ?? field?.fieldValue ?? field?.field_value ?? null;
}

function numberValue(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[$,]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function dateValue(value: unknown): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const date = new Date(typeof value === "string" && /^\d+$/.test(value) ? Number(value) : (value as string | number));
  return Number.isNaN(date.getTime()) ? null : date;
}

function monthsEarned(start: Date | null, cancelled: Date | null, now: Date): number {
  if (!start || start > now) return 0;
  const yearStart = new Date(now.getFullYear(), 0, 1);
  const effectiveStart = start > yearStart ? start : yearStart;
  const effectiveEnd = cancelled && cancelled < now ? cancelled : now;
  if (effectiveEnd < effectiveStart) return 0;
  return (effectiveEnd.getFullYear() - effectiveStart.getFullYear()) * 12 + effectiveEnd.getMonth() - effectiveStart.getMonth() + 1;
}

export async function getRevenueDashboard() {
  const locationId = process.env.GHL_LOCATION_ID;
  if (!locationId) throw new Error("Missing GHL_LOCATION_ID environment variable.");

  const client = new GhlClient();
  const [contactsResponse, opportunitiesResponse] = await Promise.all([
    client.request<{ contacts?: Contact[] }>(`/contacts/?locationId=${encodeURIComponent(locationId)}&limit=100`),
    client.request<{ opportunities?: Opportunity[] }>(`/opportunities/search?location_id=${encodeURIComponent(locationId)}&limit=100`),
  ]);

  const contacts = contactsResponse.contacts ?? [];
  const opportunities = opportunitiesResponse.opportunities ?? [];
  const now = new Date();
  const year = now.getFullYear();

  const oneTimeByContact = new Map<string, number>();
  for (const opportunity of opportunities) {
    const wonDate = dateValue(fieldValue(opportunity.customFields, revenueFields.wonDate));
    if (!wonDate || wonDate.getFullYear() !== year) continue;
    const contactId = opportunity.contactId ?? opportunity.contact?.id;
    if (!contactId) continue;
    const fee = numberValue(fieldValue(opportunity.customFields, revenueFields.oneTimeFee));
    oneTimeByContact.set(contactId, (oneTimeByContact.get(contactId) ?? 0) + fee);
  }

  const clientRows = contacts
    .map((contact) => {
      const mrr = numberValue(fieldValue(contact.customFields, revenueFields.mrr));
      const contractStart = dateValue(fieldValue(contact.customFields, revenueFields.contractStart));
      const cancelled = dateValue(fieldValue(contact.customFields, revenueFields.cancelled));
      const oneTimeFees = contact.id ? oneTimeByContact.get(contact.id) ?? 0 : 0;
      const ytdMrr = mrr * monthsEarned(contractStart, cancelled, now);
      return {
        id: contact.id ?? "",
        client: contact.companyName || contact.contactName || contact.name || "Unnamed client",
        referralSource: String(fieldValue(contact.customFields, revenueFields.referralSource) ?? "Unassigned"),
        package: String(fieldValue(contact.customFields, revenueFields.package) ?? "—"),
        mrr,
        ytdMrr,
        oneTimeFees,
        total: ytdMrr + oneTimeFees,
        cancelled: Boolean(cancelled),
      };
    })
    .filter((row) => row.mrr > 0 || row.oneTimeFees > 0)
    .sort((a, b) => b.total - a.total);

  const sourceMap = new Map<string, { clients: number; mrr: number; ytdMrr: number; oneTimeFees: number; total: number }>();
  for (const row of clientRows) {
    const source = sourceMap.get(row.referralSource) ?? { clients: 0, mrr: 0, ytdMrr: 0, oneTimeFees: 0, total: 0 };
    source.clients += 1;
    source.mrr += row.mrr;
    source.ytdMrr += row.ytdMrr;
    source.oneTimeFees += row.oneTimeFees;
    source.total += row.total;
    sourceMap.set(row.referralSource, source);
  }

  const sourceRows = [...sourceMap.entries()]
    .map(([source, values]) => ({ source, ...values }))
    .sort((a, b) => b.total - a.total);

  return {
    year,
    generatedAt: now.toISOString(),
    summary: {
      oneTimeFees: clientRows.reduce((sum, row) => sum + row.oneTimeFees, 0),
      currentMrr: clientRows.filter((row) => !row.cancelled).reduce((sum, row) => sum + row.mrr, 0),
      ytdMrr: clientRows.reduce((sum, row) => sum + row.ytdMrr, 0),
      total: clientRows.reduce((sum, row) => sum + row.total, 0),
      cancelledClients: clientRows.filter((row) => row.cancelled).length,
    },
    clientRows,
    sourceRows,
  };
}
