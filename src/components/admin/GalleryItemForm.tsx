"use client";

import { useActionState, useEffect } from "react";
import { saveGalleryItemAction } from "@/actions/admin/gallery";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export type GalleryFormValues = {
  id?: string;
  title: string;
  mediaType: "IMAGE" | "VIDEO";
  mediaUrl?: string | null;
  category: string;
  sortOrder: number;
  isActive: boolean;
};

export function GalleryItemForm({ initial }: { initial?: GalleryFormValues }) {
  const [state, action, pending] = useActionState(saveGalleryItemAction, null as ActionState);
  const isEdit = Boolean(initial?.id);

  useEffect(() => {
    if (state?.success && !isEdit) {
      const form = document.getElementById("gallery-form") as HTMLFormElement | null;
      form?.reset();
    }
  }, [state?.success, isEdit]);

  return (
    <Card className="p-5">
      <p className="mb-4 font-extrabold text-[var(--ui-primary)]">
        {isEdit ? "Edit gallery item" : "Add gallery item"}
      </p>
      <form
        id="gallery-form"
        action={action}
        className="grid gap-4 sm:grid-cols-2"
      >
        {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
        <Field label="Title" htmlFor="title">
          <Input id="title" name="title" required defaultValue={initial?.title} />
        </Field>
        <Field label="Type" htmlFor="mediaType">
          <Select id="mediaType" name="mediaType" defaultValue={initial?.mediaType ?? "IMAGE"}>
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
          </Select>
        </Field>
        <Field label="Category" htmlFor="category">
          <Input id="category" name="category" placeholder="Campus" defaultValue={initial?.category ?? "General"} />
        </Field>
        <Field label="Sort Order" htmlFor="sortOrder">
          <Input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={initial?.sortOrder ?? 0} />
        </Field>
        <Field label="Status" htmlFor="isActive">
          <Select id="isActive" name="isActive" defaultValue={initial?.isActive === false ? "false" : "true"}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </Field>
        <Field label="Media URL (optional)" htmlFor="mediaUrl">
          <Input
            id="mediaUrl"
            name="mediaUrl"
            placeholder="https://... or /images/gallery/1.jpg"
            defaultValue={initial?.mediaUrl ?? ""}
          />
        </Field>
        <Field label="Upload file (optional)" htmlFor="file">
          <Input id="file" name="file" type="file" accept="image/*,video/mp4,video/webm" />
        </Field>
        <p className="sm:col-span-2 text-xs text-[var(--ui-muted)]">
          Provide a URL or upload a file. Upload takes priority over URL when both are set.
        </p>
        {state?.error ? (
          <p className="sm:col-span-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </p>
        ) : null}
        {state?.success ? (
          <p className="sm:col-span-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800">
            {state.success}
          </p>
        ) : null}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Update item" : "Add item"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
