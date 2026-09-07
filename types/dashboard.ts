export interface RevenueSummary {
  currentMrr: number;
  ytdMrr: number;
  oneTimeFees: number;
  total: number;
  cancelledClients: number;
}

export interface RevenueClient {
  id: string;
  client: string;
  referralSource: string;
  directReferrer: string;
  revenueReferrer: string;
  package: string;
  mrr: number;
  ytdMrr: number;
  oneTimeFees: number;
  total: number;
  cancelled: boolean;
}

export interface RevenueReferrer {
  referrer: string;
  clients: number;
  mrr: number;
  ytdMrr: number;
  oneTimeFees: number;
  total: number;
}

export interface RevenueSource {
  source: string;
  clients: number;
  mrr: number;
  ytdMrr: number;
  oneTimeFees: number;
  total: number;
  referrers: RevenueReferrer[];
}

export interface RevenueDashboard {
  year: number;
  generatedAt: string;
  summary: RevenueSummary;
  clientRows: RevenueClient[];
  sourceRows: RevenueSource[];
}
