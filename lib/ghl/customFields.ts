import type { GhlCustomField } from "@/lib/ghl/models";

type HasCustomFields = { customFields?: GhlCustomField[] };
export type FieldReference = string | readonly string[];

function normalize(value: string | undefined): string {
  return value?.trim().toLowerCase() ?? "";
}

export function getFieldValue(
  record: HasCustomFields,
  reference: FieldReference,
): unknown {
  const references = (Array.isArray(reference) ? reference : [reference]).map(
    normalize,
  );
  const field = record.customFields?.find(
    (item) =>
      references.includes(normalize(item.id)) ||
      references.includes(normalize(item.key)),
  );

  return (
    field?.fieldValueNumber ??
    field?.fieldValueDate ??
    field?.fieldValueString ??
    field?.fieldValue ??
    field?.value ??
    field?.field_value ??
    null
  );
}

export function getText(
  record: HasCustomFields,
  reference: FieldReference,
  fallback = "",
): string {
  const value = getFieldValue(record, reference);
  if (value === null || value === undefined || value === "") return fallback;
  return Array.isArray(value) ? value.join(", ") : String(value);
}

export function getNumber(
  record: HasCustomFields,
  reference: FieldReference,
): number {
  const value = getFieldValue(record, reference);
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const parsed = Number(value.replace(/[$,]/g, "").trim());
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getDate(
  record: HasCustomFields,
  reference: FieldReference,
): Date | null {
  const value = getFieldValue(record, reference);
  if (value === null || value === undefined || value === "") return null;
  const input = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  const date = new Date(input as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date;
}
