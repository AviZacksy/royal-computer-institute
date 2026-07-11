"use client";

import { useActionState, useEffect, useRef } from "react";
import { resetStudentPasswordAction } from "@/actions/admin/students";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

export function ResetStudentPasswordForm({ studentId }: { studentId: string }) {
  const [state, action, pending] = useActionState(resetStudentPasswordAction, null as ActionState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state?.success]);

  return (
    <div className="rounded-xl border border-[var(--ui-border)] bg-white shadow-sm overflow-hidden mt-6">
      <div className="border-b border-[var(--ui-border)] bg-gray-50/50 px-6 py-4">
        <h3 className="font-semibold text-gray-900">Admin Action: Reset Password</h3>
        <p className="text-xs text-gray-500 mt-1">If the student forgot their password, you can set a new one for them here.</p>
      </div>
      <div className="p-6">
        <form ref={formRef} action={action} className="grid gap-4 max-w-sm">
          <input type="hidden" name="studentId" value={studentId} />
          
          <Field label="New Password" htmlFor="newPassword">
            <Input 
              id="newPassword" 
              name="newPassword" 
              type="text"
              placeholder="e.g. royal123" 
              required 
              minLength={6} 
            />
          </Field>

          <Button type="submit" variant="accent" disabled={pending}>
            {pending ? "Resetting..." : "Reset Password"}
          </Button>

          {state?.error ? (
            <p className="text-sm text-red-600 font-medium">{state.error}</p>
          ) : null}
          {state?.success ? (
            <p className="text-sm text-green-700 font-medium">{state.success}</p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
