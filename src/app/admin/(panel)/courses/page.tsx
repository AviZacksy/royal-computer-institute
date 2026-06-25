import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { DataTable, PanelPage } from "@/components/panels/PanelPage";
import { ActiveBadge } from "@/components/admin/StatusBadge";
import { CourseForm } from "@/components/admin/CourseForm";
import { DeleteCourseButton } from "@/components/admin/DeleteCourseButton";
import { ToggleCourseButton } from "@/components/admin/ToggleCourseButton";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await requireAdminSession();
  if (!session) return null;

  const { edit } = await searchParams;

  const courses = await db.course.findMany({
    where: { instituteId: session.instituteId },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { students: true } } },
  });

  let editCourse = null;
  if (edit) {
    editCourse = courses.find((c) => c.id === edit);
    if (!editCourse) notFound();
  }

  return (
    <PanelPage title="Course Management" subtitle="Add and manage institute courses">
      <CourseForm
        initial={
          editCourse
            ? {
                id: editCourse.id,
                name: editCourse.name,
                description: editCourse.description,
                duration: editCourse.duration,
                totalFee: editCourse.totalFee,
                isActive: editCourse.isActive,
              }
            : undefined
        }
      />

      {edit ? (
        <Link href="/admin/courses" className="text-sm font-semibold text-[var(--ui-primary)] hover:underline">
          Cancel edit
        </Link>
      ) : null}

      <DataTable
        headers={["Title", "Duration", "Fee", "Status", "Enrolled", "Actions"]}
        rows={courses.map((c) => [
          c.name,
          c.duration,
          formatCurrency(c.totalFee),
          <ActiveBadge key={`ab-${c.id}`} active={c.isActive} />,
          c._count.students,
          <div key={`act-${c.id}`} className="flex flex-wrap gap-2">
            <Link
              href={`/admin/courses?edit=${c.id}`}
              className="text-sm font-semibold text-[var(--ui-primary)] hover:underline"
            >
              Edit
            </Link>
            <ToggleCourseButton id={c.id} isActive={c.isActive} />
            <DeleteCourseButton id={c.id} enrolledCount={c._count.students} />
          </div>,
        ])}
      />
    </PanelPage>
  );
}
