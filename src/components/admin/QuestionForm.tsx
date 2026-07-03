"use client";

import { useActionState } from "react";
import { upsertQuestionAction } from "@/actions/admin/questions";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { MOCK_TOPICS } from "@/config/exam-topics";

type Props = {
  courses: { id: string; name: string }[];
  initialData?: {
    id: string;
    courseId: string;
    topic: string | null;
    questionText: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctOption: "A" | "B" | "C" | "D";
    marks: number;
    isActive: boolean;
  };
  onSuccess?: () => void;
};

export function QuestionForm({ courses, initialData, onSuccess }: Props) {
  const [state, action, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const res = await upsertQuestionAction(prev, formData);
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
          <option value="" disabled>
            Select a course
          </option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Topic" htmlFor="topic">
        <Select id="topic" name="topic" defaultValue={initialData?.topic ?? "FUNDAMENTAL"} required>
          {MOCK_TOPICS.map((topic) => (
            <option key={topic.value} value={topic.value}>
              {topic.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Question Text" htmlFor="questionText">
        <Textarea
          id="questionText"
          name="questionText"
          defaultValue={initialData?.questionText}
          required
          placeholder="Enter question text here..."
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Option A" htmlFor="optionA">
          <Input id="optionA" name="optionA" defaultValue={initialData?.optionA} required />
        </Field>
        <Field label="Option B" htmlFor="optionB">
          <Input id="optionB" name="optionB" defaultValue={initialData?.optionB} required />
        </Field>
        <Field label="Option C" htmlFor="optionC">
          <Input id="optionC" name="optionC" defaultValue={initialData?.optionC} required />
        </Field>
        <Field label="Option D" htmlFor="optionD">
          <Input id="optionD" name="optionD" defaultValue={initialData?.optionD} required />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Correct Answer" htmlFor="correctOption">
          <select
            name="correctOption"
            id="correctOption"
            className="flex h-10 w-full rounded-md border border-[var(--ui-border)] bg-[var(--ui-bg)] px-3 py-2 text-sm text-[var(--ui-text)] focus:border-[var(--ui-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--ui-primary)]"
            defaultValue={initialData?.correctOption ?? "A"}
            required
          >
            <option value="A">Option A</option>
            <option value="B">Option B</option>
            <option value="C">Option C</option>
            <option value="D">Option D</option>
          </select>
        </Field>

        <Field label="Marks" htmlFor="marks">
          <Input
            id="marks"
            name="marks"
            type="number"
            min={1}
            defaultValue={initialData?.marks ?? 1}
            required
          />
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
        {pending ? "Saving..." : initialData ? "Save Changes" : "Create Question"}
      </Button>
    </form>
  );
}
