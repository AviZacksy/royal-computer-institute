"use client";

import { useActionState } from "react";
import { assignCourseAction } from "@/actions/admin/students";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Input";

type Course = { id: string; name: string };

export function AssignCourseForm({
  studentId,
  courses,
  currentCourseId,
}: {
  studentId: string;
  courses: Course[];
  currentCourseId: string | null;
}) {
  const [state, action, pending] = useActionState(assignCourseAction, null as ActionState);

  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="studentId" value={studentId} />
      <Field label="Course" htmlFor={`assign-${studentId}`}>
        <Select
          id={`assign-${studentId}`}
          name="courseId"
          required
          defaultValue={currentCourseId ?? ""}
          className="min-w-[160px]"
        >
          <option value="" disabled>Select course</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </Field>
      <Button type="submit" size="sm" disabled={pending || courses.length === 0}>
        {pending ? "Saving…" : "Update"}
      </Button>
      {state?.error ? <p className="w-full text-xs text-red-600">{state.error}</p> : null}
      {state?.success ? <p className="w-full text-xs text-green-700">{state.success}</p> : null}
    </form>
  );
}
