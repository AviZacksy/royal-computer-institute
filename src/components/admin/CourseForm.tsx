"use client";

import { useActionState, useEffect } from "react";
import { saveCourseAction } from "@/actions/admin/courses";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export type CourseFormValues = {
  id?: string;
  name: string;
  description: string;
  duration: string;
  totalFee: number;
  isActive: boolean;
};

export function CourseForm({ initial }: { initial?: CourseFormValues }) {
  const [state, action, pending] = useActionState(saveCourseAction, null as ActionState);
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    if (state?.success && !isEdit) {
      const form = document.getElementById("course-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state?.success, isEdit]);

  return (
    <Card className="p-5">
      <p className="mb-4 font-extrabold text-[var(--ui-primary)]">
        {isEdit ? "Edit course" : "Add course"}
      </p>
      <form id="course-form" action={action} className="grid gap-4 sm:grid-cols-2">
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <Field label="Title" htmlFor="name">
          <Input id="name" name="name" required defaultValue={initial?.name} />
        </Field>
        <Field label="Duration" htmlFor="duration">
          <Input id="duration" name="duration" required placeholder="e.g. 6 Months" defaultValue={initial?.duration} />
        </Field>
        <Field label="Fee (₹)" htmlFor="totalFee">
          <Input id="totalFee" name="totalFee" type="number" min={0} required defaultValue={initial?.totalFee ?? 0} />
        </Field>
        <Field label="Status" htmlFor="isActive">
          <Select id="isActive" name="isActive" defaultValue={initial?.isActive === false ? "false" : "true"}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </Field>
        <Field label="Description" htmlFor="description">
          <Textarea id="description" name="description" required rows={3} defaultValue={initial?.description} className="sm:col-span-2" />
        </Field>
        {state?.error ? (
          <p className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}
        {state?.success ? (
          <p className="sm:col-span-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">{state.success}</p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Update course" : "Add course"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
