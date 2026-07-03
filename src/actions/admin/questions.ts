"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { questionSchema } from "@/lib/validations";
import { parseCSV } from "@/lib/csv-parser";
import * as XLSX from "xlsx";
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
      topic: formData.get("topic"),
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
        topic: "FUNDAMENTAL" as const,
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

export type ParsedQuestion = {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: "A" | "B" | "C" | "D";
  marks: number;
};

export type PreviewImportResult = {
  error?: string;
  validRows?: ParsedQuestion[];
  errors?: string[];
  skipped?: number;
};

export async function previewBulkImportAction(
  courseId: string,
  formData: FormData
): Promise<PreviewImportResult> {
  try {
    const session = await requireAdminContext();

    const course = await db.course.findFirst({
      where: { id: courseId, instituteId: session.instituteId },
    });
    if (!course) return { error: "Course not found" };

    const file = formData.get("file") as File | null;
    if (!file) return { error: "No file provided" };

    const buffer = await file.arrayBuffer();
    let rows: unknown[][] = [];

    if (file.name.endsWith(".csv")) {
      const text = new TextDecoder().decode(buffer);
      rows = parseCSV(text);
    } else {
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      // header: 1 gives an array of arrays
      rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    }

    if (rows.length < 2) return { error: "File is empty or missing data rows" };

    const dataRows = rows.slice(1);
    const validQuestions: ParsedQuestion[] = [];
    const importErrors: string[] = [];
    
    // Check for duplicates
    const existingQuestions = await db.question.findMany({
      where: { courseId, instituteId: session.instituteId },
      select: { questionText: true }
    });
    const existingTexts = new Set(existingQuestions.map(q => q.questionText.trim().toLowerCase()));
    
    let skipped = 0;

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      if (!row || row.length === 0) continue; // Skip empty rows

      // Excel parsing might yield numbers or undefined if cells are empty. We'll stringify.
      const safeString = (val: unknown) => (val !== undefined && val !== null ? String(val) : "");

      const questionText = safeString(row[0]).trim();
      const optionA = safeString(row[1]).trim();
      const optionB = safeString(row[2]).trim();
      const optionC = safeString(row[3]).trim();
      const optionD = safeString(row[4]).trim();
      const correctOptionRaw = safeString(row[5]);
      const marksRaw = safeString(row[6]);

      if (!questionText && !optionA && !optionB && !optionC && !optionD) {
        // completely empty row
        continue;
      }

      const correctOption = correctOptionRaw.trim().toUpperCase();

      if (!["A", "B", "C", "D"].includes(correctOption)) {
        importErrors.push(`Row ${i + 2}: Invalid correct answer (must be A, B, C, or D)`);
        continue;
      }

      if (!questionText || !optionA || !optionB || !optionC || !optionD) {
        importErrors.push(`Row ${i + 2}: Missing question or options`);
        continue;
      }
      
      if (existingTexts.has(questionText.toLowerCase())) {
        skipped++;
        continue; // duplicate
      }

      const marks = parseInt(marksRaw || "1", 10);

      validQuestions.push({
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctOption: correctOption as "A" | "B" | "C" | "D",
        marks: isNaN(marks) || marks < 1 ? 1 : marks,
      });
      
      // Also add to set so we don't duplicate within the file
      existingTexts.add(questionText.toLowerCase());
    }

    return {
      validRows: validQuestions,
      errors: importErrors,
      skipped
    };
  } catch (e: unknown) {
    console.error(e);
    return { error: "Failed to parse file" };
  }
}

export async function confirmBulkImportAction(
  courseId: string,
  questions: ParsedQuestion[]
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();

    const course = await db.course.findFirst({
      where: { id: courseId, instituteId: session.instituteId },
    });
    if (!course) return { error: "Course not found" };

    if (!questions || questions.length === 0) return { error: "No valid questions to import" };

    const toInsert = questions.map((q) => ({
      instituteId: session.instituteId,
      courseId,
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctOption: q.correctOption,
      marks: q.marks,
      topic: "FUNDAMENTAL" as const,
    }));

    await db.question.createMany({
      data: toInsert,
    });

    revalidatePath("/admin/questions");
    return { success: `Successfully imported ${toInsert.length} questions.` };
  } catch (e: unknown) {
    console.error(e);
    return { error: "Failed to save questions" };
  }
}
