import Link from "next/link";
import type { MockTopic } from "@prisma/client";
import { Clock3, FileQuestion, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { ExamForm } from "@/components/admin/ExamForm";
import { DeleteExamButton } from "@/components/admin/DeleteExamButton";
import { Modal } from "@/components/ui/Modal";
import { Card } from "@/components/ui/Card";
import { getMockTopicLabel } from "@/config/exam-topics";

type ExamCardData = {
  id: string;
  courseId: string;
  title: string;
  type: "MOCK" | "FINAL";
  topic: MockTopic | null;
  durationMinutes: number;
  isActive: boolean;
  course: { name: string };
  _count: { examQuestions: number; attempts: number };
};

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

  const mockExams = exams.filter((exam) => exam.type === "MOCK");
  const finalExams = exams.filter((exam) => exam.type === "FINAL");

  return (
    <PanelPage
      title="Exams"
      subtitle="Manage free topic-wise mock tests and 60-question final exams"
      action={
        <Modal triggerText="Create Exam">
          <h2 className="mb-4 text-xl font-bold">Create Exam</h2>
          <ExamForm courses={courses} />
        </Modal>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/exams"
          className={`rounded-full px-3 py-1.5 text-sm font-semibold ${!courseFilter ? "bg-[var(--ui-primary)] text-white" : "bg-[var(--ui-bg-subtle)] text-[var(--ui-text)]"}`}
        >
          All Courses
        </Link>
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/admin/exams?courseId=${course.id}`}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${courseFilter === course.id ? "bg-[var(--ui-primary)] text-white" : "bg-[var(--ui-bg-subtle)] text-[var(--ui-text)] hover:bg-[var(--ui-border)]"}`}
          >
            {course.name}
          </Link>
        ))}
      </div>

      <ExamGrid
        title="Topic-wise Mock Tests"
        exams={mockExams}
        courses={courses}
        empty="No mock tests found. Create a mock test and assign topic questions."
      />
      <ExamGrid
        title="Final Exams"
        exams={finalExams}
        courses={courses}
        empty="No final exams found. Create final exams for DCA, DTP, or Tally."
      />
    </PanelPage>
  );
}

function ExamGrid({
  title,
  exams,
  courses,
  empty,
}: {
  title: string;
  exams: ExamCardData[];
  courses: { id: string; name: string }[];
  empty: string;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-4 text-lg font-extrabold text-[var(--ui-primary)]">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exams.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-[var(--ui-border)] p-8 text-center text-[var(--ui-muted)]">
            {empty}
          </div>
        ) : null}

        {exams.map((exam) => (
          <Card key={exam.id} className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--ui-border)] bg-[var(--ui-bg-subtle)] px-4 py-3">
              <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${exam.type === "FINAL" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                {exam.type === "MOCK" ? getMockTopicLabel(exam.topic) : "FINAL"}
              </span>
              <span className={`text-xs font-semibold ${exam.isActive ? "text-green-600" : "text-gray-500"}`}>
                {exam.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex-grow p-4">
              <p className="mb-1 text-xs font-semibold text-[var(--ui-primary)]">{exam.course.name}</p>
              <h3 className="mb-2 text-lg font-bold text-[var(--ui-text)]">{exam.title}</h3>
              <div className="mt-4 grid gap-2 text-sm text-[var(--ui-muted)]">
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  {exam.durationMinutes} mins
                </span>
                <span className="flex items-center gap-2">
                  <FileQuestion className="h-4 w-4" />
                  {exam._count.examQuestions}{exam.type === "FINAL" ? "/60" : ""} questions
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {exam._count.attempts} attempts
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 border-t border-[var(--ui-border)] bg-[var(--ui-bg-subtle)]">
              <Modal
                triggerText="Edit"
                triggerClassName="flex items-center justify-center border-r border-b border-[var(--ui-border)] py-3 text-sm font-medium text-[var(--ui-primary)] transition-colors hover:bg-[var(--ui-bg)]"
              >
                <h2 className="mb-4 text-xl font-bold">Edit Exam</h2>
                <ExamForm courses={courses} initialData={exam} />
              </Modal>
              <Link
                href={`/admin/exams/${exam.id}`}
                className="flex items-center justify-center border-b border-[var(--ui-border)] py-3 text-sm font-medium text-[var(--ui-primary)] transition-colors hover:bg-[var(--ui-bg)]"
              >
                Questions
              </Link>
              <Link
                href={`/admin/exams/${exam.id}/attempts`}
                className="flex items-center justify-center border-r border-[var(--ui-border)] py-3 text-sm font-medium text-[var(--ui-primary)] transition-colors hover:bg-[var(--ui-bg)]"
              >
                Results
              </Link>
              <DeleteExamButton id={exam.id} />
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
