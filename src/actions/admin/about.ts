"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { aboutContentSchema } from "@/lib/validations";
import { getStorageProvider, STORAGE_BUCKETS, uploadFile } from "@/lib/storage";
import type { ActionState } from "./types";

function formDataList(formData: FormData, key: string) {
  return formData.getAll(key).map((value) => String(value));
}

export async function saveAboutContentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = aboutContentSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      introduction: formData.get("introduction"),
      mission: formData.get("mission"),
      vision: formData.get("vision"),
      imagePath: formData.get("imagePath") || undefined,
      sectionTitle: formDataList(formData, "sectionTitle"),
      sectionDescription: formDataList(formData, "sectionDescription"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid About content" };
    }

    const existing = await db.websiteContent.findUnique({
      where: {
        instituteId_page: {
          instituteId: session.instituteId,
          page: "about",
        },
      },
    });

    const imageFile = formData.get("aboutImage");
    const removeImage = formData.get("removeImage") === "true";
    const uploadImageFile =
      imageFile instanceof File && imageFile.size > 0 && imageFile.name.trim()
        ? imageFile
        : null;

    if (uploadImageFile && !uploadImageFile.type.startsWith("image/")) {
      return { error: "About image must be an image file" };
    }

    if (uploadImageFile && uploadImageFile.size > 5 * 1024 * 1024) {
      return { error: "About image must be 5MB or smaller" };
    }

    let imageStorageKey = existing?.imageStorageKey ?? null;
    let imagePath = parsed.data.imagePath?.trim() || null;

    if (removeImage || uploadImageFile) {
      if (existing?.imageStorageKey) {
        await getStorageProvider()
          .delete(STORAGE_BUCKETS.gallery, existing.imageStorageKey)
          .catch(() => undefined);
      }
      imageStorageKey = null;
    }

    if (uploadImageFile) {
      const stored = await uploadFile({
        instituteId: session.instituteId,
        bucket: STORAGE_BUCKETS.gallery,
        category: "about",
        file: uploadImageFile,
      });
      imageStorageKey = stored.key;
      imagePath = null;
    }

    if (removeImage) {
      imagePath = null;
    }

    const sections =
      parsed.data.sectionTitle
        ?.map((title, index) => ({
          title: title.trim(),
          description: parsed.data.sectionDescription?.[index]?.trim() ?? "",
        }))
        .filter((section) => section.title && section.description) ?? [];

    await db.websiteContent.upsert({
      where: {
        instituteId_page: {
          instituteId: session.instituteId,
          page: "about",
        },
      },
      update: {
        title: parsed.data.title,
        description: parsed.data.description,
        content: {
          introduction: parsed.data.introduction,
          mission: parsed.data.mission,
          vision: parsed.data.vision,
          sections,
        },
        imageStorageKey,
        imagePath,
      },
      create: {
        instituteId: session.instituteId,
        page: "about",
        title: parsed.data.title,
        description: parsed.data.description,
        content: {
          introduction: parsed.data.introduction,
          mission: parsed.data.mission,
          vision: parsed.data.vision,
          sections,
        },
        imageStorageKey,
        imagePath,
      },
    });

    revalidatePath("/admin/about");
    revalidatePath("/about");
    revalidatePath("/");
    return { success: "About content updated" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
