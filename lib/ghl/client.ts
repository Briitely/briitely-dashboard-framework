const DEFAULT_API_URL = "https://services.leadconnectorhq.com";

export interface GhlClientOptions {
  accessToken?: string;
  apiVersion?: string;
  baseUrl?: string;
}

export class GhlClient {
  private readonly accessToken: string;
  private readonly apiVersion: string;
  private readonly baseUrl: string;

  constructor(options: GhlClientOptions = {}) {
    this.accessToken =
      options.accessToken ??
      process.env.GHL_PRIVATE_TOKEN ??
      process.env.GHL_API_KEY ??
      "";
    this.apiVersion = options.apiVersion ?? process.env.GHL_API_VERSION ?? "2021-07-28";
    this.baseUrl = options.baseUrl ?? DEFAULT_API_URL;
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    if (!this.accessToken) {
      throw new Error("Missing GHL_PRIVATE_TOKEN environment variable.");
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.accessToken}`,
        Version: this.apiVersion,
        ...init.headers,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`HighLevel request failed (${response.status}): ${body}`);
    }

    return response.json() as Promise<T>;
  }
}
