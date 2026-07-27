"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format/currency";
import type { RevenueDashboard } from "@/types/dashboard";

interface RevenueDashboardWidgetProps {
  companyName: string;
  currency: string;
  locale: string;
}

type DashboardState =
  | { status: "loading" }
  | { status: "ready"; dashboard: RevenueDashboard }
  | { status: "error"; message: string };

function isRevenueDashboard(value: unknown): value is RevenueDashboard {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<RevenueDashboard>;
  return (
    typeof candidate.year === "number" &&
    typeof candidate.generatedAt === "string" &&
    Array.isArray(candidate.clientRows) &&
    Array.isArray(candidate.sourceRows) &&
    candidate.summary !== null &&
    typeof candidate.summary === "object"
  );
}

export function RevenueDashboardWidget({
  companyName,
  currency,
  locale,
}: RevenueDashboardWidgetProps) {
  const [state, setState] = useState<DashboardState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function loadDashboard() {
      try {
        const response = await fetch("/api/revenue", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            data && typeof data === "object" && "error" in data
              ? String(data.error)
              : "Revenue data is temporarily unavailable.";
          throw new Error(message);
        }
        if (!isRevenueDashboard(data)) {
          throw new Error("Revenue data returned an unexpected response.");
        }

        setState({ status: "ready", dashboard: data });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "Revenue data is temporarily unavailable.",
        });
      }
    }

    void loadDashboard();
    return () => controller.abort();
  }, []);

  const money = (value: number) =>
    formatCurrency(value, { currency, locale });

  if (state.status === "loading") {
    return (
      <section className="dashboardState" aria-live="polite">
        <span className="loadingDot" aria-hidden="true" />
        Loading revenue dashboard…
      </section>
    );
  }

  if (state.status === "error") {
    return (
      <section className="dashboardState dashboardError" role="alert">
        <strong>Revenue dashboard unavailable</strong>
        <span>{state.message}</span>
      </section>
    );
  }

  const { dashboard } = state;
  const summaryCards = [
    ["Current MRR", money(dashboard.summary.currentMrr)],
    ["YTD MRR", money(dashboard.summary.ytdMrr)],
    ["One-time fees", money(dashboard.summary.oneTimeFees)],
    ["Total revenue", money(dashboard.summary.total)],
  ] as const;

  return (
    <main className="dashboardShell">
      <header className="dashboardHeader">
        <div>
          <div className="eyebrow">{companyName}</div>
          <h1>Revenue dashboard</h1>
          <p>
            Reporting year {dashboard.year} · Updated{" "}
            {new Intl.DateTimeFormat(locale, {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(dashboard.generatedAt))}
          </p>
        </div>
        <div className="status">
          <span className="statusDot" aria-hidden="true" />
          Live data
        </div>
      </header>

      <section className="summaryGrid" aria-label="Revenue summary">
        {summaryCards.map(([label, value]) => (
          <article className="metricCard" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="dashboardGrid">
        <article className="dataCard">
          <div className="cardHeading">
            <div>
              <span className="sectionLabel">Acquisition</span>
              <h2>Revenue by referral source</h2>
            </div>
            <span>{dashboard.sourceRows.length} sources</span>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Clients</th>
                  <th>YTD MRR</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.sourceRows.map((row) => (
                  <tr key={row.source}>
                    <td>{row.source}</td>
                    <td>{row.clients}</td>
                    <td>{money(row.ytdMrr)}</td>
                    <td className="totalCell">{money(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="dataCard clientsCard">
          <div className="cardHeading">
            <div>
              <span className="sectionLabel">Accounts</span>
              <h2>Client revenue</h2>
            </div>
            <span>{dashboard.clientRows.length} clients</span>
          </div>
          <div className="tableWrap">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Source</th>
                  <th>MRR</th>
                  <th>YTD total</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.clientRows.map((row) => (
                  <tr key={row.id || row.client}>
                    <td>
                      <span className="clientName">{row.client}</span>
                      <span className="clientPackage">{row.package}</span>
                    </td>
                    <td>{row.referralSource}</td>
                    <td>{money(row.mrr)}</td>
                    <td className="totalCell">{money(row.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
