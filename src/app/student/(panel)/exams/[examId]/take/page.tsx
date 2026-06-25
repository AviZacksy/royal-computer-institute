import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import { ExamTestingUI } from "@/components/student/ExamTestingUI";

export default async function TakeExamPage(props: { params: Promise<{ examId: string }> }) {
  const session = await requireStudentSession();
  if (!session) return null;
  const params = await props.params;

  const profile = await db.studentProfile.findFirst({
    where: { userId: session.userId },
  });

  if (!profile || !profile.courseId) {
    redirect("/student/exams");
  }

  const exam = await db.exam.findFirst({
    where: {
      id: params.examId,
      instituteId: session.instituteId,
      courseId: profile.courseId,
      isActive: true,
    },
    include: {
      examQuestions: {
        include: { question: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!exam) return notFound();

  // Check if already attempted
  const attempt = await db.examAttempt.findFirst({
    where: { examId: exam.id, studentId: profile.id },
  });

  if (attempt && attempt.submittedAt) {
    redirect("/student/exams");
  }

  const questions = exam.examQuestions.map((eq) => ({
    id: eq.question.id,
    questionText: eq.question.questionText,
    optionA: eq.question.optionA,
    optionB: eq.question.optionB,
    optionC: eq.question.optionC,
    optionD: eq.question.optionD,
    marks: eq.question.marks,
  }));

  // Render without the panel shell to prevent navigation away
  return (
    <ExamTestingUI
      examId={exam.id}
      title={exam.title}
      durationMinutes={exam.durationMinutes}
      questions={questions}
    />
  );
}
