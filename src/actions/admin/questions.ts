"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { questionSchema } from "@/lib/validations";
import { parseCSV } from "@/lib/csv-parser";
import type { ActionState } from "./types";

export async function upsertQuestionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const id = formData.get("id") as string | null;

    const parsed = questionSchema.safeParse({
      courseId: formData.get("courseId"),
      questionText: formData.get("questionText"),
      optionA: formData.get("optionA"),
      optionB: formData.get("optionB"),
      optionC: formData.get("optionC"),
      optionD: formData.get("optionD"),
      correctOption: formData.get("correctOption"),
      marks: formData.get("marks"),
      isActive: formData.get("isActive") === "true",
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const data = parsed.data;

    // Verify course belongs to institute
    const course = await db.course.findFirst({
      where: { id: data.courseId, instituteId: session.instituteId },
    });
    if (!course) return { error: "Course not found" };

    if (id) {
      const existing = await db.question.findFirst({
        where: { id, instituteId: session.instituteId },
      });
      if (!existing) return { error: "Question not found" };

      await db.question.update({
        where: { id },
        data: { ...data },
      });
    } else {
      await db.question.create({
        data: {
          ...data,
          instituteId: session.instituteId,
        },
      });
    }

    revalidatePath("/admin/questions");
    return { success: id ? "Question updated" : "Question created" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Something went wrong" };
  }
}

export async function deleteQuestionAction(id: string): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const existing = await db.question.findFirst({
      where: { id, instituteId: session.instituteId },
    });
    if (!existing) return { error: "Question not found" };

    await db.question.delete({ where: { id } });
    revalidatePath("/admin/questions");
    return { success: "Question deleted" };
  } catch (e: unknown) {
    console.error(e);
    return { error: "Could not delete question" };
  }
}

export async function bulkImportQuestionsAction(
  courseId: string,
  csvText: string,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();

    const course = await db.course.findFirst({
      where: { id: courseId, instituteId: session.instituteId },
    });
    if (!course) return { error: "Course not found" };

    const rows = parseCSV(csvText);
    if (rows.length < 2) return { error: "CSV is empty or missing data rows" };

    // Assume first row is header
    const dataRows = rows.slice(1);
    const validQuestions = [];
    const errors = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (row.length < 6) {
        errors.push(`Row ${i + 2}: Missing columns`);
        continue;
      }

      const [questionText, optionA, optionB, optionC, optionD, correctOptionRaw, marksRaw] = row;
      const correctOption = correctOptionRaw?.trim().toUpperCase();

      if (!["A", "B", "C", "D"].includes(correctOption)) {
        errors.push(`Row ${i + 2}: Invalid correct answer (must be A, B, C, or D)`);
        continue;
      }

      if (!questionText || !optionA || !optionB || !optionC || !optionD) {
        errors.push(`Row ${i + 2}: Missing question or options`);
        continue;
      }

      const marks = parseInt(marksRaw || "1", 10);

      validQuestions.push({
        instituteId: session.instituteId,
        courseId,
        questionText: questionText.trim(),
        optionA: optionA.trim(),
        optionB: optionB.trim(),
        optionC: optionC.trim(),
        optionD: optionD.trim(),
        correctOption: correctOption as "A" | "B" | "C" | "D",
        marks: isNaN(marks) || marks < 1 ? 1 : marks,
      });
    }

    if (validQuestions.length > 0) {
      await db.question.createMany({
        data: validQuestions,
      });
    }

    revalidatePath("/admin/questions");
    return {
      success: `Imported ${validQuestions.length} questions. ${
        errors.length > 0 ? `Errors: ${errors.join(", ")}` : ""
      }`,
    };
  } catch (e: unknown) {
    console.error(e);
    return { error: "Failed to import CSV" };
  }
}
