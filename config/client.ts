export interface ClientDashboardConfig {
  slug: string;
  name: string;
  locationId: string;
  contactFields: Record<string, string>;
  opportunityFields: Record<string, string>;
}

export function defineClientConfig(config: ClientDashboardConfig) {
  return config;
}

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} environment variable.`);
  return value;
}

function reportingYearStartMonth(): number {
  const value = Number(process.env.REPORTING_YEAR_START_MONTH ?? "1");
  if (!Number.isInteger(value) || value < 1 || value > 12) {
    throw new Error("REPORTING_YEAR_START_MONTH must be an integer from 1 through 12.");
  }
  return value;
}

export const clientConfig = {
  company: {
    name: process.env.CLIENT_NAME ?? "Briitely",
    timezone: process.env.CLIENT_TIMEZONE ?? "America/Edmonton",
    currency: process.env.CLIENT_CURRENCY ?? "CAD",
    locale: process.env.CLIENT_LOCALE ?? "en-US",
  },
  ghl: {
    locationId: requiredEnv("GHL_LOCATION_ID"),
  },
  reporting: {
    yearStartMonth: reportingYearStartMonth(),
  },
} as const;

export function getLocationId(): string {
  return clientConfig.ghl.locationId;
}
