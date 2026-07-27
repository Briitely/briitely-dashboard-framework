export interface DateFormatOptions {
  locale?: string;
  timeZone?: string;
}

export function formatDate(
  value: Date | string | number,
  { locale = "en-CA", timeZone = "UTC" }: DateFormatOptions = {},
): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone,
  }).format(date);
}
