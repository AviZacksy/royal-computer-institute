import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage, StatCard, StatGrid } from "@/components/panels/PanelPage";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  const instituteId = session.instituteId;

  const [totalStudents, pendingStudents, approvedStudents, totalCourses] =
    await Promise.all([
      db.studentProfile.count({ where: { instituteId } }),
      db.studentProfile.count({ where: { instituteId, status: "PENDING" } }),
      db.studentProfile.count({ where: { instituteId, status: "APPROVED" } }),
      db.course.count({ where: { instituteId } }),
    ]);

  return (
    <PanelPage title="Dashboard" subtitle={`Signed in as ${session.email}`}>
      <StatGrid>
        <StatCard label="Total Students" value={totalStudents} icon="👥" />
        <StatCard label="Pending Students" value={pendingStudents} icon="⏳" />
        <StatCard label="Approved Students" value={approvedStudents} icon="✅" />
        <StatCard label="Total Courses" value={totalCourses} icon="💻" />
      </StatGrid>

      {pendingStudents > 0 ? (
        <div className="rounded-[var(--radius-card)] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {pendingStudents} student{pendingStudents === 1 ? "" : "s"} awaiting approval.{" "}
          <Link href="/admin/students/approval" className="font-semibold underline">
            Review now
          </Link>
        </div>
      ) : null}
    </PanelPage>
  );
}
