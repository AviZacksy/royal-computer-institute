"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { examSchema } from "@/lib/validations";
import { isFinalExamCourse } from "@/config/exam-topics";
import type { ActionState } from "./types";

export async function upsertExamAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const id = formData.get("id") as string | null;

    const parsed = examSchema.safeParse({
      courseId: formData.get("courseId"),
      title: formData.get("title"),
      type: formData.get("type"),
      topic: formData.get("topic") || undefined,
      durationMinutes: formData.get("durationMinutes"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const data = parsed.data;
    const isActive = formData.get("isActive") === "true";

    const course = await db.course.findFirst({
      where: { id: data.courseId, instituteId: session.instituteId },
    });
    if (!course) return { error: "Course not found" };
    if (data.type === "FINAL" && !isFinalExamCourse(course.name)) {
      return { error: "Final exams can only be created for DCA, DTP, or Tally courses" };
    }

    const examData = {
      courseId: data.courseId,
      title: data.title,
      type: data.type,
      topic: data.type === "MOCK" ? (data.topic || "FUNDAMENTAL") : null,
      durationMinutes: data.durationMinutes,
    };

    if (id) {
      const existing = await db.exam.findFirst({
        where: { id, instituteId: session.instituteId },
      });
      if (!existing) return { error: "Exam not found" };

      await db.exam.update({
        where: { id },
        data: { ...examData, isActive },
      });
    } else {
      await db.exam.create({
        data: {
          ...examData,
          isActive,
          instituteId: session.instituteId,
        },
      });
    }

    revalidatePath("/admin/exams");
    if (id) revalidatePath(`/admin/exams/${id}`);
    
    return { success: id ? "Exam updated" : "Exam created" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Something went wrong" };
  }
}

export async function deleteExamAction(id: string): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const existing = await db.exam.findFirst({
      where: { id, instituteId: session.instituteId },
    });
    if (!existing) return { error: "Exam not found" };

    await db.exam.delete({ where: { id } });
    revalidatePath("/admin/exams");
    return { success: "Exam deleted" };
  } catch (e: unknown) {
    console.error(e);
    return { error: "Could not delete exam" };
  }
}

export async function updateExamQuestionsAction(
  examId: string,
  questionIds: string[],
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();

    const exam = await db.exam.findFirst({
      where: { id: examId, instituteId: session.instituteId },
    });
    if (!exam) return { error: "Exam not found" };
    if (exam.type === "FINAL" && questionIds.length !== 60) {
      return { error: "Final exams must contain exactly 60 questions" };
    }

    // Transaction to safely update questions
    await db.$transaction(async (tx) => {
      // Delete existing
      await tx.examQuestion.deleteMany({
        where: { examId },
      });

      // Insert new
      if (questionIds.length > 0) {
        const data = questionIds.map((qId, i) => ({
          examId,
          questionId: qId,
          sortOrder: i,
        }));
        await tx.examQuestion.createMany({ data });
      }
    });

    revalidatePath(`/admin/exams/${examId}`);
    return { success: "Exam questions updated successfully" };
  } catch (e: unknown) {
    console.error(e);
    return { error: "Failed to update exam questions" };
  }
}
