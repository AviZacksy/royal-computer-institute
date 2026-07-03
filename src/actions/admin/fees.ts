"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { buildStorageKey, getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";
import { feeRecordSchema, manualPaymentSchema, paymentVerifySchema } from "@/lib/validations";
import { generateReceiptPdf } from "@/lib/pdf/receipt";
import type { ActionState } from "./types";

export type { ActionState } from "./types";

// ─── Upsert Fee Record ────────────────────────────────────────────────────────

export async function upsertFeeRecordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = feeRecordSchema.safeParse({
      studentId: formData.get("studentId"),
      totalFee: formData.get("totalFee"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const { studentId, totalFee } = parsed.data;

    // Verify student belongs to this institute
    const student = await db.studentProfile.findFirst({
      where: { id: studentId, instituteId: session.instituteId, status: "APPROVED" },
      include: { feeRecord: true },
    });
    if (!student) return { error: "Approved student not found" };

    const existingRecord = student.feeRecord;

    if (existingRecord) {
      await db.feeRecord.update({
        where: { studentId },
        data: {
          totalFee,
          dueAmount: Math.max(0, totalFee - existingRecord.receivedAmount),
        },
      });
    } else {
      await db.feeRecord.create({
        data: {
          studentId,
          totalFee,
          receivedAmount: 0,
          dueAmount: totalFee,
        },
      });
    }

    revalidatePath("/admin/fees");
    revalidatePath(`/admin/fees/${studentId}`);
    return { success: "Fee record saved" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

// ─── Add Manual Payment ───────────────────────────────────────────────────────

export async function addManualPaymentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = manualPaymentSchema.safeParse({
      studentId: formData.get("studentId"),
      amount: formData.get("amount"),
      notes: formData.get("notes") || undefined,
      paymentDate: formData.get("paymentDate"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const { studentId, amount, notes, paymentDate } = parsed.data;

    const student = await db.studentProfile.findFirst({
      where: { id: studentId, instituteId: session.instituteId, status: "APPROVED" },
      include: {
        feeRecord: true,
        course: true,
        user: { select: { email: true } },
      },
    });
    if (!student) return { error: "Approved student not found" };
    if (!student.feeRecord) return { error: "Create a fee record for this student first" };

    const verifiedAt = new Date();
    const parsedPaymentDate = new Date(paymentDate);

    // Create payment submission (pre-verified)
    const payment = await db.paymentSubmission.create({
      data: {
        studentId,
        amount,
        transactionId: `MANUAL-${randomUUID().slice(0, 8).toUpperCase()}`,
        status: "VERIFIED",
        adminNotes: notes || "Manual payment entry by admin",
        verifiedById: session.userId,
        verifiedAt,
        createdAt: parsedPaymentDate,
      },
    });

    // Update fee record
    const newReceived = student.feeRecord.receivedAmount + amount;
    const newDue = Math.max(0, student.feeRecord.totalFee - newReceived);
    await db.feeRecord.update({
      where: { studentId },
      data: { receivedAmount: newReceived, dueAmount: newDue },
    });

    // Generate receipt PDF
    await generateAndSaveReceipt({
      paymentId: payment.id,
      studentName: student.name,
      enrollmentNumber: student.enrollmentNumber ?? "",
      courseName: student.course?.name ?? "N/A",
      amount,
      totalFee: student.feeRecord.totalFee,
      paidAmount: newReceived,
      dueAmount: newDue,
      transactionId: payment.transactionId,
      paymentDate: parsedPaymentDate,
      verifiedAt,
      verifiedByEmail: session.email,
      instituteName: "Royal Computer Institute",
      instituteId: session.instituteId,
    });

    revalidatePath("/admin/fees");
    revalidatePath(`/admin/fees/${studentId}`);
    revalidatePath("/admin/payments");
    return { success: `Manual payment of ₹${amount.toLocaleString("en-IN")} recorded` };
  } catch (e) {
    console.error(e);
    return { error: "Something went wrong. Please try again." };
  }
}

// ─── Verify / Reject Payment ──────────────────────────────────────────────────

export async function verifyPaymentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = paymentVerifySchema.safeParse({
      paymentId: formData.get("paymentId"),
      action: formData.get("action"),
      adminNotes: formData.get("adminNotes") || undefined,
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const { paymentId, action, adminNotes } = parsed.data;

    const payment = await db.paymentSubmission.findFirst({
      where: { id: paymentId },
      include: {
        student: {
          include: {
            institute: true,
            feeRecord: true,
            course: true,
            user: { select: { email: true } },
          },
        },
      },
    });

    if (!payment) return { error: "Payment not found" };
    if (payment.student.instituteId !== session.instituteId) return { error: "Forbidden" };
    if (payment.status !== "PENDING") return { error: "Payment already reviewed" };

    const verifiedAt = new Date();

    if (action === "verify") {
      if (payment.paymentType === "EXAM") {
        await db.$transaction([
          db.paymentSubmission.update({
            where: { id: paymentId },
            data: {
              status: "VERIFIED",
              adminNotes: adminNotes || null,
              verifiedById: session.userId,
              verifiedAt,
            },
          }),
          db.examRegistration.updateMany({
            where: { paymentSubmissionId: paymentId },
            data: { isAccessEnabled: true },
          }),
        ]);
        // Note: We skip generating a fee receipt for exam payments for now, 
        // as the fee record is only for course fees.
      } else {
        const feeRecord = payment.student.feeRecord;
        if (!feeRecord) return { error: "No fee record for this student" };

        const newReceived = feeRecord.receivedAmount + payment.amount;
        const newDue = Math.max(0, feeRecord.totalFee - newReceived);

        await db.$transaction([
          db.paymentSubmission.update({
            where: { id: paymentId },
            data: {
              status: "VERIFIED",
              adminNotes: adminNotes || null,
              verifiedById: session.userId,
              verifiedAt,
            },
          }),
          db.feeRecord.update({
            where: { studentId: payment.studentId },
            data: { receivedAmount: newReceived, dueAmount: newDue },
          }),
        ]);

        // Generate receipt PDF
        await generateAndSaveReceipt({
          paymentId,
          studentName: payment.student.name,
          enrollmentNumber: payment.student.enrollmentNumber ?? "",
          courseName: payment.student.course?.name ?? "N/A",
          amount: payment.amount,
          totalFee: feeRecord.totalFee,
          paidAmount: newReceived,
          dueAmount: newDue,
          transactionId: payment.transactionId,
          paymentDate: payment.createdAt,
          verifiedAt,
          verifiedByEmail: session.email,
          instituteName: payment.student.institute.name,
          instituteId: session.instituteId,
        });
      }
    } else {
      await db.paymentSubmission.update({
        where: { id: paymentId },
        data: {
          status: "REJECTED",
          adminNotes: adminNotes || null,
          verifiedById: session.userId,
          verifiedAt,
        },
      });
    }

    revalidatePath("/admin/payments");
    revalidatePath("/admin/fees");
    revalidatePath(`/admin/fees/${payment.studentId}`);
    revalidatePath("/student/fees");
    return {
      success: action === "verify" ? "Payment verified and receipt generated" : "Payment rejected",
    };
  } catch (e: unknown) {
    console.error(e);
    return { error: (e as Error).message || "Something went wrong. Please try again." };
  }
}

// ─── Internal: Generate and save receipt ─────────────────────────────────────

async function generateAndSaveReceipt(opts: {
  paymentId: string;
  studentName: string;
  enrollmentNumber: string;
  courseName: string;
  amount: number;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  transactionId?: string | null;
  paymentDate: Date;
  verifiedAt: Date;
  verifiedByEmail?: string;
  instituteName: string;
  instituteId: string;
}) {
  const count = await db.receipt.count();
  const receiptNumber = `RCI-${new Date().getFullYear()}-${String(count + 1).padStart(5, "0")}`;

  const pdfBuffer = await generateReceiptPdf({
    receiptNumber,
    studentName: opts.studentName,
    enrollmentNumber: opts.enrollmentNumber,
    courseName: opts.courseName,
    amount: opts.amount,
    totalFee: opts.totalFee,
    paidAmount: opts.paidAmount,
    dueAmount: opts.dueAmount,
    transactionId: opts.transactionId,
    paymentDate: opts.paymentDate,
    verifiedAt: opts.verifiedAt,
    verifiedByEmail: opts.verifiedByEmail,
    instituteName: opts.instituteName,
  });

  const key = buildStorageKey(opts.instituteId, "receipts", `${randomUUID()}.pdf`);
  await getStorageProvider().upload({
    bucket: STORAGE_BUCKETS.documents,
    key,
    body: pdfBuffer,
    contentType: "application/pdf",
  });

  await db.receipt.create({
    data: {
      instituteId: opts.instituteId,
      paymentSubmissionId: opts.paymentId,
      receiptNumber,
      storageKey: key,
    },
  });
}
