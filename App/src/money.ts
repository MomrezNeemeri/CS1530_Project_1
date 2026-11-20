export const EXPENSE_CATEGORIES = [
  "Food",
  "Transportation",
  "Entertainment",
  "Housing",
  "School",
  "Other",
] as const;

export function todayLocal(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function currentMonth(): string {
  return todayLocal().slice(0, 7);
}

export function parseAmountToCents(raw: string): number | null {
  const trimmed = raw.trim();
  if (!/^(\d+(\.\d{1,2})?|\.\d{1,2})$/.test(trimmed)) {
    return null;
  }
  const [wholePart, fractionPart = ""] = trimmed.split(".");
  const whole = wholePart === "" ? 0 : Number(wholePart);
  const fraction = Number(fractionPart.padEnd(2, "0"));
  if (!Number.isSafeInteger(whole) || !Number.isSafeInteger(fraction)) {
    return null;
  }
  const cents = whole * 100 + fraction;
  if (!Number.isSafeInteger(cents) || cents <= 0) {
    return null;
  }
  return cents;
}

export function formatCents(cents: number): string {
  const sign = cents < 0 ? "-" : "";
  const absolute = Math.abs(cents);
  const dollars = Math.floor(absolute / 100);
  const remainder = String(absolute % 100).padStart(2, "0");
  return `${sign}$${dollars.toLocaleString("en-US")}.${remainder}`;
}

export function formatIsoDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) {
    return iso;
  }
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatMonthLabel(month: string): string {
  const [year, monthNumber] = month.split("-").map(Number);
  if (!year || !monthNumber) {
    return month;
  }
  return new Date(year, monthNumber - 1, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
