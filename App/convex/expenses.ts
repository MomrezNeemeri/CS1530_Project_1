import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Housing",
  "School",
  "Other",
] as const;

function isCategory(value: string): boolean {
  return (EXPENSE_CATEGORIES as readonly string[]).includes(value);
}

function isIsoDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  const utc = new Date(Date.UTC(year, month - 1, day));
  return (
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day
  );
}

function monthBounds(month: string): { start: string; end: string } {
  const match = /^(\d{4})-(\d{2})$/.exec(month);
  if (!match) {
    throw new ConvexError("Month must be YYYY-MM.");
  }
  const year = Number(match[1]);
  const monthNumber = Number(match[2]);
  if (monthNumber < 1 || monthNumber > 12) {
    throw new ConvexError("Month must be YYYY-MM.");
  }
  const nextMonth = monthNumber === 12 ? 1 : monthNumber + 1;
  const nextYear = monthNumber === 12 ? year + 1 : year;
  return {
    start: `${match[1]}-${match[2]}-01`,
    end: `${String(nextYear).padStart(4, "0")}-${String(nextMonth).padStart(2, "0")}-01`,
  };
}

export const listExpenses = query({
  args: {
    month: v.string(),
  },
  handler: async (ctx, args) => {
    const { start, end } = monthBounds(args.month);
    const budget = await ctx.db
      .query("monthlyBudgets")
      .withIndex("by_month", (q) => q.eq("month", args.month))
      .unique();

    let spentCents = 0;
    const inMonth = ctx.db
      .query("expenses")
      .withIndex("by_date", (q) => q.gte("date", start).lt("date", end));
    for await (const expense of inMonth) {
      spentCents += expense.amountCents;
    }

    const budgetCents = budget?.amountCents ?? 0;
    const recent = await ctx.db.query("expenses").order("desc").take(100);
    recent.sort((a, b) => {
      if (a.date === b.date) {
        return 0;
      }
      return a.date < b.date ? 1 : -1;
    });

    return {
      month: args.month,
      spentCents,
      budgetCents,
      remainingCents: budgetCents - spentCents,
      expenses: recent.map((expense) => ({
        _id: expense._id,
        amountCents: expense.amountCents,
        category: expense.category,
        date: expense.date,
        location: expense.location,
      })),
    };
  },
});

export const addExpense = mutation({
  args: {
    amountCents: v.number(),
    category: v.string(),
    date: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (
      !Number.isSafeInteger(args.amountCents) ||
      args.amountCents <= 0
    ) {
      throw new ConvexError("Amount must be a positive number.");
    }
    if (!isCategory(args.category)) {
      throw new ConvexError("Category is required.");
    }

    const date = args.date?.trim() ?? "";
    if (date.length === 0 || !isIsoDate(date)) {
      throw new ConvexError("Date must be a valid calendar date.");
    }

    const location = args.location?.trim() ?? "";
    await ctx.db.insert("expenses", {
      amountCents: args.amountCents,
      category: args.category,
      date,
      location: location.length > 0 ? location : null,
    });
  },
});
