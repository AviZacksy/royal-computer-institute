"use client";

import { useActionState } from "react";
import { addManualPaymentAction } from "@/actions/admin/fees";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type Props = {
  studentId: string;
  dueAmount: number;
};

export function ManualPaymentForm({ studentId, dueAmount }: Props) {
  const [state, action, pending] = useActionState(addManualPaymentAction, null as ActionState);

  const today = new Date().toISOString().split("T")[0];

  return (
    <Card className="p-5">
      <p className="mb-1 font-extrabold text-[var(--ui-primary)]">Add Manual Payment</p>
      <p className="mb-4 text-sm text-[var(--ui-muted)]">
        Balance due: ₹{dueAmount.toLocaleString("en-IN")}
      </p>

      {state?.error && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="mb-3 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {state.success}
        </p>
      )}

      <form action={action} className="grid gap-3">
        <input type="hidden" name="studentId" value={studentId} />
        <Field label="Amount (₹)" htmlFor={`mp-amount-${studentId}`}>
          <Input
            id={`mp-amount-${studentId}`}
            name="amount"
            type="number"
            min={1}
            max={dueAmount}
            step={1}
            required
          />
        </Field>
        <Field label="Payment Date" htmlFor={`mp-date-${studentId}`}>
          <Input
            id={`mp-date-${studentId}`}
            name="paymentDate"
            type="date"
            defaultValue={today}
            max={today}
            required
          />
        </Field>
        <Field label="Notes (optional)" htmlFor={`mp-notes-${studentId}`}>
          <Textarea
            id={`mp-notes-${studentId}`}
            name="notes"
            placeholder="e.g. Cash payment received at front desk"
            className="min-h-[80px]"
          />
        </Field>
        <Button type="submit" variant="accent" disabled={pending || dueAmount <= 0} size="sm">
          {pending ? "Recording…" : "Record Payment + Generate Receipt"}
        </Button>
        {dueAmount <= 0 && (
          <p className="text-xs text-green-700">✓ Fee fully paid — no balance due.</p>
        )}
      </form>
    </Card>
  );
}
