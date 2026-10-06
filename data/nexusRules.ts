export interface NexusRule {
  state: string;
  code: string;
  salesThreshold: number;
  transactionThreshold: number | null;
  ruleType: "both" | "either" | "sales_only";
  notes?: string;
}

export const US_NEXUS_RULES: Record<string, NexusRule> = {
  AL: { state: "Alabama", code: "AL", salesThreshold: 250000, transactionThreshold: null, ruleType: "sales_only" },
  AK: { state: "Alaska", code: "AK", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  AZ: { state: "Arizona", code: "AZ", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  AR: { state: "Arkansas", code: "AR", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  CA: { state: "California", code: "CA", salesThreshold: 500000, transactionThreshold: null, ruleType: "sales_only" },
  CO: { state: "Colorado", code: "CO", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  CT: { state: "Connecticut", code: "CT", salesThreshold: 100000, transactionThreshold: 200, ruleType: "both" },
  DE: { state: "Delaware", code: "DE", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  FL: { state: "Florida", code: "FL", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  GA: { state: "Georgia", code: "GA", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  HI: { state: "Hawaii", code: "HI", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ID: { state: "Idaho", code: "ID", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  IL: { state: "Illinois", code: "IL", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  IN: { state: "Indiana", code: "IN", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  IA: { state: "Iowa", code: "IA", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  KS: { state: "Kansas", code: "KS", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  KY: { state: "Kentucky", code: "KY", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  LA: { state: "Louisiana", code: "LA", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ME: { state: "Maine", code: "ME", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MD: { state: "Maryland", code: "MD", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MA: { state: "Massachusetts", code: "MA", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MI: { state: "Michigan", code: "MI", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MN: { state: "Minnesota", code: "MN", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  MS: { state: "Mississippi", code: "MS", salesThreshold: 250000, transactionThreshold: null, ruleType: "sales_only" },
  MO: { state: "Missouri", code: "MO", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  MT: { state: "Montana", code: "MT", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  NE: { state: "Nebraska", code: "NE", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NV: { state: "Nevada", code: "NV", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NH: { state: "New Hampshire", code: "NH", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  NJ: { state: "New Jersey", code: "NJ", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  NM: { state: "New Mexico", code: "NM", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  NY: { state: "New York", code: "NY", salesThreshold: 500000, transactionThreshold: 100, ruleType: "both" },
  NC: { state: "North Carolina", code: "NC", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  ND: { state: "North Dakota", code: "ND", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  OH: { state: "Ohio", code: "OH", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  OK: { state: "Oklahoma", code: "OK", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  OR: { state: "Oregon", code: "OR", salesThreshold: 0, transactionThreshold: null, ruleType: "sales_only", notes: "No state sales tax" },
  PA: { state: "Pennsylvania", code: "PA", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  RI: { state: "Rhode Island", code: "RI", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  SC: { state: "South Carolina", code: "SC", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  SD: { state: "South Dakota", code: "SD", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  TN: { state: "Tennessee", code: "TN", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  TX: { state: "Texas", code: "TX", salesThreshold: 500000, transactionThreshold: null, ruleType: "sales_only" },
  UT: { state: "Utah", code: "UT", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  VT: { state: "Vermont", code: "VT", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  VA: { state: "Virginia", code: "VA", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  WA: { state: "Washington", code: "WA", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  WV: { state: "West Virginia", code: "WV", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" },
  WI: { state: "Wisconsin", code: "WI", salesThreshold: 100000, transactionThreshold: null, ruleType: "sales_only" },
  WY: { state: "Wyoming", code: "WY", salesThreshold: 100000, transactionThreshold: 200, ruleType: "either" }
};
