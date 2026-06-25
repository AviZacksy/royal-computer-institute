"use client";

import { useActionState, useTransition } from "react";
import { uploadNoteAction, toggleNoteStatusAction, deleteNoteAction } from "@/actions/admin/notes";
import type { ActionState } from "@/actions/admin/types";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Input, Select, Textarea } from "@/components/ui/Input";

type Course = { id: string; name: string };

export function UploadNoteForm({
  courses,
  onSuccess,
}: {
  courses: Course[];
  onSuccess?: () => void;
}) {
  const [state, action, pending] = useActionState(async (prev: ActionState, formData: FormData) => {
    const res = await uploadNoteAction(prev, formData);
    if (res && res.success && onSuccess) onSuccess();
    return res;
  }, null as ActionState);

  return (
    <form action={action} className="space-y-4">
      {state?.error   && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{state.error}</p>}
      {state?.success && <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg">{state.success}</p>}

      <Field label="Title" htmlFor="note-title">
        <Input id="note-title" name="title" placeholder="e.g. Chapter 3 - Data Structures" required />
      </Field>

      <Field label="Description (optional)" htmlFor="note-description">
        <Textarea id="note-description" name="description" placeholder="Brief description of these notes..." />
      </Field>

      <Field label="Course" htmlFor="note-courseId">
        <Select id="note-courseId" name="courseId" required>
          <option value="">-- Select Course --</option>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </Select>
      </Field>

      <Field label="PDF File" htmlFor="note-file">
        <Input
          id="note-file"
          name="file"
          type="file"
          accept="application/pdf"
          required
          className="file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[var(--ui-primary)] file:text-white cursor-pointer"
        />
      </Field>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Uploading..." : "Upload Note"}
      </Button>
    </form>
  );
}

// ─── Toggle Status Button ─────────────────────────────────────────────────────

export function ToggleNoteButton({ noteId, isActive }: { noteId: string; isActive: boolean }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => { void toggleNoteStatusAction(noteId, isActive); })}
      disabled={isPending}
      className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
        isActive
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      {isPending ? "..." : isActive ? "● Active" : "○ Inactive"}
    </button>
  );
}

// ─── Delete Button ────────────────────────────────────────────────────────────

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => {
        if (!confirm("Are you sure you want to delete this note? This cannot be undone.")) return;
        startTransition(() => { void deleteNoteAction(noteId); });
      }}
      disabled={isPending}
      className="text-xs font-semibold text-red-600 hover:text-red-800 disabled:opacity-50"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
