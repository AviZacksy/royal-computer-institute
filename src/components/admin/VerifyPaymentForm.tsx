"use client";

import { useActionState } from "react";
import { verifyPaymentAction } from "@/actions/admin/fees";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/format";

type Props = {
  paymentId: string;
  studentName: string;
  amount: number;
  transactionId?: string | null;
  submittedAt: string;
  screenshotUrl?: string | null;
};

export function VerifyPaymentForm({
  paymentId,
  studentName,
  amount,
  transactionId,
  submittedAt,
  screenshotUrl,
}: Props) {
  const [state, action, pending] = useActionState(verifyPaymentAction, null as ActionState);

  return (
    <Card className="p-5 space-y-4">
      {/* Payment summary */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">Student</p>
          <p className="font-semibold text-[var(--ui-primary)]">{studentName}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">Amount</p>
          <p className="font-semibold text-[var(--ui-primary)]">{formatCurrency(amount)}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">Transaction ID</p>
          <p className="font-mono text-[var(--ui-text)]">{transactionId || "—"}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">Submitted</p>
          <p className="text-[var(--ui-text)]">{submittedAt}</p>
        </div>
      </div>

      {/* Screenshot */}
      {screenshotUrl && (
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">Payment Screenshot</p>
          <a href={screenshotUrl} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotUrl}
              alt="Payment screenshot"
              className="h-48 w-auto rounded-lg border border-[var(--ui-border)] object-contain shadow-sm hover:opacity-90 transition-opacity"
            />
          </a>
          <p className="mt-1 text-xs text-[var(--ui-muted)]">Click to open full size</p>
        </div>
      )}

      {state?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      {state?.success && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
          {state.success}
        </p>
      )}

      {!state?.success && (
        <form action={action} className="grid gap-3">
          <input type="hidden" name="paymentId" value={paymentId} />

          <Field label="Admin Remarks (optional)" htmlFor={`ar-${paymentId}`}>
            <Textarea
              id={`ar-${paymentId}`}
              name="adminNotes"
              placeholder="Add notes for the student…"
              className="min-h-[80px]"
            />
          </Field>

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              name="action"
              value="verify"
              variant="accent"
              size="sm"
              disabled={pending}
            >
              {pending ? "Processing…" : "✓ Verify Payment"}
            </Button>
            <Button
              type="submit"
              name="action"
              value="reject"
              variant="outline"
              size="sm"
              disabled={pending}
            >
              {pending ? "Processing…" : "✕ Reject"}
            </Button>
          </div>
        </form>
      )}
    </Card>
  );
}
