"use client";

import { useActionState } from "react";
import { registerAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";
import Link from "next/link";

type CourseOption = { id: string; name: string };

export function StudentRegisterForm({ courses }: { courses: CourseOption[] }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await registerAction(formData);
      return result ?? null;
    },
    null,
  );

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <form action={action} className="grid gap-4 sm:max-w-xl">
          <Field label="Full Name" htmlFor="name">
            <Input id="name" name="name" required autoComplete="name" />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" inputMode="numeric" required autoComplete="tel" />
          </Field>
          {courses.length > 0 ? (
            <Field label="Course interest (optional)" htmlFor="courseId">
              <Select id="courseId" name="courseId" defaultValue="">
                <option value="">Select a course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </Select>
            </Field>
          ) : null}
          <Field label="Address" htmlFor="address">
            <Textarea id="address" name="address" rows={2} autoComplete="street-address" />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
          </Field>
          <Field label="Confirm Password" htmlFor="confirmPassword">
            <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" />
          </Field>
          {state?.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          ) : null}
          <Button type="submit" disabled={pending}>
            {pending ? "Registering…" : "Register"}
          </Button>
          <p className="text-sm text-[var(--ui-muted)]">
            Already registered?{" "}
            <Link href="/student-login" className="font-semibold text-[var(--ui-primary)] hover:underline">
              Login
            </Link>
          </p>
          <p className="text-xs text-[var(--ui-muted)]">
            After registration, an admin must approve your account before you can sign in.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
