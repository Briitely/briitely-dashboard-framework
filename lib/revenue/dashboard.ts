import { clientConfig } from "@/config/client";
import { fetchAllContacts } from "@/lib/ghl/contacts";
import { fetchAllOpportunities } from "@/lib/ghl/opportunities";
import { calculateRevenueDashboard } from "@/lib/revenue/calculator";
import type { RevenueDashboard } from "@/types/dashboard";

export async function getRevenueDashboard(): Promise<RevenueDashboard> {
  const [contacts, opportunities] = await Promise.all([
    fetchAllContacts(),
    fetchAllOpportunities(),
  ]);

  return calculateRevenueDashboard(
    contacts,
    opportunities,
    clientConfig.reporting,
  );
}
