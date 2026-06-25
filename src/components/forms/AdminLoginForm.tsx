"use client";

import { useActionState } from "react";
import { adminLoginAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { INSTITUTE } from "@/config/institute";
import Link from "next/link";

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(
    async (_prev: { error?: string } | null, formData: FormData) => {
      const result = await adminLoginAction(formData);
      return result ?? null;
    },
    null,
  );

  return (
    <div className="min-h-screen bg-[var(--ui-surface)] px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-6 text-center">
          <p className="font-display text-xl font-extrabold text-[var(--ui-primary)]">
            {INSTITUTE.name}
          </p>
          <p className="mt-1 text-sm text-[var(--ui-muted)]">Admin Login</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form action={action} className="grid gap-4">
              <Field label="Email" htmlFor="email">
                <Input id="email" name="email" type="email" required placeholder="admin@royalci.local" />
              </Field>
              <Field label="Password" htmlFor="password">
                <Input id="password" name="password" type="password" required />
              </Field>
              {state?.error ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {state.error}
                </p>
              ) : null}
              <Button type="submit" disabled={pending} className="w-full">
                {pending ? "Signing in…" : "Login"}
              </Button>
            </form>
            <p className="mt-4 text-center text-sm">
              <Link href="/" className="font-semibold text-[var(--ui-primary)] hover:underline">
                ← Back to website
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
