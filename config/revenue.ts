function fieldReferences(
  environmentVariable: string,
  ...fallbacks: string[]
): readonly string[] {
  const configured = process.env[environmentVariable]?.trim();
  return [...new Set([configured, ...fallbacks].filter(Boolean) as string[])];
}

export const revenueFields = {
  contractStart: fieldReferences(
    "GHL_FIELD_CONTRACT_START",
    "Dj4nv2hRJIHaVvFv5inf",
    "contact.renewal_date",
  ),
  cancelled: fieldReferences(
    "GHL_FIELD_CANCELLED",
    "HUh7k0BSaf0NzAzHobpT",
    "contact.cancelled_date",
  ),
  referralSource: fieldReferences(
    "GHL_FIELD_REFERRAL_SOURCE",
    "ojJ816hlcxer2BH3Lj9T",
  ),
  mrr: fieldReferences(
    "GHL_FIELD_MRR",
    "tgyWj8d4uc7vWUFylhgn",
    "contact.mrr",
  ),
  package: fieldReferences(
    "GHL_FIELD_PACKAGE",
    "Wcw1wNKccnUaSlXimTx1",
  ),
  oneTimeFee: fieldReferences(
    "GHL_FIELD_ONE_TIME_FEE",
    "kQZPEXLVMCUGw8eQMRi7",
    "opportunity.onetime_fee",
  ),
  wonDate: fieldReferences(
    "GHL_FIELD_WON_DATE",
    "VfCcsa3PkHcuCZ9sGPie",
    "opportunity.won_date",
  ),
} as const;
