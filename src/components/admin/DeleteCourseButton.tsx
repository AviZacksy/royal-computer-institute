"use client";

import { useActionState } from "react";
import { deleteCourseAction } from "@/actions/admin/courses";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";

export function DeleteCourseButton({
  id,
  enrolledCount,
}: {
  id: string;
  enrolledCount: number;
}) {
  const [state, action, pending] = useActionState(deleteCourseAction, null as ActionState);

  if (enrolledCount > 0) {
    return null;
  }

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this course permanently?")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        Delete
      </Button>
      {state?.error ? <p className="mt-1 text-xs text-red-600">{state.error}</p> : null}
    </form>
  );
}
