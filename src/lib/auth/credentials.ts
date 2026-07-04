import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { DB_UNAVAILABLE_MESSAGE, isDatabaseUnavailable } from "@/lib/db-errors";
import { requireDefaultInstitute } from "@/lib/institute";
import type { Role, StudentStatus } from "@prisma/client";
import { createSession, destroySession, type SessionPayload } from "@/lib/auth/session";
import { buildStorageKey, getStorageProvider, STORAGE_BUCKETS, uploadFile } from "@/lib/storage";

export type AuthResult =
  | { ok: true; redirect: string; admissionNumber?: string }
  | { ok: false; error: string };

export async function loginUser(
  email: string,
  password: string,
  expectedRole: Role,
): Promise<AuthResult> {
  try {
    const institute = await requireDefaultInstitute();
    const normalizedEmail = email.toLowerCase().trim();

    const user = await db.user.findUnique({
      where: {
        instituteId_email: {
          instituteId: institute.id,
          email: normalizedEmail,
        },
      },
      include: { studentProfile: true },
    });

    if (!user || user.role !== expectedRole) {
      return { ok: false, error: "Invalid email or password." };
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return { ok: false, error: "Invalid email or password." };
    }

    if (expectedRole === "STUDENT") {
      const profile = user.studentProfile;
      if (!profile) {
        return { ok: false, error: "Student profile not found." };
      }
      if (profile.status === "PENDING") {
        return {
          ok: false,
          error: "Your registration is pending admin approval. Please wait.",
        };
      }
      if (profile.status === "REJECTED") {
        return {
          ok: false,
          error: profile.rejectionReason
            ? `Registration rejected: ${profile.rejectionReason}`
            : "Your registration was rejected. Contact the institute.",
        };
      }
    }

    const payload: SessionPayload = {
      userId: user.id,
      instituteId: user.instituteId,
      email: user.email,
      role: user.role,
      studentId: user.studentProfile?.id,
    };

    await createSession(payload);

    return {
      ok: true,
      redirect: expectedRole === "ADMIN" ? "/admin/dashboard" : "/student/dashboard",
    };
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return { ok: false, error: DB_UNAVAILABLE_MESSAGE };
    }
    throw error;
  }
}

export async function registerStudent(data: {
  name: string;
  fatherName: string;
  motherName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dateOfBirth: string;
  aadhaarNumber: string;
  email: string;
  phone: string;
  password: string;
  courseId: string;
  qualification: string;
  permanentAddress: string;
  currentAddress: string;
  files: {
    photo: File;
    marksheet: File;
    aadhaarCard: File;
    signature: File;
  };
}): Promise<AuthResult> {
  try {
    const institute = await requireDefaultInstitute();
    const normalizedEmail = data.email.toLowerCase().trim();

    const existing = await db.user.findUnique({
      where: {
        instituteId_email: {
          instituteId: institute.id,
          email: normalizedEmail,
        },
      },
    });
    if (existing) {
      return { ok: false, error: "An account with this email already exists." };
    }

    const course = await db.course.findFirst({
      where: { id: data.courseId, instituteId: institute.id, isActive: true },
      select: { id: true, name: true },
    });
    if (!course) {
      return { ok: false, error: "Selected course is not available." };
    }

    const [photo, marksheet, aadhaarCard, signature] = await Promise.all([
      uploadFile({
        instituteId: institute.id,
        bucket: STORAGE_BUCKETS.documents,
        category: "admission/photo",
        file: data.files.photo,
      }),
      uploadFile({
        instituteId: institute.id,
        bucket: STORAGE_BUCKETS.documents,
        category: "admission/marksheet",
        file: data.files.marksheet,
      }),
      uploadFile({
        instituteId: institute.id,
        bucket: STORAGE_BUCKETS.documents,
        category: "admission/aadhaar",
        file: data.files.aadhaarCard,
      }),
      uploadFile({
        instituteId: institute.id,
        bucket: STORAGE_BUCKETS.documents,
        category: "admission/signature",
        file: data.files.signature,
      }),
    ]);

    const admissionFormKey = "HTML_RENDER";

    const passwordHash = await bcrypt.hash(data.password, 12);

    await db.user.create({
      data: {
        instituteId: institute.id,
        email: normalizedEmail,
        passwordHash,
        role: "STUDENT",
        studentProfile: {
          create: {
            instituteId: institute.id,
            name: data.name.trim(),
            fatherName: data.fatherName.trim(),
            motherName: data.motherName.trim(),
            gender: data.gender,
            dateOfBirth: new Date(data.dateOfBirth),
            email: normalizedEmail,
            phone: data.phone.trim(),
            qualification: data.qualification.trim(),
            permanentAddress: data.permanentAddress.trim(),
            currentAddress: data.currentAddress.trim(),
            address: data.currentAddress.trim(),
            photoStorageKey: photo.key,
            marksheetStorageKey: marksheet.key,
            aadhaarStorageKey: aadhaarCard.key,
            signatureStorageKey: signature.key,
            admissionFormStorageKey: admissionFormKey,
            courseId: course.id,
            status: "PENDING",
          },
        },
      },
    });

    return {
      ok: true,
      redirect: "/student-login?admitted=1",
    };
  } catch (error) {
    if (isDatabaseUnavailable(error)) {
      return { ok: false, error: DB_UNAVAILABLE_MESSAGE };
    }
    throw error;
  }
}

export async function logoutUser() {
  await destroySession();
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
