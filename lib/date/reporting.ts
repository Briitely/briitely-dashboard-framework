export interface ReportingConfig {
  yearStartMonth: number;
}

function getStartMonthIndex(reporting: ReportingConfig): number {
  const month = reporting.yearStartMonth;
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new RangeError("yearStartMonth must be an integer from 1 through 12.");
  }
  return month - 1;
}

/**
 * Returns the year in which the reporting period starts.
 *
 * For a calendar reporting year this is the calendar year. A reporting period
 * beginning in April 2026 is reporting year 2026, even though it ends in 2027.
 */
export function getReportingYear(
  reporting: ReportingConfig,
  date = new Date(),
): number {
  const startMonth = getStartMonthIndex(reporting);
  const calendarYear = date.getUTCFullYear();
  return date.getUTCMonth() >= startMonth ? calendarYear : calendarYear - 1;
}

export function getReportingStart(
  reporting: ReportingConfig,
  date = new Date(),
): Date {
  return new Date(
    Date.UTC(getReportingYear(reporting, date), getStartMonthIndex(reporting), 1),
  );
}

export function getReportingEnd(
  reporting: ReportingConfig,
  date = new Date(),
): Date {
  const nextStart = Date.UTC(
    getReportingYear(reporting, date) + 1,
    getStartMonthIndex(reporting),
    1,
  );
  return new Date(nextStart - 1);
}

export function isInReportingYear(
  value: Date,
  reporting: ReportingConfig,
  date = new Date(),
): boolean {
  const timestamp = value.getTime();
  return (
    Number.isFinite(timestamp) &&
    timestamp >= getReportingStart(reporting, date).getTime() &&
    timestamp <= getReportingEnd(reporting, date).getTime()
  );
}
