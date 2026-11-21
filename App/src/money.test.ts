import { describe, expect, it } from "vitest";
import { centsToAmountInput, formatCents, parseAmountToCents } from "./money";

describe("parseAmountToCents", () => {
  it("converts a dollar string into cents", () => {
    expect(parseAmountToCents("12.50")).toBe(1250);
    expect(parseAmountToCents("0.05")).toBe(5);
    expect(parseAmountToCents("10")).toBe(1000);
  });

  it("rejects zero, negative, and extra-decimal amounts", () => {
    expect(parseAmountToCents("0")).toBeNull();
    expect(parseAmountToCents("-1")).toBeNull();
    expect(parseAmountToCents("12.345")).toBeNull();
  });
});

describe("centsToAmountInput", () => {
  it("prints cents as a plain dollar amount for an input box", () => {
    expect(centsToAmountInput(125050)).toBe("1250.50");
    expect(centsToAmountInput(5)).toBe("0.05");
    expect(centsToAmountInput(1000)).toBe("10.00");
  });

  it("round-trips through parseAmountToCents", () => {
    expect(parseAmountToCents(centsToAmountInput(43333))).toBe(43333);
  });
});

describe("formatCents", () => {
  it("prints cents as a signed dollar amount", () => {
    expect(formatCents(1250)).toBe("$12.50");
    expect(formatCents(-50)).toBe("-$0.50");
  });
});
