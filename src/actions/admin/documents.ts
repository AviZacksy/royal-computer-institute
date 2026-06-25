"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { buildStorageKey, getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
import {
  generateAdmitCardPdf,
  generateCertificatePdf,
  generateMarksheetPdf,
} from "@/lib/pdf/documents";
import type { ActionState } from "./types";

export type { ActionState } from "./types";

const BUCKET = STORAGE_BUCKETS.documents;

// ─── ADMIT CARD ───────────────────────────────────────────────────────────────

export async function generateAdmitCardAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const studentId = formData.get("studentId") as string;
    const examId    = formData.get("examId") as string;
    const examDate  = formData.get("examDate") as string | null;
    const examTime  = formData.get("examTime") as string | null;

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
    if (!exam)    return { error: "Exam not found" };
    if (!institute) return { error: "Institute not found" };

    const pdfBuffer = await generateAdmitCardPdf({
      instituteName:      institute.name,
      studentName:        student.name,
      enrollmentNumber:   student.enrollmentNumber ?? "",
      courseName:         student.course?.name ?? "N/A",
      examTitle:          exam.title,
      examDate:           examDate || null,
      examTime:           examTime || null,
      examDurationMinutes: exam.durationMinutes,
    });

    const key = buildStorageKey(session.instituteId, "admit-cards", `${randomUUID()}.pdf`);
    await getStorageProvider().upload({
      bucket: BUCKET,
      key,
      body: pdfBuffer,
      contentType: "application/pdf",
      upsert: true,
    });

    await db.admitCard.upsert({
      where: { studentId_examId: { studentId, examId } },
      create: { instituteId: session.instituteId, studentId, examId, storageKey: key },
      update: { storageKey: key, generatedAt: new Date() },
    });

    revalidatePath(`/admin/documents`);
    revalidatePath(`/student/documents`);
    return { success: "Admit card generated successfully" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to generate admit card" };
  }
}

// ─── CERTIFICATE ──────────────────────────────────────────────────────────────

export async function generateCertificateAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const studentId      = formData.get("studentId") as string;
    const completionDate = formData.get("completionDate") as string;

    if (!studentId) return { error: "Student is required" };
    if (!completionDate) return { error: "Completion date is required" };

    const [student, institute] = await Promise.all([
      db.studentProfile.findFirst({
        where: { id: studentId, instituteId: session.instituteId, status: "APPROVED" },
        include: { course: true },
      }),
      db.institute.findUnique({ where: { id: session.instituteId } }),
    ]);

    if (!student)  return { error: "Approved student not found" };
    if (!student.course) return { error: "Student is not assigned to a course" };
    if (!institute) return { error: "Institute not found" };

    // Check if already exists, reuse number
    const existing = await db.certificate.findFirst({
      where: { studentId, courseId: student.courseId! },
    });

    const certNumber = existing?.certificateNumber
      ?? `CERT-${Date.now()}-${student.enrollmentNumber ?? randomUUID().slice(0, 6).toUpperCase()}`;

    const pdfBuffer = await generateCertificatePdf({
      instituteName:     institute.name,
      studentName:       student.name,
      courseName:        student.course.name,
      courseDuration:    student.course.duration,
      completionDate:    new Date(completionDate),
      certificateNumber: certNumber,
    });

    const key = buildStorageKey(session.instituteId, "certificates", `${randomUUID()}.pdf`);
    await getStorageProvider().upload({
      bucket: BUCKET,
      key,
      body: pdfBuffer,
      contentType: "application/pdf",
      upsert: true,
    });

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

    revalidatePath(`/admin/documents`);
    revalidatePath(`/student/documents`);
    return { success: `Certificate ${certNumber} generated successfully` };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to generate certificate" };
  }
}

// ─── MARKSHEET ────────────────────────────────────────────────────────────────

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

    const pdfBuffer = await generateMarksheetPdf({
      instituteName:    attempt.exam.institute.name,
      studentName:      attempt.student.name,
      enrollmentNumber: attempt.student.enrollmentNumber ?? "",
      courseName:       attempt.exam.course.name,
      examTitle:        attempt.exam.title,
      obtainedMarks:    attempt.score,
      totalMarks:       attempt.totalMarks,
      grade,
    });

    const key = buildStorageKey(session.instituteId, "marksheets", `${randomUUID()}.pdf`);
    await getStorageProvider().upload({
      bucket: BUCKET,
      key,
      body: pdfBuffer,
      contentType: "application/pdf",
      upsert: true,
    });

    await db.marksheet.upsert({
      where: { studentId_examId: { studentId: attempt.studentId, examId: attempt.examId } },
      create: {
        instituteId:   session.instituteId,
        studentId:     attempt.studentId,
        examId:        attempt.examId,
        obtainedMarks: attempt.score,
        totalMarks:    attempt.totalMarks,
        grade,
        storageKey:    key,
      },
      update: { obtainedMarks: attempt.score, totalMarks: attempt.totalMarks, grade, storageKey: key, generatedAt: new Date() },
    });

    revalidatePath(`/admin/documents`);
    revalidatePath(`/student/documents`);
    return { success: "Marksheet generated successfully" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to generate marksheet" };
  }
}

// ─── Download URL (server action) ────────────────────────────────────────────

export async function getDocumentUrlAction(storageKey: string): Promise<string> {
  const url = await getStorageProvider().getSignedUrl(BUCKET, storageKey, 3600);
  return url;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
