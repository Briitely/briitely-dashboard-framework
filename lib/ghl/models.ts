export type GhlCustomField = {
  id?: string;
  key?: string;
  value?: unknown;
  fieldValue?: unknown;
  field_value?: unknown;
};

export type GhlContact = {
  id?: string;
  contactName?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  customFields?: GhlCustomField[];
};

export type GhlOpportunity = {
  id?: string;
  contactId?: string;
  contact?: { id?: string };
  customFields?: GhlCustomField[];
};
