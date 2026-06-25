import { getSession, requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import type { Role } from "@prisma/client";

export async function requireAdminSession() {
  const session = await requireSession("ADMIN");
  if (!session) return null;
  return session;
}

export async function requireStudentSession() {
  const session = await requireSession("STUDENT");
  if (!session) return null;
  return session;
}

export async function getStudentProfile() {
  const session = await getSession();
  if (!session?.studentId) return null;

  return db.studentProfile.findUnique({
    where: { id: session.studentId },
    include: {
      course: true,
      feeRecord: true,
      user: { select: { email: true } },
    },
  });
}

export async function requireApprovedStudent() {
  const profile = await getStudentProfile();
  if (!profile || profile.status !== "APPROVED") return null;
  return profile;
}

export function assertSameInstitute(sessionInstituteId: string, resourceInstituteId: string) {
  if (sessionInstituteId !== resourceInstituteId) {
    throw new Error("Forbidden: institute mismatch");
  }
}

export type GuardRole = Role;
