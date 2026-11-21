import { ConvexError } from "convex/values";
import { useMutation } from "convex/react";
import { FormEvent, useState } from "react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import {
  EXPENSE_CATEGORIES,
  centsToAmountInput,
  parseAmountToCents,
} from "./money";

export type Expense = {
  _id: Id<"expenses">;
  amountCents: number;
  category: string;
  date: string;
  location: string | null;
};

// US2: Edit an Expense. Starts with the expense's current values.
// Save runs the same checks as Add; Cancel closes without saving anything.
export function EditExpenseForm({
  expense,
  onDone,
}: {
  expense: Expense;
  onDone: () => void;
}) {
  const updateExpense = useMutation(api.expenses.updateExpense);
  const [amount, setAmount] = useState(() =>
    centsToAmountInput(expense.amountCents),
  );
  const [category, setCategory] = useState(expense.category);
  const [date, setDate] = useState(expense.date);
  const [location, setLocation] = useState(expense.location ?? "");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const errorId = `edit-error-${expense._id}`;

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amountCents = parseAmountToCents(amount);
    if (amountCents === null) {
      setError("Amount must be a positive number.");
      return;
    }
    if (category.trim() === "") {
      setError("Category is required.");
      return;
    }
    if (date.trim() === "") {
      setError("Date is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await updateExpense({
        id: expense._id,
        amountCents,
        category,
        date: date.trim(),
        location: location.trim(),
      });
      onDone();
    } catch (caught) {
      setError(saveErrorMessage(caught));
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "rounded-md border-2 border-slate-300 bg-light px-3 py-2 text-dark dark:border-slate-700 dark:bg-dark dark:text-light";

  return (
    <form
      className="flex flex-col gap-4 rounded-md border-2 border-slate-400 p-4 dark:border-slate-600"
      onSubmit={(event) => {
        void onSave(event);
      }}
      noValidate
    >
      <h3 className="text-lg font-bold">Edit Expense</h3>
      <label className="flex flex-col gap-1 text-sm">
        Amount
        <input
          className={inputClass}
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          aria-describedby={error ? errorId : undefined}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Category
        <select
          className={inputClass}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Select a category</option>
          {EXPENSE_CATEGORIES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Date
        <input
          className={inputClass}
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Location
        <input
          className={inputClass}
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        <span className="text-xs text-slate-600 dark:text-slate-300">
          Optional. Clear it to remove the location.
        </span>
      </label>
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2 disabled:opacity-60"
        >
          Save
        </button>
        <button
          type="button"
          disabled={saving}
          className="text-sm px-4 py-2 rounded-md border-2 border-slate-300 dark:border-slate-700 disabled:opacity-60"
          onClick={onDone}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function saveErrorMessage(caught: unknown): string {
  if (caught instanceof ConvexError && typeof caught.data === "string") {
    return caught.data;
  }
  if (caught instanceof Error && caught.message.trim() !== "") {
    return caught.message;
  }
  return "Could not save the expense.";
}
