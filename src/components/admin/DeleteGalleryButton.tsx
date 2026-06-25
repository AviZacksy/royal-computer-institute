"use client";

import { useActionState } from "react";
import { deleteGalleryItemAction } from "@/actions/admin/gallery";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";

export function DeleteGalleryButton({ id }: { id: string }) {
  const [state, action, pending] = useActionState(deleteGalleryItemAction, null as ActionState);

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this gallery item?")) e.preventDefault();
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
