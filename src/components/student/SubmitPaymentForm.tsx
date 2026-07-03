"use client";

import { useActionState, useRef, useState } from "react";
import { QrCode } from "lucide-react";
import { submitPaymentAction } from "@/actions/student/payments";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type ActionState = { error?: string; success?: string } | null;

type Props = {
  dueAmount: number;
};

export function SubmitPaymentForm({ dueAmount }: Props) {
  const [state, action, pending] = useActionState(submitPaymentAction, null as ActionState);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const today = new Date().toISOString().split("T")[0];

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  }

  if (state?.success) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-3">
          <div className="text-4xl">✅</div>
          <p className="font-extrabold text-[var(--ui-primary)]">Payment Submitted!</p>
          <p className="text-sm text-[var(--ui-muted)]">{state.success}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="mb-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <QrCode className="h-24 w-24 text-[var(--ui-primary)] mb-3 opacity-80" />
        <p className="font-bold text-[var(--ui-primary)]">Scan to Pay via UPI</p>
        <p className="text-sm text-[var(--ui-muted)] mt-1">UPI ID: royalcomputer@upi</p>
      </div>

      <p className="mb-1 font-extrabold text-[var(--ui-primary)]">Submit Payment Details</p>
      <p className="mb-4 text-sm text-[var(--ui-muted)]">
        Balance due: <span className="font-semibold text-[var(--ui-text)]">₹{dueAmount.toLocaleString("en-IN")}</span>
      </p>

      {state?.error && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <form action={action} className="grid gap-4">
        <Field label="Amount Paid (₹)" htmlFor="sp-amount">
          <Input
            id="sp-amount"
            name="amount"
            type="number"
            min={1}
            max={dueAmount}
            step={1}
            required
            placeholder={`Max: ₹${dueAmount.toLocaleString("en-IN")}`}
          />
        </Field>

        <Field label="Transaction / Reference ID (optional)" htmlFor="sp-txn">
          <Input
            id="sp-txn"
            name="transactionId"
            placeholder="e.g. UPI ref, bank reference number"
          />
        </Field>

        <Field label="Payment Date" htmlFor="sp-date">
          <Input
            id="sp-date"
            name="paymentDate"
            type="date"
            defaultValue={today}
            max={today}
            required
          />
        </Field>

        <Field label="Payment Screenshot (optional)" htmlFor="sp-screenshot">
          <input
            ref={fileRef}
            id="sp-screenshot"
            name="screenshot"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-[var(--ui-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-[var(--ui-border)] file:text-sm file:font-semibold file:bg-[var(--ui-surface)] file:text-[var(--ui-primary)] hover:file:bg-[var(--ui-primary)] hover:file:text-white file:transition-colors file:cursor-pointer"
          />
          {preview && (
            <div className="mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Payment preview"
                className="h-32 w-auto rounded-lg border border-[var(--ui-border)] object-contain"
              />
            </div>
          )}
        </Field>

        <Button type="submit" disabled={pending || dueAmount <= 0}>
          {pending ? "Submitting…" : "Submit Payment"}
        </Button>
      </form>
    </Card>
  );
}
