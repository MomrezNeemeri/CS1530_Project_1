import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { frequencyValidator, toMonthlyCents } from "./incomeFrequency";

// Upper bound on how many streams one query reads.
const MAX_INCOME_STREAMS = 100;

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
    const name = args.name.trim();
    if (name.length === 0) {
      throw new ConvexError("Name is required.");
    }
    if (
      !Number.isSafeInteger(args.amountCents) ||
      args.amountCents <= 0
    ) {
      throw new ConvexError("Amount must be a positive number.");
    }

    await ctx.db.insert("incomeStreams", {
      name,
      amountCents: args.amountCents,
      frequency: args.frequency,
    });
  },
});
