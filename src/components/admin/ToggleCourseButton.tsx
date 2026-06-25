"use client";

import { toggleCourseStatusAction } from "@/actions/admin/courses";
import { Button } from "@/components/ui/Button";

export function ToggleCourseButton({ id, isActive }: { id: string; isActive: boolean }) {
  return (
    <form action={toggleCourseStatusAction}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm">
        {isActive ? "Deactivate" : "Activate"}
      </Button>
    </form>
  );
}
