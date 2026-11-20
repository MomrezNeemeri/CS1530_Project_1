import { describe, expect, it } from "vitest";
import { toMonthlyCents } from "../convex/incomeFrequency";

describe("toMonthlyCents", () => {
  it("leaves a monthly amount unchanged", () => {
    expect(toMonthlyCents(150000, "monthly")).toBe(150000);
  });

  it("converts weekly pay using 52 paychecks a year", () => {
    // $100.00 * 52 / 12 = $433.33
    expect(toMonthlyCents(10000, "weekly")).toBe(43333);
  });

  it("converts biweekly pay using 26 paychecks a year", () => {
    // $1,000.00 * 26 / 12 = $2,166.67
    expect(toMonthlyCents(100000, "biweekly")).toBe(216667);
  });

  it("rounds to the nearest cent", () => {
    // 1 cent weekly is 4.33 cents a month; 3 cents biweekly is 6.5 cents.
    expect(toMonthlyCents(1, "weekly")).toBe(4);
    expect(toMonthlyCents(3, "biweekly")).toBe(7);
  });
});
