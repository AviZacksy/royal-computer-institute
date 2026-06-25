"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { courseFormSchema } from "@/lib/validations";
import type { ActionState } from "./types";

function parseCourseForm(formData: FormData) {
  return courseFormSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    description: formData.get("description"),
    duration: formData.get("duration"),
    totalFee: formData.get("totalFee"),
    isActive: formData.get("isActive") ?? "true",
  });
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

    const { id, name, description, duration, totalFee, isActive } = parsed.data;
    const active = isActive !== "false";

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

      await db.course.update({
        where: { id },
        data: { name, description, duration, totalFee, isActive: active },
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

      const maxSort = await db.course.aggregate({
        where: { instituteId: session.instituteId },
        _max: { sortOrder: true },
      });

      await db.course.create({
        data: {
          instituteId: session.instituteId,
          name,
          description,
          duration,
          totalFee,
          isActive: active,
          sortOrder: (maxSort._max.sortOrder ?? 0) + 1,
        },
      });
    }

    revalidatePath("/admin/courses");
    revalidatePath("/admin/dashboard");
    revalidatePath("/courses");
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

    await db.course.delete({ where: { id } });

    revalidatePath("/admin/courses");
    revalidatePath("/admin/dashboard");
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

  revalidatePath("/admin/courses");
  revalidatePath("/admin/dashboard");
}
