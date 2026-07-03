import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage, DataTable } from "@/components/panels/PanelPage";
import { QuestionForm } from "@/components/admin/QuestionForm";
import { BulkImportForm } from "@/components/admin/BulkImportForm";
import { DeleteQuestionButton } from "@/components/admin/DeleteQuestionButton";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { getMockTopicLabel } from "@/config/exam-topics";

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

  const tableData = questions.map((q) => [
    q.course.name,
    getMockTopicLabel(q.topic),
    q.questionText.length > 50 ? q.questionText.slice(0, 50) + "..." : q.questionText,
    `Option ${q.correctOption}`,
    q.marks,
    <Badge key="status" variant={q.isActive ? "success" : "default"}>{q.isActive ? "Active" : "Inactive"}</Badge>,
    q.createdAt.toLocaleDateString("en-IN"),
    <div key={`actions-${q.id}`} className="flex flex-wrap items-center gap-3">
      <Modal triggerText="Edit" triggerVariant="outline">
        <h2 className="mb-4 text-xl font-bold">Edit Question</h2>
        <QuestionForm
          courses={courses}
          initialData={{
            id: q.id,
            courseId: q.courseId,
            topic: q.topic,
            questionText: q.questionText,
            optionA: q.optionA,
            optionB: q.optionB,
            optionC: q.optionC,
            optionD: q.optionD,
            correctOption: q.correctOption,
            marks: q.marks,
            isActive: q.isActive,
          }}
        />
      </Modal>
      <DeleteQuestionButton id={q.id} />
    </div>,
  ]);

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
          className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${!courseFilter ? "bg-[var(--ui-primary)] text-white shadow-sm" : "bg-white border border-[var(--ui-border)] text-[var(--ui-text)] hover:bg-[var(--ui-surface)]"}`}
        >
          All Courses
        </a>
        {courses.map(c => (
          <a
            key={c.id}
            href={`/admin/questions?courseId=${c.id}`}
            className={`px-3 py-1.5 text-sm rounded-full font-medium transition-colors ${courseFilter === c.id ? "bg-[var(--ui-primary)] text-white shadow-sm" : "bg-white border border-[var(--ui-border)] text-[var(--ui-text)] hover:bg-[var(--ui-surface)]"}`}
          >
            {c.name}
          </a>
        ))}
      </div>

      <DataTable headers={["Course", "Topic", "Question", "Correct", "Marks", "Status", "Added", "Actions"]} rows={tableData} />
    </PanelPage>
  );
}
