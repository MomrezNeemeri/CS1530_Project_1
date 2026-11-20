import { useMutation, useQuery } from "convex/react";
import { FormEvent, useState } from "react";
import { api } from "../convex/_generated/api";
import { errorMessage } from "./errors";
import { IncomeSection } from "./Income";
import {
  EXPENSE_CATEGORIES,
  currentMonth,
  formatCents,
  formatIsoDate,
  formatMonthLabel,
  parseAmountToCents,
  todayLocal,
} from "./money";

export default function App() {
  const month = currentMonth();
  const summary = useQuery(api.expenses.listExpenses, { month });
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        <div className="mx-auto flex max-w-3xl items-baseline justify-between gap-4">
          <p className="text-lg font-bold">MoMoneyMoProblems</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {formatMonthLabel(month)}
          </p>
        </div>
      </header>
      <main className="mx-auto flex max-w-3xl flex-col gap-8 p-6">
        <section className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Spent this month"
            value={
              summary === undefined ? "…" : formatCents(summary.spentCents)
            }
          />
          <SummaryCard
            label="Monthly budget"
            value={
              summary === undefined ? "…" : formatCents(summary.budgetCents)
            }
          />
          <SummaryCard
            label="Remaining"
            value={
              summary === undefined
                ? "…"
                : formatCents(summary.remainingCents)
            }
            negative={
              summary !== undefined && summary.remainingCents < 0
            }
          />
        </section>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Remaining budget is this month&apos;s budget minus this month&apos;s
          expenses. Until a budget is set, the budget is $0.00.
        </p>
        <div>
          <button
            type="button"
            className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2"
            onClick={() => setFormOpen((open) => !open)}
          >
            Add Expense
          </button>
        </div>
        {formOpen ? <AddExpenseForm /> : null}
        <ExpenseList
          expenses={summary?.expenses}
          loading={summary === undefined}
        />
        <IncomeSection />
      </main>
    </>
  );
}

function SummaryCard({
  label,
  value,
  negative = false,
}: {
  label: string;
  value: string;
  negative?: boolean;
}) {
  return (
    <div className="rounded-md border-2 border-slate-200 bg-slate-100 p-4 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-bold ${negative ? "text-red-600 dark:text-red-400" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

function AddExpenseForm() {
  const addExpense = useMutation(api.expenses.addExpense);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(todayLocal);
  const [location, setLocation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onConfirm(event: FormEvent<HTMLFormElement>) {
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

    const expenseDate = date.trim() === "" ? todayLocal() : date.trim();
    setSaving(true);
    setError(null);
    try {
      await addExpense({
        amountCents,
        category,
        date: expenseDate,
        location: location.trim() === "" ? undefined : location.trim(),
      });
      setAmount("");
      setCategory("");
      setDate(todayLocal());
      setLocation("");
    } catch (caught) {
      setError(errorMessage(caught, "Could not save the expense."));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="flex flex-col gap-4 rounded-md border-2 border-slate-200 p-4 dark:border-slate-800"
      onSubmit={(event) => {
        void onConfirm(event);
      }}
      noValidate
    >
      <h2 className="text-xl font-bold">Add Expense</h2>
      <label className="flex flex-col gap-1 text-sm">
        Amount
        <input
          className="rounded-md border-2 border-slate-300 bg-light px-3 py-2 text-dark dark:border-slate-700 dark:bg-dark dark:text-light"
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="12.50"
          aria-describedby={error ? "expense-error" : undefined}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Category
        <select
          className="rounded-md border-2 border-slate-300 bg-light px-3 py-2 text-dark dark:border-slate-700 dark:bg-dark dark:text-light"
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
          className="rounded-md border-2 border-slate-300 bg-light px-3 py-2 text-dark dark:border-slate-700 dark:bg-dark dark:text-light"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <span className="text-xs text-slate-600 dark:text-slate-300">
          Optional. Defaults to today if left blank.
        </span>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Location
        <input
          className="rounded-md border-2 border-slate-300 bg-light px-3 py-2 text-dark dark:border-slate-700 dark:bg-dark dark:text-light"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          placeholder="Campus store"
        />
        <span className="text-xs text-slate-600 dark:text-slate-300">
          Optional.
        </span>
      </label>
      {error ? (
        <p id="expense-error" role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      <div>
        <button
          type="submit"
          disabled={saving}
          className="bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2 disabled:opacity-60"
        >
          Confirm
        </button>
      </div>
    </form>
  );
}

function ExpenseList({
  expenses,
  loading,
}: {
  expenses:
    | {
        _id: string;
        amountCents: number;
        category: string;
        date: string;
        location: string | null;
      }[]
    | undefined;
  loading: boolean;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-bold">Expenses</h2>
      {loading ? <p>Loading expenses…</p> : null}
      {!loading && expenses?.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No expenses yet. Add one to see it here.
        </p>
      ) : null}
      <ul className="flex flex-col gap-2">
        {expenses?.map((expense) => (
          <li
            key={expense._id}
            className="flex items-start justify-between gap-4 rounded-md border-2 border-slate-200 px-4 py-3 dark:border-slate-800"
          >
            <div>
              <p className="font-bold">{expense.category}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {formatIsoDate(expense.date)}
                {expense.location ? ` · ${expense.location}` : ""}
              </p>
            </div>
            <p className="font-bold">{formatCents(expense.amountCents)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
