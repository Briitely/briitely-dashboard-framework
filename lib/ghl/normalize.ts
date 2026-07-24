import type {
  GhlCustomFieldValue,
  NormalizedCustomFields,
  RawGhlCustomField,
} from "./types";

function readValue(field: RawGhlCustomField): GhlCustomFieldValue {
  if (field.field_value !== undefined) return field.field_value;
  if (field.fieldValue !== undefined) return field.fieldValue;
  if (field.value !== undefined) return field.value;
  return null;
}

export function normalizeCustomFields(
  fields: RawGhlCustomField[] | null | undefined,
): NormalizedCustomFields {
  const normalized: NormalizedCustomFields = { byId: {}, byKey: {} };

  for (const field of fields ?? []) {
    const value = readValue(field);
    if (field.id) normalized.byId[field.id] = value;
    if (field.key) normalized.byKey[field.key] = value;
  }

  return normalized;
}
