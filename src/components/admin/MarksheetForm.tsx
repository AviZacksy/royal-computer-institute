"use client";

import { useActionState } from "react";
import { generateMarksheetAction } from "@/actions/admin/documents";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";

type Attempt = {
  id: string;
  studentName: string;
  examTitle: string;
  score: number;
  totalMarks: number;
};

export function MarksheetForm({
  attempts,
  onSuccess,
}: {
  attempts: Attempt[];
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const res = await generateMarksheetAction(prev, formData);
    if (res && res.success && onSuccess) onSuccess();
    return res;
  }, null as ActionState);

  return (
    <form action={action} className="space-y-4">
      {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{state.success}</p>}

      <Field label="Final Exam Attempt" htmlFor="attemptId">
        <select
          id="attemptId"
          name="attemptId"
          required
          className="w-full rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]"
        >
          <option value="">-- Select Attempt --</option>
          {attempts.map((attempt) => (
            <option key={attempt.id} value={attempt.id}>
              {attempt.studentName} - {attempt.examTitle} ({attempt.score}/{attempt.totalMarks})
            </option>
          ))}
        </select>
      </Field>

      {attempts.length === 0 ? (
        <p className="rounded-lg bg-[var(--ui-bg-subtle)] p-3 text-sm text-[var(--ui-muted)]">
          No submitted FINAL exam attempts found. Students must complete a FINAL exam first.
        </p>
      ) : null}

      <Button type="submit" disabled={pending || attempts.length === 0} className="w-full">
        {pending ? "Generating..." : "Generate Marksheet"}
      </Button>
    </form>
  );
}
