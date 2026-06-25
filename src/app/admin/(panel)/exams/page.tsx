import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { ExamForm } from "@/components/admin/ExamForm";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";

export default async function AdminExamsPage(props: { searchParams: Promise<{ courseId?: string }> }) {
  const session = await requireAdminSession();
  if (!session) return null;
  const searchParams = await props.searchParams;
  const courseFilter = searchParams.courseId;

  const courses = await db.course.findMany({
    where: { instituteId: session.instituteId },
    select: { id: true, name: true },
    orderBy: { sortOrder: "asc" },
  });

  const exams = await db.exam.findMany({
    where: {
      instituteId: session.instituteId,
      ...(courseFilter ? { courseId: courseFilter } : {}),
    },
    include: {
      course: { select: { name: true } },
      _count: { select: { examQuestions: true, attempts: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PanelPage
      title="Exams"
      subtitle="Manage MOCK and FINAL exams"
      action={
        <Modal triggerText="Create Exam">
          <h2 className="mb-4 text-xl font-bold">Create Exam</h2>
          <ExamForm courses={courses} />
        </Modal>
      }
    >
      <div className="mb-6 flex gap-2">
        <Link 
          href="/admin/exams"
          className={`px-3 py-1.5 text-sm rounded-full ${!courseFilter ? "bg-[var(--ui-primary)] text-white" : "bg-[var(--ui-bg-subtle)] text-[var(--ui-text)]"}`}
        >
          All Courses
        </Link>
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/admin/exams?courseId=${c.id}`}
            className={`px-3 py-1.5 text-sm rounded-full ${courseFilter === c.id ? "bg-[var(--ui-primary)] text-white" : "bg-[var(--ui-bg-subtle)] text-[var(--ui-text)] hover:bg-[var(--ui-border)]"}`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exams.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-[var(--ui-border)] p-8 text-center text-[var(--ui-muted)]">
            No exams found. Create one to get started.
          </div>
        ) : null}

        {exams.map((exam) => (
          <Card key={exam.id} className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--ui-border)] bg-[var(--ui-bg-subtle)] px-4 py-3">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${exam.type === "FINAL" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                {exam.type}
              </span>
              <span className={`text-xs ${exam.isActive ? "text-green-600" : "text-gray-500"}`}>
                {exam.isActive ? "● Active" : "○ Inactive"}
              </span>
            </div>
            <div className="p-4 flex-grow">
              <p className="text-xs font-semibold text-[var(--ui-primary)] mb-1">{exam.course.name}</p>
              <h3 className="font-bold text-lg text-[var(--ui-text)] mb-2">{exam.title}</h3>
              <div className="text-sm text-[var(--ui-muted)] flex items-center justify-between mt-4">
                <span>⏱ {exam.durationMinutes} mins</span>
                <span>❓ {exam._count.examQuestions} questions</span>
              </div>
              <div className="text-sm text-[var(--ui-muted)] mt-1">
                <span>👥 {exam._count.attempts} attempts</span>
              </div>
            </div>
            <div className="border-t border-[var(--ui-border)] grid grid-cols-2 bg-[var(--ui-bg-subtle)]">
              <Link
                href={`/admin/exams/${exam.id}`}
                className="flex items-center justify-center py-3 text-sm font-medium text-[var(--ui-primary)] hover:bg-[var(--ui-bg)] transition-colors border-r border-[var(--ui-border)]"
              >
                Manage Questions
              </Link>
              <Link
                href={`/admin/exams/${exam.id}/attempts`}
                className="flex items-center justify-center py-3 text-sm font-medium text-[var(--ui-primary)] hover:bg-[var(--ui-bg)] transition-colors"
              >
                View Attempts
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </PanelPage>
  );
}
