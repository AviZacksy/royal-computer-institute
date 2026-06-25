import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";

export default async function AdminAttemptDetailsPage(props: { params: Promise<{ examId: string; attemptId: string }> }) {
  const session = await requireAdminSession();
  if (!session) return null;
  const params = await props.params;

  const attempt = await db.examAttempt.findFirst({
    where: { id: params.attemptId, examId: params.examId },
    include: {
      student: true,
      exam: {
        include: {
          examQuestions: {
            include: { question: true },
            orderBy: { sortOrder: "asc" }
          }
        }
      }
    }
  });

  if (!attempt || attempt.exam.instituteId !== session.instituteId) return notFound();

  const answers = attempt.answers as Record<string, string>;

  return (
    <PanelPage
      title={`Attempt Details: ${attempt.student.name}`}
      subtitle={`Exam: ${attempt.exam.title} | Score: ${attempt.score} / ${attempt.totalMarks}`}
      backLink={{ href: `/admin/exams/${attempt.examId}/attempts`, label: "Back to Attempts" }}
    >
      <div className="space-y-6">
        {attempt.exam.examQuestions.map((eq, index) => {
          const q = eq.question;
          const studentAns = answers[q.id];
          const isCorrect = studentAns === q.correctOption;

          return (
            <Card key={q.id} className={`p-5 border-l-4 ${isCorrect ? "border-l-green-500" : studentAns ? "border-l-red-500" : "border-l-gray-400"}`}>
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-[var(--ui-text)]">
                  {index + 1}. {q.questionText}
                </h4>
                <span className="text-xs font-bold text-[var(--ui-muted)] whitespace-nowrap ml-4">
                  {q.marks} Marks
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm mb-4">
                <div className={`p-2 rounded border ${q.correctOption === "A" ? "border-green-300 bg-green-50" : "border-[var(--ui-border)] bg-[var(--ui-bg)]"}`}>A. {q.optionA}</div>
                <div className={`p-2 rounded border ${q.correctOption === "B" ? "border-green-300 bg-green-50" : "border-[var(--ui-border)] bg-[var(--ui-bg)]"}`}>B. {q.optionB}</div>
                <div className={`p-2 rounded border ${q.correctOption === "C" ? "border-green-300 bg-green-50" : "border-[var(--ui-border)] bg-[var(--ui-bg)]"}`}>C. {q.optionC}</div>
                <div className={`p-2 rounded border ${q.correctOption === "D" ? "border-green-300 bg-green-50" : "border-[var(--ui-border)] bg-[var(--ui-bg)]"}`}>D. {q.optionD}</div>
              </div>

              <div className="flex gap-4 text-sm font-medium pt-3 border-t border-[var(--ui-border)]">
                <p className="text-[var(--ui-muted)]">Correct Answer: <span className="text-green-600">{q.correctOption}</span></p>
                <p className="text-[var(--ui-muted)]">
                  Student Answer:{" "}
                  {studentAns ? (
                    <span className={isCorrect ? "text-green-600" : "text-red-600"}>{studentAns}</span>
                  ) : (
                    <span className="text-gray-500 italic">Not attempted</span>
                  )}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </PanelPage>
  );
}
