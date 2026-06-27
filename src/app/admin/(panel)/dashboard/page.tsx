import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage, StatCard, StatGrid } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";

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
        <StatCard label="Total Students" value={totalStudents} icon="students" />
        <StatCard label="Pending Students" value={pendingStudents} icon="pending" />
        <StatCard label="Approved Students" value={approvedStudents} icon="approved" />
        <StatCard label="Total Courses" value={totalCourses} icon="courses" />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <p className="text-sm font-extrabold uppercase tracking-wider text-[var(--ui-secondary)]">
              Today&apos;s Focus
            </p>
          </div>
          <div className="p-6">
            {pendingStudents > 0 ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-xl font-extrabold text-[var(--ui-primary)]">
                      {pendingStudents} approval{pendingStudents === 1 ? "" : "s"} pending
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[var(--ui-muted)]">
                      Review student applications to keep admissions moving smoothly.
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/students/approval"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--ui-accent)] px-5 text-sm font-extrabold text-[var(--ui-primary)] shadow-sm transition hover:brightness-105"
                >
                  Review Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-semibold text-emerald-800">
                All student approvals are up to date.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm font-extrabold uppercase tracking-wider text-[var(--ui-secondary)]">
            Institute Snapshot
          </p>
          <div className="mt-5 grid gap-3">
            <SnapshotRow label="Approval Rate" value={totalStudents ? `${Math.round((approvedStudents / totalStudents) * 100)}%` : "0%"} />
            <SnapshotRow label="Active Catalog" value={`${totalCourses} courses`} />
            <SnapshotRow label="Pending Queue" value={`${pendingStudents} students`} />
          </div>
        </Card>
      </div>
    </PanelPage>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <span className="text-sm font-semibold text-[var(--ui-muted)]">{label}</span>
      <span className="text-sm font-extrabold text-[var(--ui-primary)]">{value}</span>
    </div>
  );
}
