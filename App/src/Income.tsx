import { useMutation, useQuery } from "convex/react";
import { FormEvent, useState } from "react";
import { api } from "../convex/_generated/api";
import {
  INCOME_FREQUENCIES,
  IncomeFrequency,
} from "../convex/incomeFrequency";
import { errorMessage } from "./errors";
import { formatCents, parseAmountToCents } from "./money";

const FREQUENCY_LABELS: Record<IncomeFrequency, string> = {
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
};

const INPUT_CLASS =
  "rounded-md border-2 border-slate-300 bg-light px-3 py-2 text-dark dark:border-slate-700 dark:bg-dark dark:text-light";
const BUTTON_CLASS =
  "bg-dark dark:bg-light text-light dark:text-dark text-sm px-4 py-2 rounded-md border-2 disabled:opacity-60";
const MUTED_TEXT_CLASS = "text-sm text-slate-600 dark:text-slate-300";

// The whole income area: monthly total, the add form, and the list.
export function IncomeSection() {
  const income = useQuery(api.incomeStreams.listIncomeStreams);
  const [formOpen, setFormOpen] = useState(false);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-bold">Income</h2>
        <p className="text-right">
          <span className={MUTED_TEXT_CLASS}>Total monthly income </span>
          <span className="text-xl font-bold">
            {income === undefined ? "…" : formatCents(income.totalMonthlyCents)}
          </span>
        </p>
      </div>
      <div>
        <button
          type="button"
          className={BUTTON_CLASS}
          onClick={() => setFormOpen((open) => !open)}
        >
          Add Income
        </button>
      </div>
      {formOpen ? <AddIncomeForm /> : null}
      <IncomeList streams={income?.streams} />
    </section>
  );
}

function AddIncomeForm() {
  const addIncomeStream = useMutation(api.incomeStreams.addIncomeStream);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<IncomeFrequency>("weekly");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onConfirm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (name.trim() === "") {
      setError("Name is required.");
      return;
    }
    const amountCents = parseAmountToCents(amount);
    if (amountCents === null) {
      setError("Amount must be a positive number.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await addIncomeStream({ name: name.trim(), amountCents, frequency });
      setName("");
      setAmount("");
      setFrequency("weekly");
    } catch (caught) {
      setError(errorMessage(caught, "Could not save the income stream."));
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
      <h3 className="text-lg font-bold">Add Income</h3>
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          className={INPUT_CLASS}
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Campus job"
          aria-describedby={error ? "income-error" : undefined}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Amount per paycheck
        <input
          className={INPUT_CLASS}
          inputMode="decimal"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="250.00"
          aria-describedby={error ? "income-error" : undefined}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Frequency
        <select
          className={INPUT_CLASS}
          value={frequency}
          onChange={(event) =>
            setFrequency(event.target.value as IncomeFrequency)
          }
        >
          {INCOME_FREQUENCIES.map((option) => (
            <option key={option} value={option}>
              {FREQUENCY_LABELS[option]}
            </option>
          ))}
        </select>
      </label>
      {error ? (
        <p
          id="income-error"
          role="alert"
          className="text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </p>
      ) : null}
      <div>
        <button type="submit" disabled={saving} className={BUTTON_CLASS}>
          Confirm
        </button>
      </div>
    </form>
  );
}

function IncomeList({
  streams,
}: {
  streams:
    | {
        _id: string;
        name: string;
        amountCents: number;
        frequency: IncomeFrequency;
        monthlyCents: number;
      }[]
    | undefined;
}) {
  if (streams === undefined) {
    return <p>Loading income…</p>;
  }
  if (streams.length === 0) {
    return (
      <p className={MUTED_TEXT_CLASS}>
        No income streams yet. Add one to see it here.
      </p>
    );
  }
  return (
    <ul className="flex flex-col gap-2">
      {streams.map((stream) => (
        <li
          key={stream._id}
          className="flex items-start justify-between gap-4 rounded-md border-2 border-slate-200 px-4 py-3 dark:border-slate-800"
        >
          <div>
            <p className="font-bold">{stream.name}</p>
            <p className={MUTED_TEXT_CLASS}>
              {formatCents(stream.amountCents)}{" "}
              {FREQUENCY_LABELS[stream.frequency].toLowerCase()}
            </p>
          </div>
          <p className="font-bold">{formatCents(stream.monthlyCents)} / month</p>
        </li>
      ))}
    </ul>
  );
}
