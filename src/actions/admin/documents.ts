"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
// We no longer generate static PDFs, we use HTML templates instead.
import type { ActionState } from "./types";

export type { ActionState } from "./types";

const BUCKET = STORAGE_BUCKETS.documents;

export async function generateStudentIdCardAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const studentId = formData.get("studentId") as string;
    const batchTimeInput = String(formData.get("batchTime") ?? "").trim();

    if (!studentId) return { error: "Student is required" };

    const [student, institute] = await Promise.all([
      db.studentProfile.findFirst({
        where: { id: studentId, instituteId: session.instituteId, status: "APPROVED" },
        include: { course: true, user: { select: { email: true } } },
      }),
      db.institute.findUnique({ where: { id: session.instituteId } }),
    ]);

    if (!student) return { error: "Approved student not found" };
    if (!student.course) return { error: "Student is not assigned to a course" };
    if (!institute) return { error: "Institute not found" };

    const batchTime = batchTimeInput || getAdmissionDetailText(student.admissionDetails, "batchTime") || "Regular Batch";

    const key = "HTML_RENDER";

    await db.studentIdCard.upsert({
      where: { studentId },
      create: { instituteId: session.instituteId, studentId, batchTime, storageKey: key },
      update: { batchTime, storageKey: key, generatedAt: new Date() },
    });

    revalidatePath("/admin/documents");
    revalidatePath("/student/documents");
    return { success: "Student ID card generated successfully" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to generate student ID card" };
  }
}

export async function generateAdmitCardAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const studentId = formData.get("studentId") as string;
    const examId = formData.get("examId") as string;

    if (!studentId || !examId) return { error: "Student and Exam are required" };

    const [student, exam, institute] = await Promise.all([
      db.studentProfile.findFirst({
        where: { id: studentId, instituteId: session.instituteId, status: "APPROVED" },
        include: { course: true },
      }),
      db.exam.findFirst({ where: { id: examId, instituteId: session.instituteId } }),
      db.institute.findUnique({ where: { id: session.instituteId } }),
    ]);

    if (!student) return { error: "Approved student not found" };
    if (!exam) return { error: "Exam not found" };
    if (!institute) return { error: "Institute not found" };

    const key = "HTML_RENDER";

    await db.admitCard.upsert({
      where: { studentId_examId: { studentId, examId } },
      create: { instituteId: session.instituteId, studentId, examId, storageKey: key },
      update: { storageKey: key, generatedAt: new Date() },
    });

    revalidatePath("/admin/documents");
    revalidatePath("/student/documents");
    return { success: "Admit card generated successfully" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to generate admit card" };
  }
}

export async function generateCertificateAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const studentId = formData.get("studentId") as string;
    const issueDate = formData.get("completionDate") as string;

    if (!studentId) return { error: "Student is required" };
    if (!issueDate) return { error: "Issue date is required" };

    const [student, institute] = await Promise.all([
      db.studentProfile.findFirst({
        where: { id: studentId, instituteId: session.instituteId, status: "APPROVED" },
        include: { course: true },
      }),
      db.institute.findUnique({ where: { id: session.instituteId } }),
    ]);

    if (!student) return { error: "Approved student not found" };
    if (!student.course) return { error: "Student is not assigned to a course" };
    if (!institute) return { error: "Institute not found" };

    const existing = await db.certificate.findFirst({
      where: { studentId, courseId: student.courseId! },
    });
    const certNumber = existing?.certificateNumber
      ?? `CERT-${Date.now()}-${student.enrollmentNumber ?? randomUUID().slice(0, 6).toUpperCase()}`;

    const key = "HTML_RENDER";

    await db.certificate.upsert({
      where: { studentId_courseId: { studentId, courseId: student.courseId! } },
      create: {
        instituteId: session.instituteId,
        studentId,
        courseId: student.courseId!,
        certificateNumber: certNumber,
        storageKey: key,
      },
      update: { storageKey: key, generatedAt: new Date() },
    });

    revalidatePath("/admin/documents");
    revalidatePath("/student/documents");
    return { success: `Certificate ${certNumber} generated successfully` };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to generate certificate" };
  }
}

export async function generateMarksheetAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const attemptId = formData.get("attemptId") as string;

    if (!attemptId) return { error: "Attempt ID is required" };

    const attempt = await db.examAttempt.findFirst({
      where: { id: attemptId },
      include: {
        exam: { include: { course: true, institute: true } },
        student: true,
      },
    });

    if (!attempt) return { error: "Exam attempt not found" };
    if (attempt.exam.instituteId !== session.instituteId) return { error: "Forbidden" };
    if (attempt.exam.type !== "FINAL") return { error: "Marksheets can only be generated for FINAL exams" };
    if (!attempt.submittedAt) return { error: "Student has not submitted this exam yet" };

    const grade = computeGrade(attempt.score, attempt.totalMarks);

    const key = "HTML_RENDER";

    await db.marksheet.upsert({
      where: { studentId_examId: { studentId: attempt.studentId, examId: attempt.examId } },
      create: {
        instituteId: session.instituteId,
        studentId: attempt.studentId,
        examId: attempt.examId,
        obtainedMarks: attempt.score,
        totalMarks: attempt.totalMarks,
        grade,
        storageKey: key,
      },
      update: {
        obtainedMarks: attempt.score,
        totalMarks: attempt.totalMarks,
        grade,
        storageKey: key,
        generatedAt: new Date(),
      },
    });

    revalidatePath("/admin/documents");
    revalidatePath("/student/documents");
    return { success: "Marksheet generated successfully" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to generate marksheet" };
  }
}

export async function getDocumentUrlAction(storageKey: string): Promise<string> {
  return getStorageProvider().getSignedUrl(BUCKET, storageKey, 3600);
}

function computeGrade(obtained: number, total: number): string {
  if (total === 0) return "N/A";
  const pct = (obtained / total) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 75) return "A";
  if (pct >= 60) return "B";
  if (pct >= 45) return "C";
  if (pct >= 40) return "D";
  return "F";
}



function getAdmissionDetailText(value: unknown, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const record = value as Record<string, unknown>;
  const field = record[key];
  return typeof field === "string" ? field.trim() : "";
}
