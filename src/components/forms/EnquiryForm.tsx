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
        className="rounded-[2rem] border border-green-200 bg-green-50 p-10 sm:p-16 text-center flex flex-col items-center"
        role="status"
      >
        <span className="text-5xl block mb-6">✅</span>
        <h3 className="font-display text-2xl font-extrabold text-green-800 mb-3">Enquiry Submitted!</h3>
        <p className="text-base text-green-700 leading-relaxed max-w-sm">{state.success}</p>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-[var(--ui-border)] bg-white p-8 sm:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.06)]">
      <div className="mb-8">
        <h3 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">Send Your Enquiry</h3>
        <p className="mt-2 text-base text-[var(--ui-muted)]">We usually respond within a few hours.</p>
      </div>

      <form action={action} className="grid gap-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Full Name" htmlFor="name">
            <Input id="name" name="name" placeholder="Your full name" required />
          </Field>
          <Field label="Phone Number" htmlFor="phone">
            <Input
              id="phone"
              name="phone"
              placeholder="10-digit mobile number"
              inputMode="numeric"
              required
            />
          </Field>
        </div>

        {courses.length > 0 ? (
          <Field label="Course of Interest" htmlFor="courseId">
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

        <Field label="Your Message" htmlFor="message">
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us what you'd like to know about admissions, fees, or batch schedules..."
            required
            rows={5}
          />
        </Field>

        {state?.error ? (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <span className="text-lg shrink-0">⚠️</span>
            <p className="text-sm font-semibold text-red-700">{state.error}</p>
          </div>
        ) : null}

        <Button
          type="submit"
          disabled={pending}
          className="w-full h-14 rounded-full text-base font-bold shadow-lg hover:scale-[1.02] transition-all bg-[var(--ui-primary)] text-white"
        >
          {pending ? "Submitting…" : "Submit Enquiry →"}
        </Button>
      </form>
    </div>
  );
}
