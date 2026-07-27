export interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
}

export function formatCurrency(
  value: number,
  { currency = "CAD", locale = "en-CA" }: CurrencyFormatOptions = {},
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}
