import { revenueFields } from "@/config/revenue";
import {
  getReportingEnd,
  getReportingStart,
  getReportingYear,
  isInReportingYear,
  type ReportingConfig,
} from "@/lib/date/reporting";
import { getDate, getNumber, getText } from "@/lib/ghl/customFields";
import type { GhlContact, GhlOpportunity } from "@/lib/ghl/models";
import type {
  RevenueClient,
  RevenueDashboard,
  RevenueSource,
} from "@/types/dashboard";

function minDate(...dates: Date[]): Date {
  return new Date(Math.min(...dates.map((date) => date.getTime())));
}

function monthsBetweenInclusive(start: Date, end: Date): number {
  if (end < start) return 0;
  return (
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    end.getUTCMonth() -
    start.getUTCMonth() +
    1
  );
}

export function getMonthsEarned(
  contractStart: Date | null,
  cancelled: Date | null,
  reporting: ReportingConfig,
  asOf = new Date(),
): number {
  if (!contractStart || contractStart > asOf) return 0;

  const reportingStart = getReportingStart(reporting, asOf);
  const effectiveStart =
    contractStart > reportingStart ? contractStart : reportingStart;
  const effectiveEnd = minDate(
    asOf,
    getReportingEnd(reporting, asOf),
    cancelled ?? asOf,
  );

  return monthsBetweenInclusive(effectiveStart, effectiveEnd);
}

function getContactId(opportunity: GhlOpportunity): string | undefined {
  return opportunity.contactId ?? opportunity.contact?.id;
}

function getClientName(contact: GhlContact): string {
  return (
    contact.companyName ||
    contact.contactName ||
    contact.name ||
    [contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
    "Unnamed client"
  );
}

function getOneTimeFeesByContact(
  opportunities: GhlOpportunity[],
  reporting: ReportingConfig,
  asOf: Date,
): Map<string, number> {
  const fees = new Map<string, number>();

  for (const opportunity of opportunities) {
    const wonDate = getDate(opportunity, revenueFields.wonDate);
    const contactId = getContactId(opportunity);
    if (!wonDate || !contactId || !isInReportingYear(wonDate, reporting, asOf)) {
      continue;
    }

    const fee = getNumber(opportunity, revenueFields.oneTimeFee);
    fees.set(contactId, (fees.get(contactId) ?? 0) + fee);
  }

  return fees;
}

function getCurrentMrr(contacts: GhlContact[], asOf: Date): number {
  return contacts.reduce((total, contact) => {
    const contractStart = getDate(contact, revenueFields.contractStart);
    const cancelled = getDate(contact, revenueFields.cancelled);
    const isActive =
      contractStart !== null &&
      contractStart <= asOf &&
      (cancelled === null || cancelled > asOf);

    return isActive ? total + getNumber(contact, revenueFields.mrr) : total;
  }, 0);
}

function createClientRows(
  contacts: GhlContact[],
  oneTimeFeesByContact: Map<string, number>,
  reporting: ReportingConfig,
  asOf: Date,
): RevenueClient[] {
  return contacts
    .map((contact): RevenueClient => {
      const mrr = getNumber(contact, revenueFields.mrr);
      const contractStart = getDate(contact, revenueFields.contractStart);
      const cancelledDate = getDate(contact, revenueFields.cancelled);
      const oneTimeFees = contact.id
        ? (oneTimeFeesByContact.get(contact.id) ?? 0)
        : 0;
      const monthsEarned = getMonthsEarned(
        contractStart,
        cancelledDate,
        reporting,
        asOf,
      );
      const ytdMrr = mrr * monthsEarned;
      const cancelled = cancelledDate !== null && cancelledDate <= asOf;

      return {
        id: contact.id ?? "",
        client: getClientName(contact),
        referralSource: getText(
          contact,
          revenueFields.referralSource,
          "Unassigned",
        ),
        package: getText(contact, revenueFields.package, "—"),
        mrr,
        ytdMrr,
        oneTimeFees,
        total: ytdMrr + oneTimeFees,
        cancelled,
      };
    })
    .filter((row) => row.mrr > 0 || row.oneTimeFees > 0)
    .sort((a, b) => b.total - a.total);
}

function createSourceRows(clientRows: RevenueClient[]): RevenueSource[] {
  const sources = new Map<string, Omit<RevenueSource, "source">>();

  for (const row of clientRows) {
    const source = sources.get(row.referralSource) ?? {
      clients: 0,
      mrr: 0,
      ytdMrr: 0,
      oneTimeFees: 0,
      total: 0,
    };
    source.clients += 1;
    source.mrr += row.mrr;
    source.ytdMrr += row.ytdMrr;
    source.oneTimeFees += row.oneTimeFees;
    source.total += row.total;
    sources.set(row.referralSource, source);
  }

  return [...sources.entries()]
    .map(([source, values]) => ({ source, ...values }))
    .sort((a, b) => b.total - a.total);
}

export function calculateRevenueDashboard(
  contacts: GhlContact[],
  opportunities: GhlOpportunity[],
  reporting: ReportingConfig,
  asOf = new Date(),
): RevenueDashboard {
  const oneTimeFeesByContact = getOneTimeFeesByContact(
    opportunities,
    reporting,
    asOf,
  );
  const clientRows = createClientRows(
    contacts,
    oneTimeFeesByContact,
    reporting,
    asOf,
  );
  const sourceRows = createSourceRows(clientRows);

  return {
    year: getReportingYear(reporting, asOf),
    generatedAt: asOf.toISOString(),
    summary: {
      currentMrr: getCurrentMrr(contacts, asOf),
      ytdMrr: clientRows.reduce((sum, row) => sum + row.ytdMrr, 0),
      oneTimeFees: clientRows.reduce(
        (sum, row) => sum + row.oneTimeFees,
        0,
      ),
      total: clientRows.reduce((sum, row) => sum + row.total, 0),
      cancelledClients: clientRows.filter((row) => row.cancelled).length,
    },
    clientRows,
    sourceRows,
  };
}
