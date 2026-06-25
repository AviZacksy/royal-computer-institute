import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { PendingStudentCard } from "@/components/admin/PendingStudentCard";

export const dynamic = "force-dynamic";

export default async function StudentApprovalPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  const [pending, courses] = await Promise.all([
    db.studentProfile.findMany({
      where: { instituteId: session.instituteId, status: "PENDING" },
      include: {
        course: { select: { name: true } },
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    db.course.findMany({
      where: { instituteId: session.instituteId, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <PanelPage title="Student Approval" subtitle="Approve or reject pending registrations">
      <Link href="/admin/students" className="text-sm font-semibold text-[var(--ui-primary)] hover:underline">
        ← All students
      </Link>

      <div className="mt-4 grid gap-4">
        {pending.map((s) => (
          <PendingStudentCard
            key={s.id}
            student={{
              id: s.id,
              name: s.name,
              phone: s.phone,
              email: s.user.email,
              courseName: s.course?.name ?? null,
              createdAt: s.createdAt.toLocaleDateString("en-IN"),
            }}
            courses={courses}
          />
        ))}
        {pending.length === 0 ? (
          <p className="text-sm text-[var(--ui-muted)]">No pending registrations.</p>
        ) : null}
      </div>
    </PanelPage>
  );
}
