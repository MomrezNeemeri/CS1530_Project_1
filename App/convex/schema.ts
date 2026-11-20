import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  expenses: defineTable({
    amountCents: v.number(),
    category: v.string(),
    date: v.string(),
    location: v.union(v.string(), v.null()),
  }).index("by_date", ["date"]),
  // Month is YYYY-MM. US7 writes this; until a budget is set, remaining is 0 minus expenses.
  monthlyBudgets: defineTable({
    month: v.string(),
    amountCents: v.number(),
  }).index("by_month", ["month"]),
});
