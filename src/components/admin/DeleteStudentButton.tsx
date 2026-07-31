"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteStudentAction } from "@/actions/admin/students";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";

type Props = {
  id: string;
  studentName: string;
  redirectTo?: string;
  variant?: "link" | "button";
};

export function DeleteStudentButton({ id, studentName, redirectTo, variant = "link" }: Props) {
  const router = useRouter();
  const [state, action, pending] = useActionState(async () => {
    return deleteStudentAction(id);
  }, null as ActionState);

  useEffect(() => {
    if (state?.success && redirectTo) {
      router.push(redirectTo);
    }
  }, [state?.success, redirectTo, router]);

  const handleDelete = (event: React.MouseEvent) => {
    if (
      !confirm(
        `Are you sure you want to delete ${studentName}? This will permanently delete their profile, user credentials, all payment records, and certificates. This action cannot be undone.`
      )
    ) {
      event.preventDefault();
    }
  };

  if (variant === "button") {
    return (
      <form action={action} className="w-full">
        <Button
          type="submit"
          variant="outline"
          className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
          disabled={pending}
          onClick={handleDelete}
        >
          {pending ? "Deleting Student..." : "Delete Student Profile"}
        </Button>
        {state?.error && (
          <p className="mt-2 text-xs text-red-600 font-medium">{state.error}</p>
        )}
      </form>
    );
  }

  return (
    <form action={action} className="inline-flex items-center">
      <button
        type="submit"
        disabled={pending}
        onClick={handleDelete}
        className="text-sm font-semibold text-red-600 hover:underline hover:text-red-700 disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {state?.error && (
        <span className="ml-2 text-xs text-red-600 font-medium">{state.error}</span>
      )}
    </form>
  );
}
