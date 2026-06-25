import Link from "next/link";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";

export default async function StudentExamsPage() {
  const session = await requireStudentSession();
  if (!session) return null;

  const profile = await db.studentProfile.findFirst({
    where: { userId: session.userId },
  });

  if (!profile || !profile.courseId) {
    return (
      <PanelPage title="My Exams" subtitle="View and take assigned exams">
        <div className="rounded-lg border border-dashed border-[var(--ui-border)] p-8 text-center text-[var(--ui-muted)]">
          You are not enrolled in any course yet.
        </div>
      </PanelPage>
    );
  }

  const exams = await db.exam.findMany({
    where: {
      instituteId: session.instituteId,
      courseId: profile.courseId,
      isActive: true,
    },
    include: {
      _count: { select: { examQuestions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const attempts = await db.examAttempt.findMany({
    where: { studentId: profile.id },
  });

  return (
    <PanelPage title="My Exams" subtitle="View and take assigned exams">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {exams.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-[var(--ui-border)] p-8 text-center text-[var(--ui-muted)]">
            No active exams available at the moment.
          </div>
        ) : null}

        {exams.map((exam) => {
          const attempt = attempts.find(a => a.examId === exam.id);
          const isCompleted = attempt && attempt.submittedAt;

          return (
            <Card key={exam.id} className="flex flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--ui-border)] bg-[var(--ui-bg-subtle)] px-4 py-3">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${exam.type === "FINAL" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                  {exam.type} TEST
                </span>
                <span className={`text-xs font-bold ${isCompleted ? "text-green-600" : "text-amber-600"}`}>
                  {isCompleted ? "Completed" : "Pending"}
                </span>
              </div>
              
              <div className="p-4 flex-grow">
                <h3 className="font-bold text-lg text-[var(--ui-text)] mb-2">{exam.title}</h3>
                <div className="text-sm text-[var(--ui-muted)] flex flex-col gap-1 mt-4">
                  <span>⏱ {exam.durationMinutes} minutes</span>
                  <span>❓ {exam._count.examQuestions} questions</span>
                </div>

                {isCompleted && (
                  <div className="mt-4 p-3 bg-[var(--ui-bg-subtle)] rounded border border-[var(--ui-border)]">
                    <p className="text-xs text-[var(--ui-muted)] font-bold uppercase tracking-wider mb-1">Result</p>
                    {exam.type === "MOCK" ? (
                      <p className="font-bold text-lg text-[var(--ui-primary)]">{attempt.score} / {attempt.totalMarks}</p>
                    ) : (
                      <p className="text-sm italic text-[var(--ui-muted)]">Final results hidden until published</p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--ui-border)] bg-[var(--ui-bg-subtle)]">
                {!isCompleted ? (
                  <Link
                    href={`/student/exams/${exam.id}/take`}
                    className="flex w-full items-center justify-center py-3 text-sm font-medium text-white bg-[var(--ui-primary)] hover:opacity-90 transition-opacity"
                  >
                    Start Exam
                  </Link>
                ) : (
                  <div className="py-3 text-center text-sm font-medium text-[var(--ui-muted)]">
                    Exam Submitted
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </PanelPage>
  );
}
