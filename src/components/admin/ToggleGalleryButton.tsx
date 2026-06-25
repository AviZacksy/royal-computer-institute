"use client";

import { toggleGalleryItemAction } from "@/actions/admin/gallery";
import { Button } from "@/components/ui/Button";

export function ToggleGalleryButton({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <form action={toggleGalleryItemAction}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm">
        {isActive ? "Hide" : "Show"}
      </Button>
    </form>
  );
}
