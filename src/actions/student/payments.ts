"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import { buildStorageKey, getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
import { paymentSubmitSchema } from "@/lib/validations";
import { randomUUID } from "crypto";
import path from "path";

type ActionState = { error?: string; success?: string } | null;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function submitPaymentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireStudentSession();
    if (!session?.studentId) return { error: "Not authenticated" };

    const parsed = paymentSubmitSchema.safeParse({
      amount: formData.get("amount"),
      transactionId: formData.get("transactionId") || undefined,
      paymentDate: formData.get("paymentDate"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const { amount, transactionId, paymentDate } = parsed.data;

    // Verify the student is approved and has a fee record
    const student = await db.studentProfile.findFirst({
      where: { id: session.studentId, status: "APPROVED" },
      include: { feeRecord: true },
    });
    if (!student) return { error: "Student profile not found or not approved" };
    if (!student.feeRecord) return { error: "No fee record found. Contact the admin." };
    if (student.feeRecord.dueAmount <= 0) return { error: "No outstanding fee balance" };
    if (amount > student.feeRecord.dueAmount) {
      return { error: `Amount cannot exceed due amount of ₹${student.feeRecord.dueAmount.toLocaleString("en-IN")}` };
    }

    // Check for any existing PENDING payment (prevent duplicates)
    const existingPending = await db.paymentSubmission.findFirst({
      where: { studentId: session.studentId, status: "PENDING" },
    });
    if (existingPending) {
      return { error: "You already have a pending payment awaiting verification. Please wait for admin review." };
    }

    // Handle screenshot upload
    const screenshot = formData.get("screenshot") as File | null;
    let screenshotStorageKey: string | null = null;

    if (screenshot && screenshot.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(screenshot.type)) {
        return { error: "Screenshot must be a JPG, PNG, or WebP image" };
      }
      if (screenshot.size > MAX_FILE_SIZE) {
        return { error: "Screenshot must be smaller than 5 MB" };
      }
      const ext = path.extname(screenshot.name) || ".jpg";
      const key = buildStorageKey(student.instituteId, "payment-screenshots", `${randomUUID()}${ext}`);
      const buffer = Buffer.from(await screenshot.arrayBuffer());
      await getStorageProvider().upload({
        bucket: STORAGE_BUCKETS.payments,
        key,
        body: buffer,
        contentType: screenshot.type,
      });
      screenshotStorageKey = key;
    }

    await db.paymentSubmission.create({
      data: {
        studentId: session.studentId,
        amount,
        transactionId: transactionId?.trim() || null,
        screenshotStorageKey,
        status: "PENDING",
        createdAt: new Date(paymentDate),
      },
    });

    revalidatePath("/student/fees");
    return { success: "Payment submitted for verification. You will be notified once reviewed." };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function submitExamPaymentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireStudentSession();
    if (!session?.studentId) return { error: "Not authenticated" };

    const amount = Number(formData.get("amount"));
    const transactionId = formData.get("transactionId")?.toString();
    const paymentDate = formData.get("paymentDate")?.toString();
    const examId = formData.get("examId")?.toString();

    if (!amount || !paymentDate || !examId) {
      return { error: "Amount, payment date, and exam ID are required" };
    }

    const student = await db.studentProfile.findFirst({
      where: { id: session.studentId, status: "APPROVED" },
    });
    if (!student) return { error: "Student profile not found or not approved" };

    const exam = await db.exam.findFirst({
      where: { id: examId, instituteId: session.instituteId, isActive: true },
    });
    if (!exam) return { error: "Exam not found or inactive" };

    const existingRegistration = await db.examRegistration.findUnique({
      where: { studentId_examId: { studentId: session.studentId, examId } },
      include: { paymentSubmission: true },
    });
    if (existingRegistration) {
      if (existingRegistration.isAccessEnabled) {
        return { error: "You are already registered for this exam." };
      }
      if (existingRegistration.paymentSubmission?.status === "PENDING") {
        return { error: "Your exam payment is already under review." };
      }
    }

    const screenshot = formData.get("screenshot") as File | null;
    let screenshotStorageKey: string | null = null;

    if (screenshot && screenshot.size > 0) {
      if (!ALLOWED_IMAGE_TYPES.includes(screenshot.type)) {
        return { error: "Screenshot must be a JPG, PNG, or WebP image" };
      }
      if (screenshot.size > MAX_FILE_SIZE) {
        return { error: "Screenshot must be smaller than 5 MB" };
      }
      const ext = path.extname(screenshot.name) || ".jpg";
      const key = buildStorageKey(session.instituteId, "payment-screenshots", `${randomUUID()}${ext}`);
      const buffer = Buffer.from(await screenshot.arrayBuffer());
      await getStorageProvider().upload({
        bucket: STORAGE_BUCKETS.payments,
        key,
        body: buffer,
        contentType: screenshot.type,
      });
      screenshotStorageKey = key;
    }

    const payment = await db.paymentSubmission.create({
      data: {
        studentId: session.studentId,
        amount,
        transactionId: transactionId?.trim() || null,
        screenshotStorageKey,
        paymentType: "EXAM",
        status: "PENDING",
        createdAt: new Date(paymentDate),
      },
    });

    if (existingRegistration) {
      await db.examRegistration.update({
        where: { id: existingRegistration.id },
        data: { paymentSubmissionId: payment.id },
      });
    } else {
      await db.examRegistration.create({
        data: {
          instituteId: session.instituteId,
          studentId: session.studentId,
          examId,
          paymentSubmissionId: payment.id,
          isAccessEnabled: false,
        },
      });
    }

    revalidatePath("/student/exams");
    return { success: "Exam fee submitted for verification. You will be notified once reviewed." };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong. Please try again." };
  }
}

