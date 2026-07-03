"use client";

import { useActionState } from "react";
import { generateStudentIdCardAction } from "@/actions/admin/documents";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

type Student = {
  id: string;
  name: string;
  enrollmentNumber: string | null;
  courseName: string;
};

export function StudentIdCardForm({
  students,
  onSuccess,
}: {
  students: Student[];
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const res = await generateStudentIdCardAction(prev, formData);
    if (res && res.success && onSuccess) onSuccess();
    return res;
  }, null as ActionState);

  return (
    <form action={action} className="space-y-4">
      {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{state.success}</p>}

      <Field label="Student" htmlFor="studentId-card">
        <select
          id="studentId-card"
          name="studentId"
          required
          className="w-full rounded-lg border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ui-primary)]"
        >
          <option value="">-- Select Student --</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name} - {student.courseName} {student.enrollmentNumber ? `(${student.enrollmentNumber})` : ""}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Batch Time" htmlFor="batchTime" hint="Used on the ID card. Leave blank for Regular Batch.">
        <Input id="batchTime" name="batchTime" placeholder="e.g. 07:00 AM - 08:00 AM" />
      </Field>

      <Button type="submit" disabled={pending || students.length === 0} className="w-full">
        {pending ? "Generating..." : "Generate ID Card"}
      </Button>
    </form>
  );
}
