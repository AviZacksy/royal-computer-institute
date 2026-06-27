import Link from "next/link";
import { BookOpenCheck, Clock3, FileQuestion, Trophy } from "lucide-react";
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
        <Card className="p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[var(--ui-secondary)]">
            <BookOpenCheck className="h-7 w-7" />
          </div>
          <p className="font-semibold text-[var(--ui-primary)]">No course assigned yet</p>
          <p className="mt-1 text-sm text-[var(--ui-muted)]">
            Your exams will appear here after course enrollment.
          </p>
        </Card>
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
    <PanelPage title="My Exams" subtitle="View assigned tests, time limits, and submitted results">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {exams.length === 0 ? (
          <Card className="col-span-full p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-[var(--ui-secondary)]">
              <FileQuestion className="h-7 w-7" />
            </div>
            <p className="font-semibold text-[var(--ui-primary)]">No active exams</p>
            <p className="mt-1 text-sm text-[var(--ui-muted)]">
              Your institute has not published an active exam for your course yet.
            </p>
          </Card>
        ) : null}

        {exams.map((exam) => {
          const attempt = attempts.find((a) => a.examId === exam.id);
          const isCompleted = Boolean(attempt?.submittedAt);

          return (
            <Card key={exam.id} className="flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
                <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${
                  exam.type === "FINAL"
                    ? "border-amber-200 bg-amber-50 text-amber-800"
                    : "border-blue-200 bg-blue-50 text-blue-700"
                }`}>
                  {exam.type} TEST
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                  isCompleted ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"
                }`}>
                  {isCompleted ? "Completed" : "Pending"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-extrabold text-[var(--ui-primary)]">
                  {exam.title}
                </h3>
                <div className="mt-5 grid gap-2 text-sm text-[var(--ui-muted)]">
                  <span className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[var(--ui-secondary)]" />
                    {exam.durationMinutes} minutes
                  </span>
                  <span className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4 text-[var(--ui-secondary)]" />
                    {exam._count.examQuestions} questions
                  </span>
                </div>

                {isCompleted && attempt ? (
                  <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--ui-muted)]">
                      <Trophy className="h-4 w-4 text-[var(--ui-accent)]" />
                      Result
                    </p>
                    {exam.type === "MOCK" ? (
                      <p className="mt-2 font-display text-2xl font-extrabold text-[var(--ui-primary)]">
                        {attempt.score} / {attempt.totalMarks}
                      </p>
                    ) : (
                      <p className="mt-2 text-sm text-[var(--ui-muted)]">
                        Final results hidden until published.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="border-t border-slate-100 p-4">
                {!isCompleted ? (
                  <Link
                    href={`/student/exams/${exam.id}/take`}
                    className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--ui-secondary)] text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    Start Exam
                  </Link>
                ) : (
                  <div className="flex h-11 items-center justify-center rounded-xl bg-slate-50 text-sm font-bold text-[var(--ui-muted)]">
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
