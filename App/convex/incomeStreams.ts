import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { frequencyValidator, toMonthlyCents } from "./incomeFrequency";

// Upper bound on how many streams one query reads.
const MAX_INCOME_STREAMS = 100;

// Rules shared by adding and editing. Returns the trimmed name, or throws a
// message the form shows to the user.
function validateIncomeFields(name: string, amountCents: number): string {
  const trimmedName = name.trim();
  if (trimmedName.length === 0) {
    throw new ConvexError("Name is required.");
  }
  if (!Number.isSafeInteger(amountCents) || amountCents <= 0) {
    throw new ConvexError("Amount must be a positive number.");
  }
  return trimmedName;
}

export const listIncomeStreams = query({
  args: {},
  handler: async (ctx) => {
    const streams = await ctx.db
      .query("incomeStreams")
      .order("desc")
      .take(MAX_INCOME_STREAMS);

    const withMonthly = streams.map((stream) => ({
      _id: stream._id,
      name: stream.name,
      amountCents: stream.amountCents,
      frequency: stream.frequency,
      monthlyCents: toMonthlyCents(stream.amountCents, stream.frequency),
    }));

    let totalMonthlyCents = 0;
    for (const stream of withMonthly) {
      totalMonthlyCents += stream.monthlyCents;
    }

    return { totalMonthlyCents, streams: withMonthly };
  },
});

export const addIncomeStream = mutation({
  args: {
    name: v.string(),
    amountCents: v.number(),
    frequency: frequencyValidator,
  },
  handler: async (ctx, args) => {
    const name = validateIncomeFields(args.name, args.amountCents);
    await ctx.db.insert("incomeStreams", {
      name,
      amountCents: args.amountCents,
      frequency: args.frequency,
    });
  },
});

export const updateIncomeStream = mutation({
  args: {
    id: v.id("incomeStreams"),
    name: v.string(),
    amountCents: v.number(),
    frequency: frequencyValidator,
  },
  handler: async (ctx, args) => {
    const name = validateIncomeFields(args.name, args.amountCents);
    const existing = await ctx.db.get("incomeStreams", args.id);
    if (existing === null) {
      throw new ConvexError("Income stream not found.");
    }
    await ctx.db.patch("incomeStreams", args.id, {
      name,
      amountCents: args.amountCents,
      frequency: args.frequency,
    });
  },
});
