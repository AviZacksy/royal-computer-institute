"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";

type CourseOption = { id: string; name: string };
type RegisterState = {
  error?: string;
  success?: string;
  admissionNumber?: string;
} | null;

export function StudentRegisterForm({ courses }: { courses: CourseOption[] }) {
  const [state, action, pending] = useActionState(
    async (_prev: RegisterState, formData: FormData) => {
      const result = await registerAction(formData);
      return result ?? null;
    },
    null,
  );

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        {state?.success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-extrabold text-emerald-800">{state.success}</p>
            <p className="mt-2 text-sm text-emerald-700">
              Admission No: <span className="font-bold">{state.admissionNumber}</span>
            </p>
            <p className="mt-2 text-sm text-emerald-700">
              Admin approval is required before login. Your printable admission form has been saved with your admission request.
            </p>
            <Link
              href="/student-login"
              className="mt-4 inline-flex h-10 items-center rounded-xl bg-[var(--ui-secondary)] px-5 text-sm font-bold text-white"
            >
              Go to Student Login
            </Link>
          </div>
        ) : (
          <form action={action} className="grid gap-6">
            <FormSection title="Student Details">
              <Field label="Student Name" htmlFor="name">
                <Input id="name" name="name" required autoComplete="name" />
              </Field>
              <Field label="Father Name" htmlFor="fatherName">
                <Input id="fatherName" name="fatherName" required />
              </Field>
              <Field label="Mother Name" htmlFor="motherName">
                <Input id="motherName" name="motherName" required />
              </Field>
              <Field label="Gender" htmlFor="gender">
                <Select id="gender" name="gender" required defaultValue="">
                  <option value="" disabled>Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
              </Field>
              <Field label="Date of Birth" htmlFor="dateOfBirth">
                <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
              </Field>
              <Field label="Aadhaar Number" htmlFor="aadhaarNumber" hint="12 digits">
                <Input id="aadhaarNumber" name="aadhaarNumber" inputMode="numeric" maxLength={12} required />
              </Field>
              <Field label="Mobile Number" htmlFor="phone">
                <Input id="phone" name="phone" inputMode="numeric" required autoComplete="tel" />
              </Field>
              <Field label="Email ID" htmlFor="email">
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </Field>
              <Field label="Course Interested" htmlFor="courseId">
                <Select id="courseId" name="courseId" required defaultValue="">
                  <option value="" disabled>Select a course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </Select>
              </Field>
            </FormSection>

            <FormSection title="Qualification">
              <div className="sm:col-span-2">
                <Field label="Highest Qualification" htmlFor="qualification" hint="e.g. 12th passed, B.A. pursuing">
                  <Input id="qualification" name="qualification" required />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Permanent Address">
              <div className="sm:col-span-2">
                <Field label="Permanent Address" htmlFor="permanentAddress">
                  <Textarea id="permanentAddress" name="permanentAddress" rows={3} required />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Current Address">
              <div className="sm:col-span-2">
                <Field label="Current Address" htmlFor="currentAddress">
                  <Textarea id="currentAddress" name="currentAddress" rows={3} required />
                </Field>
              </div>
            </FormSection>

            <FormSection title="File Uploads">
              <Field label="Student Photo" htmlFor="studentPhoto" hint="Image/PDF up to 5MB">
                <Input id="studentPhoto" name="studentPhoto" type="file" accept="image/*,application/pdf" required />
              </Field>
              <Field label="Marksheet" htmlFor="marksheet" hint="Image/PDF up to 5MB">
                <Input id="marksheet" name="marksheet" type="file" accept="image/*,application/pdf" required />
              </Field>
              <Field label="Aadhaar Card" htmlFor="aadhaarCard" hint="Image/PDF up to 5MB">
                <Input id="aadhaarCard" name="aadhaarCard" type="file" accept="image/*,application/pdf" required />
              </Field>
              <Field label="Signature" htmlFor="signature" hint="Image/PDF up to 5MB">
                <Input id="signature" name="signature" type="file" accept="image/*,application/pdf" required />
              </Field>
            </FormSection>

            <FormSection title="Student Login Details">
              <Field label="Password" htmlFor="password">
                <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
              </Field>
              <Field label="Confirm New Password" htmlFor="confirmPassword">
                <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" />
              </Field>
            </FormSection>

            {state?.error ? (
              <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {state.error}
              </p>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="submit" disabled={pending || courses.length === 0}>
                {pending ? "Submitting..." : "Submit Admission"}
              </Button>
              <p className="text-sm text-[var(--ui-muted)]">
                Already admitted?{" "}
                <Link href="/student-login" className="font-semibold text-[var(--ui-primary)] hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
      <h2 className="mb-4 font-display text-lg font-extrabold text-[var(--ui-primary)]">
        {title}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
