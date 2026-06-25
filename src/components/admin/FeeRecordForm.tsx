"use client";

import { useActionState } from "react";
import { upsertFeeRecordAction } from "@/actions/admin/fees";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

type Props = {
  studentId: string;
  studentName: string;
  existingTotalFee?: number;
};

export function FeeRecordForm({ studentId, studentName, existingTotalFee }: Props) {
  const [state, action, pending] = useActionState(upsertFeeRecordAction, null as ActionState);

  return (
    <Card className="p-5">
      <p className="mb-4 font-extrabold text-[var(--ui-primary)]">
        {existingTotalFee != null ? "Update" : "Create"} Fee Record — {studentName}
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
        <Field label="Total Fee (₹)" htmlFor={`tf-${studentId}`}>
          <Input
            id={`tf-${studentId}`}
            name="totalFee"
            type="number"
            min={0}
            step={100}
            defaultValue={existingTotalFee ?? 0}
            required
          />
        </Field>
        <Button type="submit" disabled={pending} size="sm">
          {pending ? "Saving…" : existingTotalFee != null ? "Update Fee" : "Create Fee Record"}
        </Button>
      </form>
    </Card>
  );
}
