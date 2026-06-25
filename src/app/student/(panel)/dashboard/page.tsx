import { getStudentProfile, requireStudentSession } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { PanelPage, StatCard, StatGrid } from "@/components/panels/PanelPage";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const session = await requireStudentSession();
  if (!session) return null;

  const profile = await getStudentProfile();
  if (!profile) return null;

  const course = profile.course;

  return (
    <PanelPage title={`Welcome, ${profile.name}`} subtitle={`Signed in as ${session.email}`}>
      <StatGrid>
        <StatCard label="Enrollment" value={profile.enrollmentNumber ?? "—"} icon="🪪" />
        <StatCard label="Course" value={course?.name ?? "Not assigned"} icon="💻" />
      </StatGrid>

      <div className="-mt-2">
        <StatusBadge status={profile.status} />
      </div>

      {course ? (
        <Card className="p-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
            Enrolled Course
          </p>
          <p className="mt-2 text-xl font-extrabold text-[var(--ui-primary)]">{course.name}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--ui-muted)]">{course.description}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--ui-muted)]">Duration</dt>
              <dd className="font-semibold text-[var(--ui-text)]">{course.duration}</dd>
            </div>
            <div>
              <dt className="text-[var(--ui-muted)]">Course Fee</dt>
              <dd className="font-semibold text-[var(--ui-text)]">{formatCurrency(course.totalFee)}</dd>
            </div>
          </dl>
        </Card>
      ) : (
        <Card className="p-6">
          <p className="text-sm text-[var(--ui-muted)]">
            No course assigned yet. Contact the institute admin to complete your enrollment.
          </p>
        </Card>
      )}
    </PanelPage>
  );
}
