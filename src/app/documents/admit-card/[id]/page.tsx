import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/documents/PrintButton";

export default async function AdmitCardDocument({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const admitCard = await db.admitCard.findUnique({
    where: { id },
    include: { student: { include: { course: true } }, exam: true, institute: true },
  });

  if (!admitCard) return notFound();

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white p-12 shadow-lg print:shadow-none print:m-0 print:p-8 relative">
      <div className="no-print absolute top-4 right-4">
        <PrintButton />
      </div>
      
      <div className="border-b-4 border-blue-900 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-black text-blue-950 uppercase tracking-wider">{admitCard.institute.name}</h1>
        <p className="text-sm font-semibold text-gray-600 mt-1 uppercase">Admit Card</p>
      </div>

      <div className="flex justify-between items-start mb-8 text-sm">
        <div>
          <p><span className="font-bold">Exam Title:</span> {admitCard.exam.title}</p>
          <p><span className="font-bold">Date:</span> {admitCard.generatedAt.toLocaleDateString("en-IN")}</p>
        </div>
        <div className="w-24 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 bg-gray-50">
          Photo
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-bold text-blue-900 border-b border-gray-200 mb-3 pb-1">Candidate Details</h2>
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
            <div><span className="text-gray-500 block text-xs">Student Name</span><span className="font-semibold">{admitCard.student.name}</span></div>
            <div><span className="text-gray-500 block text-xs">Enrollment Number</span><span className="font-semibold">{admitCard.student.enrollmentNumber || "-"}</span></div>
            <div><span className="text-gray-500 block text-xs">Course</span><span className="font-semibold">{admitCard.student.course?.name || "-"}</span></div>
            <div><span className="text-gray-500 block text-xs">Batch Time</span><span className="font-semibold">{admitCard.batchTime || "-"}</span></div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-blue-900 border-b border-gray-200 mb-3 pb-1">Exam Guidelines</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
            <li>Please bring this admit card to the examination center.</li>
            <li>Candidates must arrive at least 30 minutes before the exam starts.</li>
            <li>Use of mobile phones or electronic gadgets is strictly prohibited.</li>
            <li>Please bring a valid original Photo ID along with this admit card.</li>
          </ul>
        </section>
      </div>

      <div className="mt-32 flex justify-between px-8 text-sm">
        <div className="text-center">
          <div className="w-40 border-b border-gray-400 mb-2"></div>
          <p className="text-gray-500 font-semibold">Candidate Signature</p>
        </div>
        <div className="text-center">
          <div className="w-40 border-b border-gray-400 mb-2"></div>
          <p className="text-gray-500 font-semibold">Authorized Signature</p>
        </div>
      </div>
    </div>
  );
}
