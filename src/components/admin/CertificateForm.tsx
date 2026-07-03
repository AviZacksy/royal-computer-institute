"use client";

import { useActionState } from "react";
import { generateCertificateAction } from "@/actions/admin/documents";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

type Student = { id: string; name: string; enrollmentNumber: string | null; courseName: string };

export function CertificateForm({
  students,
  onSuccess,
}: {
  students: Student[];
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const res = await generateCertificateAction(prev, formData);
    if (res && res.success && onSuccess) onSuccess();
    return res;
  }, null as ActionState);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={action} className="space-y-4">
      {state?.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{state.success}</p>}

      <Field label="Student" htmlFor="studentId-cert">
        <select
          id="studentId-cert"
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

      <Field label="Issue Date" htmlFor="completionDate">
        <Input id="completionDate" name="completionDate" type="date" defaultValue={today} required />
      </Field>

      <Button type="submit" disabled={pending || students.length === 0} className="w-full">
        {pending ? "Generating..." : "Generate Certificate"}
      </Button>
    </form>
  );
}
