"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { courseFormSchema } from "@/lib/validations";
import { getStorageProvider, STORAGE_BUCKETS, uploadFile } from "@/lib/storage";
import type { ActionState } from "./types";

function parseCourseForm(formData: FormData) {
  return courseFormSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    description: formData.get("description"),
    syllabus: formData.get("syllabus") || undefined,
    eligibility: formData.get("eligibility") || undefined,
    careerScope: formData.get("careerScope") || undefined,
    duration: formData.get("duration"),
    totalFee: formData.get("totalFee"),
    actualFee: formData.get("actualFee"),
    installmentFee: formData.get("installmentFee"),
    oneTimeFee: formData.get("oneTimeFee"),
    imagePath: formData.get("imagePath") || undefined,
    isActive: formData.get("isActive") ?? "true",
  });
}

function revalidateCourseConsumers() {
  [
    "/",
    "/courses",
    "/query",
    "/admission",
    "/admin/courses",
    "/admin/dashboard",
    "/admin/students",
    "/admin/students/approval",
    "/admin/questions",
    "/admin/exams",
    "/admin/notes",
    "/admin/fees",
    "/admin/documents",
  ].forEach((path) => revalidatePath(path));
}

export async function saveCourseAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = parseCourseForm(formData);
    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid course data" };
    }

    const {
      id,
      name,
      description,
      syllabus,
      eligibility,
      careerScope,
      duration,
      actualFee,
      installmentFee,
      oneTimeFee,
      imagePath,
      isActive,
    } = parsed.data;
    const totalFee = oneTimeFee;
    const active = isActive !== "false";
    const imageFile = formData.get("courseImage");
    const removeImage = formData.get("removeImage") === "true";
    const hasUpload =
      imageFile instanceof File && imageFile.size > 0 && imageFile.name.trim().length > 0;
    const uploadImageFile = hasUpload ? imageFile : null;

    if (uploadImageFile && !uploadImageFile.type.startsWith("image/")) {
      return { error: "Course image must be an image file" };
    }

    if (uploadImageFile && uploadImageFile.size > 5 * 1024 * 1024) {
      return { error: "Course image must be 5MB or smaller" };
    }

    if (id) {
      const existing = await db.course.findFirst({
        where: { id, instituteId: session.instituteId },
      });
      if (!existing) {
        return { error: "Course not found" };
      }

      const duplicate = await db.course.findFirst({
        where: {
          instituteId: session.instituteId,
          name: { equals: name, mode: "insensitive" },
          NOT: { id },
        },
      });
      if (duplicate) {
        return { error: "A course with this title already exists" };
      }

      let imageStorageKey = existing.imageStorageKey;
      let nextImagePath = imagePath ?? null;

      if (removeImage || hasUpload) {
        if (existing.imageStorageKey) {
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
          category: "course-images",
          file: uploadImageFile,
        });
        imageStorageKey = stored.key;
      }

      if (removeImage) {
        nextImagePath = null;
      }

      await db.course.update({
        where: { id },
        data: {
          name,
          description,
          syllabus: syllabus?.trim() || null,
          eligibility: eligibility?.trim() || null,
          careerScope: careerScope?.trim() || null,
          duration,
          totalFee,
          actualFee,
          installmentFee,
          oneTimeFee,
          imageStorageKey,
          imagePath: nextImagePath,
          isActive: active,
        },
      });
    } else {
      const duplicate = await db.course.findFirst({
        where: {
          instituteId: session.instituteId,
          name: { equals: name, mode: "insensitive" },
        },
      });
      if (duplicate) {
        return { error: "A course with this title already exists" };
      }

      let imageStorageKey = null;
      if (uploadImageFile) {
        const stored = await uploadFile({
          instituteId: session.instituteId,
          bucket: STORAGE_BUCKETS.gallery,
          category: "course-images",
          file: uploadImageFile,
        });
        imageStorageKey = stored.key;
      }

      const maxSort = await db.course.aggregate({
        where: { instituteId: session.instituteId },
        _max: { sortOrder: true },
      });

      await db.course.create({
        data: {
          instituteId: session.instituteId,
          name,
          description,
          syllabus: syllabus?.trim() || null,
          eligibility: eligibility?.trim() || null,
          careerScope: careerScope?.trim() || null,
          duration,
          totalFee,
          actualFee,
          installmentFee,
          oneTimeFee,
          imageStorageKey,
          imagePath: removeImage ? null : (imagePath ?? null),
          isActive: active,
          sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
        },
      });
    }

    revalidateCourseConsumers();
    if (id) revalidatePath(`/courses/${id}`);
    return { success: id ? "Course updated" : "Course created" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deleteCourseAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const id = formData.get("id") as string;
    if (!id) {
      return { error: "Course not found" };
    }

    const course = await db.course.findFirst({
      where: { id, instituteId: session.instituteId },
      include: { _count: { select: { students: true } } },
    });
    if (!course) {
      return { error: "Course not found" };
    }
    if (course._count.students > 0) {
      return {
        error: `Cannot delete — ${course._count.students} student(s) enrolled. Set inactive instead.`,
      };
    }

    if (course.imageStorageKey) {
      await getStorageProvider()
        .delete(STORAGE_BUCKETS.gallery, course.imageStorageKey)
        .catch(() => undefined);
    }

    await db.course.delete({ where: { id } });

    revalidateCourseConsumers();
    revalidatePath(`/courses/${id}`);
    return { success: "Course deleted" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function toggleCourseStatusAction(formData: FormData): Promise<void> {
  const session = await requireAdminContext();
  const id = formData.get("id") as string;
  if (!id) return;

  const course = await db.course.findFirst({
    where: { id, instituteId: session.instituteId },
  });
  if (!course) return;

  await db.course.update({
    where: { id },
    data: { isActive: !course.isActive },
  });

  revalidateCourseConsumers();
  revalidatePath(`/courses/${id}`);
}
