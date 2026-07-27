export type GhlCustomField = {
  id?: string;
  key?: string;
  value?: unknown;
  fieldValue?: unknown;
  field_value?: unknown;
  fieldValueNumber?: unknown;
  fieldValueDate?: unknown;
  fieldValueString?: unknown;
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
  status?: string;
  lastStatusChangeAt?: string;
  createdAt?: string;
  customFields?: GhlCustomField[];
};
