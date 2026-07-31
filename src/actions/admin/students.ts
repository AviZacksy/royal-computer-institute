"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { generateEnrollmentNumber, generateAdmissionNumber } from "@/lib/format";
import { assignCourseSchema, studentApprovalSchema } from "@/lib/validations";
import { getStorageProvider, STORAGE_BUCKETS } from "@/lib/storage";

import type { ActionState } from "./types";

export type { ActionState } from "./types";

export async function reviewStudentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = studentApprovalSchema.safeParse({
      studentId: formData.get("studentId"),
      action: formData.get("action"),
      rejectionReason: formData.get("rejectionReason") || undefined,
      enrollmentNumber: formData.get("enrollmentNumber") || undefined,
      courseId: formData.get("courseId") || undefined,
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const { studentId, action, rejectionReason, enrollmentNumber, courseId } = parsed.data;

    const student = await db.studentProfile.findFirst({
      where: { id: studentId, instituteId: session.instituteId },
    });
    if (!student) {
      return { error: "Student not found" };
    }
    if (student.status !== "PENDING") {
      return { error: "This student is no longer pending approval" };
    }

    if (action === "approve") {
      if (!courseId) {
        return { error: "Select a course before approving" };
      }

      const course = await db.course.findFirst({
        where: { id: courseId, instituteId: session.instituteId, isActive: true },
      });
      if (!course) {
        return { error: "Selected course is not available" };
      }

      let enrollment = "";
      if (enrollmentNumber?.trim()) {
        enrollment = enrollmentNumber.trim();
      } else {
        let isUnique = false;
        while (!isUnique) {
          enrollment = generateEnrollmentNumber();
          const taken = await db.studentProfile.findFirst({
            where: { instituteId: session.instituteId, enrollmentNumber: enrollment },
          });
          if (!taken) {
            isUnique = true;
          }
        }
      }

      let admissionNum = "";
      let isAdmUnique = false;
      while (!isAdmUnique) {
        admissionNum = generateAdmissionNumber();
        const admTaken = await db.studentProfile.findFirst({
          where: { instituteId: session.instituteId, admissionNumber: admissionNum },
        });
        if (!admTaken) {
          isAdmUnique = true;
        }
      }

      await db.studentProfile.update({
        where: { id: studentId },
        data: {
          status: "APPROVED",
          approvedAt: new Date(),
          enrollmentNumber: enrollment,
          admissionNumber: admissionNum,
          admissionDate: new Date(),
          courseId,
          rejectionReason: null,
        },
      });
      
      // Also generate a FeeRecord for this course
      const existingFee = await db.feeRecord.findUnique({
        where: { studentId },
      });
      if (!existingFee && course) {
        await db.feeRecord.create({
          data: {
            studentId,
            totalFee: course.totalFee,
            receivedAmount: 0,
            dueAmount: course.totalFee,
          },
        });
      }
    } else {
      await db.studentProfile.update({
        where: { id: studentId },
        data: {
          status: "REJECTED",
          rejectionReason: rejectionReason?.trim() || "Application rejected by admin",
          approvedAt: null,
        },
      });
    }

    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/students");
    revalidatePath("/admin/students/approval");
    return { success: action === "approve" ? "Student approved" : "Student rejected" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function assignCourseAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = assignCourseSchema.safeParse({
      studentId: formData.get("studentId"),
      courseId: formData.get("courseId"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const student = await db.studentProfile.findFirst({
      where: {
        id: parsed.data.studentId,
        instituteId: session.instituteId,
        status: "APPROVED",
      },
    });
    if (!student) {
      return { error: "Approved student not found" };
    }

    const course = await db.course.findFirst({
      where: {
        id: parsed.data.courseId,
        instituteId: session.instituteId,
        isActive: true,
      },
    });
    if (!course) {
      return { error: "Course not found or inactive" };
    }

    await db.studentProfile.update({
      where: { id: student.id },
      data: { courseId: course.id },
    });

    revalidatePath("/admin/students");
    revalidatePath("/student/dashboard");
    return { success: "Course assigned successfully" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

import { hashPassword } from "@/lib/auth/credentials";
import { z } from "zod";

const resetPasswordSchema = z.object({
  studentId: z.string().cuid(),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export async function resetStudentPasswordAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = resetPasswordSchema.safeParse({
      studentId: formData.get("studentId"),
      newPassword: formData.get("newPassword"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const { studentId, newPassword } = parsed.data;

    // Find the student profile to get the userId
    const student = await db.studentProfile.findFirst({
      where: {
        id: studentId,
        instituteId: session.instituteId,
      },
      select: { userId: true },
    });

    if (!student) {
      return { error: "Student not found" };
    }

    const passwordHash = await hashPassword(newPassword);

    await db.user.update({
      where: { id: student.userId },
      data: { passwordHash },
    });

    return { success: "Password reset successfully. Tell the student the new password." };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deleteStudentAction(studentId: string): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    if (!studentId) {
      return { error: "Student ID is required" };
    }

    const student = await db.studentProfile.findFirst({
      where: { id: studentId, instituteId: session.instituteId },
      include: {
        payments: {
          include: { receipt: true },
        },
      },
    });

    if (!student) {
      return { error: "Student not found" };
    }

    const storage = getStorageProvider();

    // 1. Gather all files to clean up from storage
    const docKeys = [
      student.photoStorageKey,
      student.marksheetStorageKey,
      student.aadhaarStorageKey,
      student.signatureStorageKey,
      student.admissionFormStorageKey,
    ].filter(Boolean) as string[];

    const paymentKeys = student.payments
      .map((p) => p.screenshotStorageKey)
      .filter(Boolean) as string[];

    const receiptKeys = student.payments
      .map((p) => p.receipt?.storageKey)
      .filter((k) => k && k !== "HTML_RENDER") as string[];

    // 2. Safely delete storage files (catch errors so database deletion is not blocked)
    for (const key of docKeys) {
      await storage.delete(STORAGE_BUCKETS.documents, key).catch(() => undefined);
    }
    for (const key of paymentKeys) {
      await storage.delete(STORAGE_BUCKETS.payments, key).catch(() => undefined);
    }
    for (const key of receiptKeys) {
      await storage.delete(STORAGE_BUCKETS.documents, key).catch(() => undefined);
    }

    // 3. Delete the associated User record, cascading to delete the profile and all linked records
    await db.user.delete({
      where: { id: student.userId },
    });

    // 4. Revalidate all relevant cache paths
    revalidatePath("/admin/students");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/fees");
    revalidatePath("/admin/payments");
    revalidatePath("/admin/documents");

    return { success: "Student deleted successfully" };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { error: "Something went wrong. Please try again." };
  }
}
