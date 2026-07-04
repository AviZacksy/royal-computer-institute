import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { DataTable, PanelPage } from "@/components/panels/PanelPage";
import { ActiveBadge } from "@/components/admin/StatusBadge";
import { CourseForm } from "@/components/admin/CourseForm";
import { DeleteCourseButton } from "@/components/admin/DeleteCourseButton";
import { ToggleCourseButton } from "@/components/admin/ToggleCourseButton";
import { formatCurrency } from "@/lib/format";
import { resolveCourseImageUrl } from "@/lib/public-content";

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
  const coursesWithImages = await Promise.all(
    courses.map(async (course) => ({
      ...course,
      imageUrl: await resolveCourseImageUrl(course),
    })),
  );

  let editCourse = null;
  if (edit) {
    editCourse = coursesWithImages.find((c) => c.id === edit);
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
                syllabus: editCourse.syllabus,
                eligibility: editCourse.eligibility,
                careerScope: editCourse.careerScope,
                duration: editCourse.duration,
                totalFee: editCourse.totalFee,
                actualFee: editCourse.actualFee,
                installmentFee: editCourse.installmentFee,
                oneTimeFee: editCourse.oneTimeFee,
                imageUrl: editCourse.imageUrl,
                imagePath: editCourse.imagePath,
                isActive: editCourse.isActive,
                isEnquiryEnabled: editCourse.isEnquiryEnabled,
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
        headers={["Course", "Duration", "Actual", "Installment", "One Time", "Status", "Enquiry", "Enrolled", "Actions"]}
        rows={coursesWithImages.map((c) => [
          <div key={`course-${c.id}`} className="flex items-center gap-3">
            {c.imageUrl ? (
              <Image
                src={c.imageUrl}
                alt={c.name}
                width={64}
                height={48}
                unoptimized={c.imageUrl.startsWith("http")}
                className="h-12 w-16 rounded-md border border-[var(--ui-border)] object-cover"
              />
            ) : null}
            <span className="font-semibold">{c.name}</span>
          </div>,
          c.duration,
          formatCurrency(c.actualFee || c.totalFee),
          formatCurrency(c.installmentFee || c.totalFee),
          formatCurrency(c.oneTimeFee || c.totalFee),
          <ActiveBadge key={`ab-${c.id}`} active={c.isActive} />,
          <ActiveBadge key={`eq-${c.id}`} active={c.isEnquiryEnabled} />,
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
