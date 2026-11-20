// Shared by the Convex backend and the React frontend, so the list of
// frequencies and the monthly conversion live in exactly one place.

import { v } from "convex/values";

export const INCOME_FREQUENCIES = ["weekly", "biweekly", "monthly"] as const;

export type IncomeFrequency = (typeof INCOME_FREQUENCIES)[number];

// Convex validator for the schema and function arguments. Keep it in step
// with INCOME_FREQUENCIES above.
export const frequencyValidator = v.union(
  v.literal("weekly"),
  v.literal("biweekly"),
  v.literal("monthly"),
);

// How many times each frequency is paid in a year.
const PAYMENTS_PER_YEAR: Record<IncomeFrequency, number> = {
  weekly: 52,
  biweekly: 26,
  monthly: 12,
};

// Converts one payment into its average monthly amount, rounded to the cent.
// Example: $100.00 weekly is 100 * 52 / 12 = $433.33 a month.
export function toMonthlyCents(
  amountCents: number,
  frequency: IncomeFrequency,
): number {
  return Math.round((amountCents * PAYMENTS_PER_YEAR[frequency]) / 12);
}
