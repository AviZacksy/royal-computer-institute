"use client";

import { useActionState } from "react";
import { upsertExamAction } from "@/actions/admin/exams";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

type Props = {
  courses: { id: string; name: string }[];
  initialData?: {
    id: string;
    courseId: string;
    title: string;
    type: "MOCK" | "FINAL";
    durationMinutes: number;
    isActive: boolean;
  };
  onSuccess?: () => void;
};

export function ExamForm({ courses, initialData, onSuccess }: Props) {
  const [state, action, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const res = await upsertExamAction(prev, formData);
    if (res && res.success && onSuccess) {
      onSuccess();
    }
    return res;
  }, null as ActionState);

  return (
    <form action={action} className="grid gap-4">
      {initialData && <input type="hidden" name="id" value={initialData.id} />}

      <Field label="Course" htmlFor="courseId">
        <select
          name="courseId"
          id="courseId"
          className="flex h-10 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] focus:border-[var(--ui-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-primary)]"
          defaultValue={initialData?.courseId ?? (courses.length === 1 ? courses[0].id : "")}
          required
        >
          <option value="" disabled>Select a course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Field>

      <Field label="Exam Title" htmlFor="title">
        <Input id="title" name="title" defaultValue={initialData?.title} required placeholder="e.g. Midterm Mock Test" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Exam Type" htmlFor="type">
          <select
            name="type"
            id="type"
            className="flex h-10 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] focus:border-[var(--ui-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-primary)]"
            defaultValue={initialData?.type ?? "MOCK"}
            required
          >
            <option value="MOCK">Mock Test (Results visible immediately)</option>
            <option value="FINAL">Final Exam (Results hidden)</option>
          </select>
        </Field>

        <Field label="Duration (Minutes)" htmlFor="durationMinutes">
          <Input id="durationMinutes" name="durationMinutes" type="number" min={5} max={300} defaultValue={initialData?.durationMinutes ?? 60} required />
        </Field>

        <Field label="Status" htmlFor="isActive">
          <select
            name="isActive"
            id="isActive"
            className="flex h-10 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] focus:border-[var(--ui-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-primary)]"
            defaultValue={initialData?.isActive === false ? "false" : "true"}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </Field>
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-600">{state.success}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : initialData ? "Save Changes" : "Create Exam"}
      </Button>
    </form>
  );
}
