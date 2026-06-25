import { requireAdminSession, assertSameInstitute } from "@/lib/auth";

export async function requireAdminContext() {
  const session = await requireAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}

export function scopeToInstitute<T extends { instituteId: string }>(
  session: { instituteId: string },
  record: T,
) {
  assertSameInstitute(session.instituteId, record.instituteId);
  return record;
}
