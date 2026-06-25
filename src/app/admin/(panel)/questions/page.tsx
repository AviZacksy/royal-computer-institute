import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage, DataTable } from "@/components/panels/PanelPage";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { BulkImportForm } from "@/components/admin/BulkImportForm";
import { Modal } from "@/components/ui/Modal";

export default async function AdminQuestionsPage(props: { searchParams: Promise<{ courseId?: string }> }) {
  const session = await requireAdminSession();
  if (!session) return null;
  const searchParams = await props.searchParams;
  const courseFilter = searchParams.courseId;

  const courses = await db.course.findMany({
    where: { instituteId: session.instituteId },
    select: { id: true, name: true },
    orderBy: { sortOrder: "asc" },
  });

  const questions = await db.question.findMany({
    where: {
      instituteId: session.instituteId,
      ...(courseFilter ? { courseId: courseFilter } : {}),
    },
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  const tableData = questions.map((q) => ({
    Course: q.course.name,
    Question: q.questionText.length > 50 ? q.questionText.slice(0, 50) + "..." : q.questionText,
    Correct: `Option ${q.correctOption}`,
    Marks: q.marks,
    Status: q.isActive ? "Active" : "Inactive",
    Added: q.createdAt.toLocaleDateString("en-IN"),
  }));

  return (
    <PanelPage
      title="Question Bank"
      subtitle="Manage all MCQ questions across courses"
      action={
        <div className="flex gap-2">
          <Modal triggerText="Bulk Import" triggerVariant="outline">
            <h2 className="mb-4 text-xl font-bold">Bulk Import Questions</h2>
            <BulkImportForm courses={courses} />
          </Modal>
          <Modal triggerText="Add Question">
            <h2 className="mb-4 text-xl font-bold">Add Question</h2>
            <QuestionForm courses={courses} />
          </Modal>
        </div>
      }
    >
      <div className="mb-6 flex gap-2">
        <a 
          href="/admin/questions"
          className={`px-3 py-1.5 text-sm rounded-full ${!courseFilter ? "bg-[var(--ui-primary)] text-white" : "bg-[var(--ui-bg-subtle)] text-[var(--ui-text)]"}`}
        >
          All Courses
        </a>
        {courses.map(c => (
          <a
            key={c.id}
            href={`/admin/questions?courseId=${c.id}`}
            className={`px-3 py-1.5 text-sm rounded-full ${courseFilter === c.id ? "bg-[var(--ui-primary)] text-white" : "bg-[var(--ui-bg-subtle)] text-[var(--ui-text)] hover:bg-[var(--ui-border)]"}`}
          >
            {c.name}
          </a>
        ))}
      </div>

      <DataTable headers={["Course", "Question", "Correct", "Marks", "Status", "Added"]} rows={tableData.map(Object.values)} />
    </PanelPage>
  );
}
