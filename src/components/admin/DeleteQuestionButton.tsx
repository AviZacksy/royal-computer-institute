"use client";

import { useActionState } from "react";
import { deleteQuestionAction } from "@/actions/admin/questions";
import type { ActionState } from "@/actions/admin/types";

export function DeleteQuestionButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(async () => {
    return deleteQuestionAction(id);
  }, null as ActionState);

  return (
    <form action={action} className="inline-flex flex-col gap-1">
      <button
        type="submit"
        disabled={pending}
        onClick={(event) => {
          if (!confirm("Delete this question?")) {
            event.preventDefault();
          }
        }}
        className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50"
      >
        {pending ? "Deleting..." : "Delete"}
      </button>
      {state?.error ? <span className="text-xs text-red-600">{state.error}</span> : null}
    </form>
  );
}
