"use client";

import { useActionState } from "react";
import { generateAdmitCardAction } from "@/actions/admin/documents";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

type Student = { id: string; name: string; enrollmentNumber: string | null };
type Exam    = { id: string; title: string };

export function AdmitCardForm({
  students,
  exams,
  onSuccess,
}: {
  students: Student[];
  exams: Exam[];
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const res = await generateAdmitCardAction(prev, formData);
    if (res && res.success && onSuccess) onSuccess();
    return res;
  }, null as ActionState);

  return (
    <form action={action} className="space-y-4">
      {state?.error   && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{state.success}</p>}

      <Field label="Student" htmlFor="studentId-admit">
        <select id="studentId-admit" name="studentId" required
          className="w-full rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]">
          <option value="">-- Select Student --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} {s.enrollmentNumber ? `(${s.enrollmentNumber})` : ""}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Exam" htmlFor="examId-admit">
        <select id="examId-admit" name="examId" required
          className="w-full rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]">
          <option value="">-- Select Exam --</option>
          {exams.map((e) => (
            <option key={e.id} value={e.id}>{e.title}</option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Exam Date (optional)" htmlFor="examDate">
          <Input id="examDate" name="examDate" type="date" />
        </Field>
        <Field label="Exam Time (optional)" htmlFor="examTime">
          <Input id="examTime" name="examTime" type="time" />
        </Field>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Generating..." : "Generate Admit Card"}
      </Button>
    </form>
  );
}
