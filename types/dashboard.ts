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
  package: string;
  mrr: number;
  ytdMrr: number;
  oneTimeFees: number;
  total: number;
  cancelled: boolean;
}

export interface RevenueSource {
  source: string;
  clients: number;
  mrr: number;
  ytdMrr: number;
  oneTimeFees: number;
  total: number;
}

export interface RevenueDashboard {
  year: number;
  generatedAt: string;
  summary: RevenueSummary;
  clientRows: RevenueClient[];
  sourceRows: RevenueSource[];
}
