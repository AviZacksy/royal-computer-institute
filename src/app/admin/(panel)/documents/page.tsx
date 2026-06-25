import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { AdmitCardForm } from "@/components/admin/AdmitCardForm";
import { CertificateForm } from "@/components/admin/CertificateForm";
import { MarksheetForm } from "@/components/admin/MarksheetForm";
import { DownloadDocumentButton } from "@/components/shared/DownloadDocumentButton";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  const { instituteId } = session;

  const [students, exams, finalAttempts, admitCards, certificates, marksheets] = await Promise.all([
    db.studentProfile.findMany({
      where: { instituteId, status: "APPROVED" },
      select: { id: true, name: true, enrollmentNumber: true, course: { select: { name: true } } },
      orderBy: { name: "asc" },
    }),
    db.exam.findMany({
      where: { instituteId },
      select: { id: true, title: true, type: true },
      orderBy: { createdAt: "desc" },
    }),
    db.examAttempt.findMany({
      where: { exam: { instituteId, type: "FINAL" }, submittedAt: { not: null } },
      include: { student: true, exam: true },
      orderBy: { submittedAt: "desc" },
    }),
    db.admitCard.findMany({
      where: { instituteId },
      include: { student: true, exam: true },
      orderBy: { generatedAt: "desc" },
    }),
    db.certificate.findMany({
      where: { instituteId },
      include: { student: true, course: true },
      orderBy: { generatedAt: "desc" },
    }),
    db.marksheet.findMany({
      where: { instituteId },
      include: { student: true, exam: true },
      orderBy: { generatedAt: "desc" },
    }),
  ]);

  // Prepare data for forms
  const studentsForForm = students.map((s) => ({
    id: s.id,
    name: s.name,
    enrollmentNumber: s.enrollmentNumber,
    courseName: s.course?.name ?? "No Course",
  }));

  const attemptsForForm = finalAttempts.map((a) => ({
    id: a.id,
    studentName: a.student.name,
    examTitle: a.exam.title,
    score: a.score,
    totalMarks: a.totalMarks,
  }));

  return (
    <PanelPage title="Documents" subtitle="Admit Cards, Certificates, and Marksheets">
      {/* ─── Generate buttons ─────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🪪</span>
            <div>
              <h3 className="font-bold text-[var(--ui-text)]">Admit Cards</h3>
              <p className="text-xs text-[var(--ui-muted)]">{admitCards.length} generated</p>
            </div>
          </div>
          <Modal triggerText="Generate Admit Card" triggerVariant="primary">
            <h2 className="mb-4 text-xl font-bold">Generate Admit Card</h2>
            <AdmitCardForm students={studentsForForm} exams={exams} />
          </Modal>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <div>
              <h3 className="font-bold text-[var(--ui-text)]">Certificates</h3>
              <p className="text-xs text-[var(--ui-muted)]">{certificates.length} generated</p>
            </div>
          </div>
          <Modal triggerText="Generate Certificate" triggerVariant="primary">
            <h2 className="mb-4 text-xl font-bold">Generate Certificate</h2>
            <CertificateForm students={studentsForForm} />
          </Modal>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h3 className="font-bold text-[var(--ui-text)]">Marksheets</h3>
              <p className="text-xs text-[var(--ui-muted)]">{marksheets.length} generated</p>
            </div>
          </div>
          <Modal triggerText="Generate Marksheet" triggerVariant="primary">
            <h2 className="mb-4 text-xl font-bold">Generate Marksheet</h2>
            <MarksheetForm attempts={attemptsForForm} />
          </Modal>
        </Card>
      </div>

      {/* ─── Admit Cards list ─────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-[var(--ui-text)] mb-3">🪪 Admit Cards</h2>
        {admitCards.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--ui-muted)]">No admit cards generated yet.</Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--ui-border)] bg-[var(--ui-bg-subtle)]">
                  {["Student", "Enrollment", "Exam", "Generated", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {admitCards.map((ac) => (
                  <tr key={ac.id} className="border-b border-[var(--ui-border)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--ui-text)]">{ac.student.name}</td>
                    <td className="px-4 py-3 text-[var(--ui-muted)]">{ac.student.enrollmentNumber ?? "-"}</td>
                    <td className="px-4 py-3 text-[var(--ui-text)]">{ac.exam.title}</td>
                    <td className="px-4 py-3 text-[var(--ui-muted)]">{ac.generatedAt.toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <DownloadDocumentButton storageKey={ac.storageKey} label="Download" filename={`admit-card-${ac.student.name}.pdf`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>

      {/* ─── Certificates list ────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-[var(--ui-text)] mb-3">🎓 Certificates</h2>
        {certificates.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--ui-muted)]">No certificates generated yet.</Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--ui-border)] bg-[var(--ui-bg-subtle)]">
                  {["Student", "Course", "Cert No.", "Generated", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {certificates.map((c) => (
                  <tr key={c.id} className="border-b border-[var(--ui-border)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--ui-text)]">{c.student.name}</td>
                    <td className="px-4 py-3 text-[var(--ui-text)]">{c.course.name}</td>
                    <td className="px-4 py-3 text-[var(--ui-muted)] font-mono text-xs">{c.certificateNumber}</td>
                    <td className="px-4 py-3 text-[var(--ui-muted)]">{c.generatedAt.toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <DownloadDocumentButton storageKey={c.storageKey} label="Download" filename={`certificate-${c.student.name}.pdf`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>

      {/* ─── Marksheets list ──────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-[var(--ui-text)] mb-3">📋 Marksheets</h2>
        {marksheets.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--ui-muted)]">No marksheets generated yet.</Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--ui-border)] bg-[var(--ui-bg-subtle)]">
                  {["Student", "Exam", "Score", "Grade", "Generated", "Action"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {marksheets.map((m) => (
                  <tr key={m.id} className="border-b border-[var(--ui-border)] last:border-0">
                    <td className="px-4 py-3 font-medium text-[var(--ui-text)]">{m.student.name}</td>
                    <td className="px-4 py-3 text-[var(--ui-text)]">{m.exam.title}</td>
                    <td className="px-4 py-3 text-[var(--ui-text)]">{m.obtainedMarks}/{m.totalMarks}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.grade === "F" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {m.grade ?? "N/A"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--ui-muted)]">{m.generatedAt.toLocaleDateString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <DownloadDocumentButton storageKey={m.storageKey} label="Download" filename={`marksheet-${m.student.name}.pdf`} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>
    </PanelPage>
  );
}
