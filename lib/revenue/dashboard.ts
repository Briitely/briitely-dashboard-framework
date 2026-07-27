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

  const dashboard = calculateRevenueDashboard(
    contacts,
    opportunities,
    clientConfig.reporting,
  );

  console.info("Revenue dashboard record counts", {
    contacts: contacts.length,
    opportunities: opportunities.length,
    clientRows: dashboard.clientRows.length,
    sourceRows: dashboard.sourceRows.length,
  });

  return dashboard;
}
