import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { DataTable, PanelPage } from "@/components/panels/PanelPage";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { AssignCourseForm } from "@/components/admin/AssignCourseForm";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  const [students, courses] = await Promise.all([
    db.studentProfile.findMany({
      where: { instituteId: session.instituteId },
      include: {
        course: { select: { id: true, name: true } },
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.course.findMany({
      where: { instituteId: session.instituteId, isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <PanelPage title="Students" subtitle="All registered students and enrollments">
      <div className="flex justify-end">
        <Link
          href="/admin/students/approval"
          className="text-sm font-semibold text-[var(--ui-primary)] hover:underline"
        >
          Pending approvals →
        </Link>
      </div>

      <DataTable
        headers={["Name", "Email", "Status", "Enrollment", "Course", "Actions"]}
        rows={students.map((s) => [
          s.name,
          s.user.email,
          <StatusBadge key={`st-${s.id}`} status={s.status} />,
          s.enrollmentNumber ?? "—",
          s.course?.name ?? "—",
          <div key={`act-${s.id}`} className="flex items-center gap-4">
            <Link href={`/admin/students/${s.id}`} className="text-sm font-bold text-[var(--ui-secondary)] hover:underline whitespace-nowrap">
              View Profile
            </Link>
            {s.status === "APPROVED" && (
              <AssignCourseForm
                studentId={s.id}
                courses={courses}
                currentCourseId={s.courseId}
              />
            )}
          </div>
        ])}
      />
    </PanelPage>
  );
}
