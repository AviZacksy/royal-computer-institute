"use client";

import { useActionState } from "react";
import { deleteExamAction } from "@/actions/admin/exams";
import type { ActionState } from "@/actions/admin/types";

export function DeleteExamButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(async () => {
    return deleteExamAction(id);
  }, null as ActionState);

  return (
    <form action={action} className="flex flex-col">
      <button
        type="submit"
        disabled={pending}
        onClick={(event) => {
          if (!confirm("Delete this exam?")) {
            event.preventDefault();
          }
        }}
        className="flex h-full min-h-11 items-center justify-center text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {state?.error ? <span className="px-2 pb-2 text-center text-xs text-red-600">{state.error}</span> : null}
    </form>
  );
}
