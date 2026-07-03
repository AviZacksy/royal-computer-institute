import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { ExamQuestionsForm } from "@/components/admin/ExamQuestionsForm";
import { getMockTopicLabel } from "@/config/exam-topics";

export default async function AdminExamDetailsPage(props: { params: Promise<{ examId: string }> }) {
  const session = await requireAdminSession();
  if (!session) return null;
  const params = await props.params;

  const exam = await db.exam.findFirst({
    where: { id: params.examId, instituteId: session.instituteId },
    include: {
      course: true,
      examQuestions: true,
    },
  });

  if (!exam) return notFound();

  const allQuestions = await db.question.findMany({
    where: { 
      instituteId: session.instituteId,
      courseId: exam.courseId,
      isActive: true,
      ...(exam.type === "MOCK" && exam.topic ? { topic: exam.topic } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      questionText: true,
      marks: true,
      correctOption: true,
      topic: true,
    }
  });

  const selectedQuestionIds = exam.examQuestions.map(eq => eq.questionId);

  return (
    <PanelPage
      title={`Manage Questions: ${exam.title}`}
      subtitle={
        exam.type === "MOCK"
          ? `Select ${getMockTopicLabel(exam.topic)} questions from the ${exam.course.name} question bank`
          : `Select exactly 60 questions from the ${exam.course.name} question bank`
      }
      backLink={{ href: "/admin/exams", label: "Back to Exams" }}
    >
      <div className="mb-6 rounded-lg bg-[var(--ui-bg-subtle)] p-4 border border-[var(--ui-border)] flex flex-wrap gap-4 items-center justify-between">
        <div>
          <p className="text-sm text-[var(--ui-muted)]">Type: <span className="font-bold text-[var(--ui-text)]">{exam.type}</span></p>
          {exam.type === "MOCK" ? (
            <p className="text-sm text-[var(--ui-muted)]">Topic: <span className="font-bold text-[var(--ui-text)]">{getMockTopicLabel(exam.topic)}</span></p>
          ) : (
            <p className="text-sm text-[var(--ui-muted)]">Required Questions: <span className="font-bold text-[var(--ui-text)]">60</span></p>
          )}
          <p className="text-sm text-[var(--ui-muted)]">Duration: <span className="font-bold text-[var(--ui-text)]">{exam.durationMinutes} mins</span></p>
        </div>
        <Link 
          href={`/admin/exams/${exam.id}/attempts`}
          className="text-sm text-[var(--ui-primary)] hover:underline font-medium"
        >
          View Student Attempts &rarr;
        </Link>
      </div>

      <ExamQuestionsForm 
        examId={exam.id}
        examType={exam.type}
        allQuestions={allQuestions}
        selectedQuestionIds={selectedQuestionIds}
      />
    </PanelPage>
  );
}
