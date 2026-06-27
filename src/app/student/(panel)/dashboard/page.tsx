import Image from "next/image";
import { Clock3, GraduationCap, WalletCards } from "lucide-react";
import { getStudentProfile, requireStudentSession } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { PanelPage, StatCard, StatGrid } from "@/components/panels/PanelPage";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatCurrency } from "@/lib/format";
import { resolveCourseImageUrl } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const session = await requireStudentSession();
  if (!session) return null;

  const profile = await getStudentProfile();
  if (!profile) return null;

  const course = profile.course;
  const courseImageUrl = course ? await resolveCourseImageUrl(course) : null;

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
        <Card className="overflow-hidden">
          {courseImageUrl ? (
            <div className="relative aspect-[16/7] w-full bg-[var(--ui-surface)]">
              <Image
                src={courseImageUrl}
                alt={course.name}
                fill
                unoptimized={courseImageUrl.startsWith("http")}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[var(--ui-secondary)] shadow-sm">
                Enrolled Course
              </div>
            </div>
          ) : null}
          <div className="p-6">
            {!courseImageUrl ? (
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
                Enrolled Course
              </p>
            ) : null}
            <p className="mt-2 font-display text-2xl font-extrabold text-[var(--ui-primary)]">{course.name}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--ui-muted)]">{course.description}</p>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <dt className="flex items-center gap-2 text-[var(--ui-muted)]">
                  <Clock3 className="h-4 w-4 text-[var(--ui-secondary)]" />
                  Duration
                </dt>
                <dd className="mt-1 font-extrabold text-[var(--ui-primary)]">{course.duration}</dd>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <dt className="flex items-center gap-2 text-[var(--ui-muted)]">
                  <WalletCards className="h-4 w-4 text-[var(--ui-secondary)]" />
                  Course Fee
                </dt>
                <dd className="mt-1 font-extrabold text-[var(--ui-primary)]">{formatCurrency(course.oneTimeFee || course.totalFee)}</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-[var(--ui-secondary)]">
              <GraduationCap className="h-4 w-4" />
              Continue learning and check your notes, documents, and exams from the sidebar.
            </div>
          </div>
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
