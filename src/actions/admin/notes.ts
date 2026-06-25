"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { buildStorageKey, getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
import type { ActionState } from "./types";

export type { ActionState } from "./types";

const BUCKET = STORAGE_BUCKETS.notes;

// ─── Upload Note ──────────────────────────────────────────────────────────────

export async function uploadNoteAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();

    const title      = (formData.get("title") as string)?.trim();
    const description = (formData.get("description") as string)?.trim() ?? "";
    const courseId   = formData.get("courseId") as string;
    const file       = formData.get("file") as File | null;

    if (!title)    return { error: "Title is required" };
    if (!courseId) return { error: "Please select a course" };
    if (!file || file.size === 0) return { error: "Please upload a PDF file" };
    if (file.type !== "application/pdf") return { error: "Only PDF files are allowed" };

    // Verify course belongs to this institute
    const course = await db.course.findFirst({
      where: { id: courseId, instituteId: session.instituteId },
    });
    if (!course) return { error: "Course not found" };

    const key = buildStorageKey(
      session.instituteId,
      "notes",
      `${randomUUID()}.pdf`,
    );

    const buffer = Buffer.from(await file.arrayBuffer());
    await getStorageProvider().upload({
      bucket: BUCKET,
      key,
      body: buffer,
      contentType: "application/pdf",
      upsert: false,
    });

    await db.note.create({
      data: {
        instituteId: session.instituteId,
        courseId,
        title,
        description,
        storageKey: key,
        isActive: true,
      },
    });

    revalidatePath("/admin/notes");
    revalidatePath("/student/notes");
    return { success: "Note uploaded successfully" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to upload note" };
  }
}

// ─── Toggle Active Status ─────────────────────────────────────────────────────

export async function toggleNoteStatusAction(
  noteId: string,
  currentlyActive: boolean,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();

    const note = await db.note.findFirst({
      where: { id: noteId, instituteId: session.instituteId },
    });
    if (!note) return { error: "Note not found" };

    await db.note.update({
      where: { id: noteId },
      data: { isActive: !currentlyActive },
    });

    revalidatePath("/admin/notes");
    revalidatePath("/student/notes");
    return { success: "Status updated" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to update status" };
  }
}

// ─── Delete Note ──────────────────────────────────────────────────────────────

export async function deleteNoteAction(noteId: string): Promise<ActionState> {
  try {
    const session = await requireAdminContext();

    const note = await db.note.findFirst({
      where: { id: noteId, instituteId: session.instituteId },
    });
    if (!note) return { error: "Note not found" };

    // Delete from storage first
    try {
      await getStorageProvider().delete(BUCKET, note.storageKey);
    } catch {
      // Storage delete failure should not block DB cleanup
    }

    await db.note.delete({ where: { id: noteId } });

    revalidatePath("/admin/notes");
    revalidatePath("/student/notes");
    return { success: "Note deleted" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to delete note" };
  }
}

// ─── Get Download URL ─────────────────────────────────────────────────────────

export async function getNoteUrlAction(storageKey: string): Promise<string> {
  return getStorageProvider().getSignedUrl(BUCKET, storageKey, 3600);
}
