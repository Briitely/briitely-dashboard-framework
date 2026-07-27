import type { GhlCustomField } from "@/lib/ghl/models";

type HasCustomFields = { customFields?: GhlCustomField[] };

export function getFieldValue(record: HasCustomFields, fieldId: string): unknown {
  const field = record.customFields?.find((item) => item.id === fieldId || item.key === fieldId);
  return field?.value ?? field?.fieldValue ?? field?.field_value ?? null;
}

export function getText(record: HasCustomFields, fieldId: string, fallback = ""): string {
  const value = getFieldValue(record, fieldId);
  if (value === null || value === undefined || value === "") return fallback;
  return Array.isArray(value) ? value.join(", ") : String(value);
}

export function getNumber(record: HasCustomFields, fieldId: string): number {
  const value = getFieldValue(record, fieldId);
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const parsed = Number(value.replace(/[$,]/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getDate(record: HasCustomFields, fieldId: string): Date | null {
  const value = getFieldValue(record, fieldId);
  if (value === null || value === undefined || value === "") return null;
  const input = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  const date = new Date(input as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date;
}
