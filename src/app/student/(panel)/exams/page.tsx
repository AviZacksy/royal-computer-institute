import Link from "next/link";
import type { ExamAttempt, Exam, MockTopic, ExamRegistration } from "@prisma/client";
import { BookOpenCheck, Clock3, FileQuestion, Trophy } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";
import { getMockTopicLabel } from "@/config/exam-topics";

type StudentExam = Exam & {
  _count: { examQuestions: number };
};

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

  const registrations = await db.examRegistration.findMany({
    where: { studentId: profile.id },
  });

  const mockExams = exams.filter((exam) => exam.type === "MOCK");
  const finalExams = exams.filter((exam) => exam.type === "FINAL");

  return (
    <PanelPage title="My Exams" subtitle="View assigned mock tests, final exams, and submitted results">
      {exams.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-50 text-[var(--ui-secondary)]">
            <FileQuestion className="h-7 w-7" />
          </div>
          <p className="font-semibold text-[var(--ui-primary)]">No active exams</p>
          <p className="mt-1 text-sm text-[var(--ui-muted)]">
            Your institute has not published an active exam for your course yet.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          <ExamSection
            title="Free Mock Tests"
            subtitle="Practice topic-wise tests before your final exam."
            exams={mockExams}
            attempts={attempts}
            registrations={registrations}
            empty="No mock tests are active right now."
          />
          <ExamSection
            title="Final Exams"
            subtitle="Attempt your assigned final exam. Registration and exam fee payment required."
            exams={finalExams}
            attempts={attempts}
            registrations={registrations}
            empty="No final exam is active for your course right now."
          />
        </div>
      )}
    </PanelPage>
  );
}

function ExamSection({
  title,
  subtitle,
  exams,
  attempts,
  registrations,
  empty,
}: {
  title: string;
  subtitle: string;
  exams: StudentExam[];
  attempts: ExamAttempt[];
  registrations: ExamRegistration[];
  empty: string;
}) {
  return (
    <section>
      <div className="mb-4">
        <h2 className="font-display text-xl font-extrabold text-[var(--ui-primary)]">{title}</h2>
        <p className="text-sm text-[var(--ui-muted)]">{subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {exams.length === 0 ? (
          <Card className="col-span-full p-8 text-center text-sm text-[var(--ui-muted)]">{empty}</Card>
        ) : null}
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            attempt={attempts.find((attempt) => attempt.examId === exam.id)}
            registration={registrations.find((r) => r.examId === exam.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ExamCard({ exam, attempt, registration }: { exam: StudentExam; attempt?: ExamAttempt; registration?: ExamRegistration }) {
  const isCompleted = Boolean(attempt?.submittedAt);
  const label = exam.type === "MOCK" ? getMockTopicLabel(exam.topic as MockTopic | null) : "Final Exam";
  
  const requiresRegistration = exam.type === "FINAL";
  const isRegistered = Boolean(registration?.isAccessEnabled);
  const registrationPending = Boolean(registration && !registration.isAccessEnabled);

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
        <span className={`rounded-full border px-3 py-1 text-xs font-extrabold ${
          exam.type === "FINAL"
            ? "border-amber-200 bg-amber-50 text-amber-800"
            : "border-blue-200 bg-blue-50 text-blue-700"
        }`}>
          {label}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
          isCompleted ? "bg-emerald-50 text-emerald-700" : (requiresRegistration && !isRegistered ? "bg-red-50 text-red-600" : "bg-slate-100 text-slate-600")
        }`}>
          {isCompleted ? "Completed" : (requiresRegistration && !isRegistered ? (registrationPending ? "Verification Pending" : "Registration Required") : "Ready")}
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
            {exam._count.examQuestions}{exam.type === "FINAL" ? "/60" : ""} questions
          </span>
        </div>

        {isCompleted && attempt ? (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[var(--ui-muted)]">
              <Trophy className="h-4 w-4 text-[var(--ui-accent)]" />
              Result
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold text-[var(--ui-primary)]">
              {attempt.score} / {attempt.totalMarks}
            </p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-slate-100 p-4">
        {isCompleted ? (
          <div className="flex h-11 items-center justify-center rounded-xl bg-slate-50 text-sm font-bold text-[var(--ui-muted)]">
            Exam Submitted
          </div>
        ) : requiresRegistration && !isRegistered ? (
          registrationPending ? (
            <div className="flex h-11 w-full items-center justify-center rounded-xl bg-amber-50 text-sm font-bold text-amber-700 border border-amber-200">
              Payment Under Review
            </div>
          ) : (
            <Link
              href={`/student/exams/${exam.id}/register`}
              className="flex h-11 w-full items-center justify-center rounded-xl border-2 border-[var(--ui-primary)] bg-transparent text-sm font-bold text-[var(--ui-primary)] transition hover:bg-[var(--ui-primary)] hover:text-white"
            >
              Pay Fee & Register
            </Link>
          )
        ) : (
          <Link
            href={`/student/exams/${exam.id}/take`}
            className="flex h-11 w-full items-center justify-center rounded-xl bg-[var(--ui-secondary)] text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            Start Exam
          </Link>
        )}
      </div>
    </Card>
  );
}
