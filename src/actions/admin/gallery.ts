"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import path from "path";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { buildStorageKey, getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
import { galleryItemSchema } from "@/lib/validations";
import type { ActionState } from "./types";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function saveGalleryItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = galleryItemSchema.safeParse({
      id: formData.get("id") || undefined,
      title: formData.get("title"),
      mediaType: formData.get("mediaType"),
      mediaUrl: formData.get("mediaUrl") || undefined,
      category: formData.get("category") || undefined,
      isActive: formData.get("isActive") ?? "true",
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const file = formData.get("file") as File | null;
    const mediaUrl = parsed.data.mediaUrl?.trim() || null;
    const isActive = parsed.data.isActive !== "false";
    const category = parsed.data.category?.trim() || "General";

    let storageKey: string | null = null;
    let finalMediaUrl: string | null = mediaUrl;

    if (file && file.size > 0) {
      const allowed =
        parsed.data.mediaType === "VIDEO" ? VIDEO_TYPES : IMAGE_TYPES;
      if (!allowed.includes(file.type)) {
        return { error: `Invalid file type for ${parsed.data.mediaType.toLowerCase()}` };
      }
      const ext = path.extname(file.name) || (parsed.data.mediaType === "VIDEO" ? ".mp4" : ".jpg");
      const key = buildStorageKey(session.instituteId, "gallery", `${randomUUID()}${ext}`);
      const buffer = Buffer.from(await file.arrayBuffer());
      await getStorageProvider().upload({
        bucket: STORAGE_BUCKETS.gallery,
        key,
        body: buffer,
        contentType: file.type,
      });
      storageKey = key;
      finalMediaUrl = null;
    }

    if (!storageKey && !finalMediaUrl) {
      return { error: "Upload a file or provide a media URL" };
    }

    if (parsed.data.id) {
      const existing = await db.galleryItem.findFirst({
        where: { id: parsed.data.id, instituteId: session.instituteId },
      });
      if (!existing) {
        return { error: "Gallery item not found" };
      }

      await db.galleryItem.update({
        where: { id: parsed.data.id },
        data: {
          title: parsed.data.title,
          mediaType: parsed.data.mediaType,
          category,
          isActive,
          ...(storageKey
            ? { storageKey, mediaUrl: null }
            : finalMediaUrl
              ? { mediaUrl: finalMediaUrl, storageKey: existing.storageKey }
              : {}),
        },
      });
    } else {
      const maxSort = await db.galleryItem.aggregate({
        where: { instituteId: session.instituteId },
        _max: { sortOrder: true },
      });

      await db.galleryItem.create({
        data: {
          instituteId: session.instituteId,
          title: parsed.data.title,
          mediaType: parsed.data.mediaType,
          storageKey,
          mediaUrl: finalMediaUrl,
          category,
          isActive,
          sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
        },
      });
    }

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: parsed.data.id ? "Gallery item updated" : "Gallery item added" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deleteGalleryItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const id = formData.get("id") as string;
    if (!id) return { error: "Item not found" };

    const item = await db.galleryItem.findFirst({
      where: { id, instituteId: session.instituteId },
    });
    if (!item) return { error: "Gallery item not found" };

    await db.galleryItem.delete({ where: { id } });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    return { success: "Gallery item deleted" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function toggleGalleryItemAction(formData: FormData): Promise<void> {
  const session = await requireAdminContext();
  const id = formData.get("id") as string;
  if (!id) return;

  const item = await db.galleryItem.findFirst({
    where: { id, instituteId: session.instituteId },
  });
  if (!item) return;

  await db.galleryItem.update({
    where: { id },
    data: { isActive: !item.isActive },
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}
