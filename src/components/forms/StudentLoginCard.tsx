"use client";

import { useActionState } from "react";
import { studentLoginAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import Link from "next/link";

export function StudentLoginCard({ registered }: { registered?: boolean }) {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await studentLoginAction(formData);
      return result ?? null;
    },
    null,
  );

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-[var(--radius-control)] bg-gold/15 text-xl">🔐</div>
          <div>
            <p className="text-base font-extrabold text-royal">Student Login</p>
            <p className="mt-1 text-sm text-muted">Login with your registered email after admin approval.</p>
          </div>
        </div>

        {registered ? (
          <div className="mt-4 rounded-[var(--radius-card)] border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            Registration submitted. Please wait for admin approval before logging in.
          </div>
        ) : null}

        <form action={action} className="mt-6 grid gap-5">
          <Field label="Email" htmlFor="email">
            <Input id="email" name="email" type="email" placeholder="your@email.com" required />
          </Field>
          <Field label="Password" htmlFor="password">
            <Input id="password" name="password" type="password" required />
          </Field>
          {state?.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
          ) : null}
          <div className="grid gap-2 sm:flex sm:items-center">
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? "Logging in…" : "Login"}
            </Button>
            <Link href="/student/register" className="text-sm font-semibold text-[var(--ui-primary)] hover:underline">
              New student? Register
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
