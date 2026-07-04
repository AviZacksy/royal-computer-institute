import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { SubmitExamPaymentForm } from "@/components/student/SubmitExamPaymentForm";

export default async function ExamRegisterPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const session = await requireStudentSession();
  if (!session) return null;
  const { examId } = await params;
  if (!session.studentId) return notFound();

  const exam = await db.exam.findFirst({
    where: { id: examId, instituteId: session.instituteId, isActive: true },
  });

  if (!exam || exam.type !== "FINAL") {
    return notFound();
  }

  const registration = await db.examRegistration.findUnique({
    where: { studentId_examId: { studentId: session.studentId, examId } },
  });
  const paymentSubmission = registration?.paymentSubmissionId
    ? await db.paymentSubmission.findUnique({ where: { id: registration.paymentSubmissionId } })
    : null;

  if (registration?.isAccessEnabled) {
    redirect(`/student/exams/${examId}/take`);
  }

  return (
    <PanelPage title="Exam Registration" subtitle={`Register and pay fee for ${exam.title}`}>
      <div className="mx-auto max-w-lg">
        {paymentSubmission?.status === "PENDING" ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-800">
            <h3 className="mb-2 font-bold">Payment Under Review</h3>
            <p className="text-sm">
              Your exam fee payment is currently being reviewed by the administration. You will be able to take the exam once it is verified.
            </p>
          </div>
        ) : (
          <SubmitExamPaymentForm examId={examId} examTitle={exam.title} feeAmount={500} />
        )}
      </div>
    </PanelPage>
  );
}
