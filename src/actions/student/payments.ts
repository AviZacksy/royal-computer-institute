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
