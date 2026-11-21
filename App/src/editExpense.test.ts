import { describe, expect, it } from "vitest";
import { validateExpenseInput } from "../convex/expenses";
import { centsToAmountInput, parseAmountToCents } from "./money";

// US2: the edit form is pre-filled from stored cents, so turning cents back
// into text and parsing it again must give the same amount.
describe("centsToAmountInput", () => {
  it("pre-fills the amount box with dollars and two decimals", () => {
    expect(centsToAmountInput(1250)).toBe("12.50");
    expect(centsToAmountInput(5)).toBe("0.05");
    expect(centsToAmountInput(1000)).toBe("10.00");
  });

  it("round-trips through parseAmountToCents unchanged", () => {
    for (const cents of [1, 99, 1250, 123456]) {
      expect(parseAmountToCents(centsToAmountInput(cents))).toBe(cents);
    }
  });
});

// US2: editing must apply the same rules as adding.
describe("validateExpenseInput", () => {
  const valid = {
    amountCents: 1250,
    category: "Food",
    date: "2026-11-20",
    location: "  Market Central ",
  };

  it("accepts a valid expense and trims the location", () => {
    expect(validateExpenseInput(valid)).toEqual({
      amountCents: 1250,
      category: "Food",
      date: "2026-11-20",
      location: "Market Central",
    });
  });

  it("clears the location when it is left blank", () => {
    expect(validateExpenseInput({ ...valid, location: "   " }).location).toBe(
      null,
    );
  });

  it("rejects a zero or negative amount", () => {
    expect(() => validateExpenseInput({ ...valid, amountCents: 0 })).toThrow();
    expect(() =>
      validateExpenseInput({ ...valid, amountCents: -500 }),
    ).toThrow();
  });

  it("rejects an unknown category and an impossible date", () => {
    expect(() =>
      validateExpenseInput({ ...valid, category: "Pizza" }),
    ).toThrow();
    expect(() =>
      validateExpenseInput({ ...valid, date: "2026-02-30" }),
    ).toThrow();
  });
});
