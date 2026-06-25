"use client";

import { useActionState } from "react";
import { submitEnquiryAction } from "@/actions/public/enquiry";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";

type CourseOption = { id: string; name: string };

export function EnquiryForm({
  courses,
  defaultCourseId,
}: {
  courses: CourseOption[];
  defaultCourseId?: string;
}) {
  const [state, action, pending] = useActionState(submitEnquiryAction, null);

  if (state?.success) {
    return (
      <div
        className="rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-5 text-sm text-green-800"
        role="status"
      >
        <p className="font-extrabold">{state.success}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 sm:max-w-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <Input id="name" name="name" placeholder="Your name" required />
        </Field>
        <Field label="Phone" htmlFor="phone">
          <Input
            id="phone"
            name="phone"
            placeholder="Mobile number"
            inputMode="numeric"
            required
          />
        </Field>
      </div>

      {courses.length > 0 ? (
        <Field label="Course interest" htmlFor="courseId">
          <Select id="courseId" name="courseId" defaultValue={defaultCourseId ?? ""}>
            <option value="">Select a course (optional)</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <Field label="Message" htmlFor="message">
        <Textarea
          id="message"
          name="message"
          placeholder="Write your enquiry..."
          required
          rows={4}
        />
      </Field>

      {state?.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Submitting…" : "Submit Enquiry"}
      </Button>
    </form>
  );
}
