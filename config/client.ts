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
