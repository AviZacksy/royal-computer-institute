"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import type { ActionState } from "../admin/types";

export async function submitExamAttemptAction(
  examId: string,
  answers: Record<string, string>,
): Promise<ActionState> {
  try {
    const session = await requireStudentSession();
    if (!session) return { error: "Unauthorized" };

    const exam = await db.exam.findFirst({
      where: { id: examId, instituteId: session.instituteId, isActive: true },
      include: {
        examQuestions: {
          include: { question: true },
        },
      },
    });

    if (!exam) return { error: "Exam not found or inactive" };

    const studentProfile = await db.studentProfile.findFirst({
      where: { userId: session.userId },
    });
    if (!studentProfile) return { error: "Student profile not found" };

    if (exam.courseId !== studentProfile.courseId) {
      return { error: "You are not enrolled in the course for this exam" };
    }

    // Check if already attempted
    const existingAttempt = await db.examAttempt.findFirst({
      where: { examId, studentId: studentProfile.id },
    });

    if (existingAttempt && existingAttempt.submittedAt) {
      return { error: "You have already submitted this exam" };
    }

    // Calculate score
    let score = 0;
    let totalMarks = 0;

    exam.examQuestions.forEach((eq) => {
      totalMarks += eq.question.marks;
      const studentAnswer = answers[eq.question.id];
      if (studentAnswer === eq.question.correctOption) {
        score += eq.question.marks;
      }
    });

    const now = new Date();

    if (existingAttempt) {
      await db.examAttempt.update({
        where: { id: existingAttempt.id },
        data: {
          answers,
          score,
          totalMarks,
          submittedAt: now,
        },
      });
    } else {
      await db.examAttempt.create({
        data: {
          examId,
          studentId: studentProfile.id,
          answers,
          score,
          totalMarks,
          startedAt: now,
          submittedAt: now,
        },
      });
    }

    revalidatePath("/student/exams");
    revalidatePath(`/student/exams/${examId}`);

    return { success: "Exam submitted successfully" };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Failed to submit exam" };
  }
}
