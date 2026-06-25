import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage, DataTable } from "@/components/panels/PanelPage";

export default async function AdminExamAttemptsPage(props: { params: Promise<{ examId: string }> }) {
  const session = await requireAdminSession();
  if (!session) return null;
  const params = await props.params;

  const exam = await db.exam.findFirst({
    where: { id: params.examId, instituteId: session.instituteId },
    include: { course: true },
  });

  if (!exam) return notFound();

  const attempts = await db.examAttempt.findMany({
    where: { examId: exam.id },
    include: { student: true },
    orderBy: { submittedAt: "desc" },
  });

  const tableData = attempts.map((a) => ({
    Student: a.student.name,
    "Enrollment No": a.student.enrollmentNumber || "—",
    Score: `${a.score} / ${a.totalMarks}`,
    Started: a.startedAt.toLocaleString("en-IN"),
    Submitted: a.submittedAt?.toLocaleString("en-IN") || "In Progress",
    Answers: a.submittedAt ? (
      <a 
        href={`/admin/exams/${exam.id}/attempts/${a.id}`} 
        className="text-[var(--ui-primary)] hover:underline"
      >
        View Answers
      </a>
    ) : "—",
  }));

  return (
    <PanelPage
      title={`Attempts: ${exam.title}`}
      subtitle={`${attempts.length} student attempt(s) for this exam.`}
      backLink={{ href: `/admin/exams/${exam.id}`, label: "Back to Exam" }}
    >
      <DataTable headers={["Student", "Enrollment No", "Score", "Started", "Submitted", "Answers"]} rows={tableData.map(Object.values)} />
    </PanelPage>
  );
}
