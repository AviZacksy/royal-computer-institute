import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { DB_UNAVAILABLE_MESSAGE, isDatabaseUnavailable } from "@/lib/db-errors";
import { requireDefaultInstitute } from "@/lib/institute";
import type { Role, StudentStatus } from "@prisma/client";
import { createSession, destroySession, type SessionPayload } from "@/lib/auth/session";

export type AuthResult =
  | { ok: true; redirect: string }
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
  email: string;
  phone: string;
  password: string;
  courseId?: string;
  address?: string;
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
            phone: data.phone.trim(),
            address: data.address?.trim(),
            courseId: data.courseId || null,
            status: "PENDING" as StudentStatus,
          },
        },
      },
    });

    return {
      ok: true,
      redirect: "/student-login?registered=1",
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
