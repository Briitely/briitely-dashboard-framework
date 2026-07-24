export type GhlCustomFieldValue = string | number | boolean | null | string[];

export interface RawGhlCustomField {
  id?: string;
  key?: string;
  field_value?: GhlCustomFieldValue;
  fieldValue?: GhlCustomFieldValue;
  value?: GhlCustomFieldValue;
}

export interface NormalizedCustomFields {
  byId: Record<string, GhlCustomFieldValue>;
  byKey: Record<string, GhlCustomFieldValue>;
}
