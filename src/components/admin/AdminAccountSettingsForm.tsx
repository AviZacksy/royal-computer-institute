"use client";

import { useActionState, useEffect, useRef } from "react";
import { ShieldCheck } from "lucide-react";
import { updateAdminAccountAction } from "@/actions/admin/settings";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

export function AdminAccountSettingsForm({ currentEmail }: { currentEmail: string }) {
  const [state, action, pending] = useActionState(
    updateAdminAccountAction,
    null as ActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--ui-secondary)] ring-1 ring-blue-100">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-extrabold text-[var(--ui-primary)]">
              Account Security
            </h2>
            <p className="mt-1 text-sm leading-6 text-[var(--ui-muted)]">
              Verify your current password before changing admin login details.
            </p>
          </div>
        </div>
      </div>

      <form ref={formRef} action={action} className="grid gap-5 p-6 sm:grid-cols-2">
        <div className="sm:col-span-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
            Current Login Email
          </p>
          <p className="mt-1 text-sm font-extrabold text-[var(--ui-primary)]">
            {currentEmail}
          </p>
        </div>

        <Field label="Current password" htmlFor="currentPassword">
          <Input
            id="currentPassword"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
        </Field>

        <Field label="New email" htmlFor="newEmail">
          <Input
            id="newEmail"
            name="newEmail"
            type="email"
            autoComplete="email"
            required
            defaultValue={currentEmail}
          />
        </Field>

        <Field label="New password" htmlFor="newPassword">
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </Field>

        <Field label="Confirm new password" htmlFor="confirmNewPassword">
          <Input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            autoComplete="new-password"
            minLength={6}
            required
          />
        </Field>

        {state?.error ? (
          <p className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {state.error}
          </p>
        ) : null}
        {state?.success ? (
          <p className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            {state.success}
          </p>
        ) : null}

        <div className="sm:col-span-2 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[var(--ui-muted)]">
            Passwords are stored securely as hashes and are never displayed.
          </p>
          <Button type="submit" disabled={pending} className="sm:min-w-40">
            {pending ? "Updating..." : "Update Account"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
