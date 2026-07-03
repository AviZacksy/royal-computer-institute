import { Award, BadgeCheck, ClipboardList, FileBadge, IdCard } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { AdmitCardForm } from "@/components/admin/AdmitCardForm";
import { CertificateForm } from "@/components/admin/CertificateForm";
import { MarksheetForm } from "@/components/admin/MarksheetForm";
import { StudentIdCardForm } from "@/components/admin/StudentIdCardForm";

export const dynamic = "force-dynamic";

export default async function AdminDocumentsPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  const { instituteId } = session;

  const [students, exams, finalAttempts, idCards, admitCards, certificates, marksheets] = await Promise.all([
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
    db.studentIdCard.findMany({
      where: { instituteId },
      include: { student: { include: { course: true } } },
      orderBy: { generatedAt: "desc" },
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

  const studentsForForm = students.map((student) => ({
    id: student.id,
    name: student.name,
    enrollmentNumber: student.enrollmentNumber,
    courseName: student.course?.name ?? "No Course",
  }));

  const attemptsForForm = finalAttempts.map((attempt) => ({
    id: attempt.id,
    studentName: attempt.student.name,
    examTitle: attempt.exam.title,
    score: attempt.score,
    totalMarks: attempt.totalMarks,
  }));

  return (
    <PanelPage title="Documents" subtitle="Auto-generate student ID cards, certificates, and final exam marksheets">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <GeneratorCard title="Student ID Cards" count={idCards.length} icon={<IdCard className="h-5 w-5" />}>
          <Modal triggerText="Generate ID Card" triggerVariant="primary">
            <h2 className="mb-4 text-xl font-bold">Generate Student ID Card</h2>
            <StudentIdCardForm students={studentsForForm} />
          </Modal>
        </GeneratorCard>

        <GeneratorCard title="Certificates" count={certificates.length} icon={<Award className="h-5 w-5" />}>
          <Modal triggerText="Generate Certificate" triggerVariant="primary">
            <h2 className="mb-4 text-xl font-bold">Generate Certificate</h2>
            <CertificateForm students={studentsForForm} />
          </Modal>
        </GeneratorCard>

        <GeneratorCard title="Marksheets" count={marksheets.length} icon={<ClipboardList className="h-5 w-5" />}>
          <Modal triggerText="Generate Marksheet" triggerVariant="primary">
            <h2 className="mb-4 text-xl font-bold">Generate Marksheet</h2>
            <MarksheetForm attempts={attemptsForForm} />
          </Modal>
        </GeneratorCard>

        <GeneratorCard title="Admit Cards" count={admitCards.length} icon={<FileBadge className="h-5 w-5" />}>
          <Modal triggerText="Generate Admit Card" triggerVariant="outline">
            <h2 className="mb-4 text-xl font-bold">Generate Admit Card</h2>
            <AdmitCardForm students={studentsForForm} exams={exams} />
          </Modal>
        </GeneratorCard>
      </div>

      <DocumentSection title="Student ID Cards" icon={<IdCard className="h-5 w-5" />} empty="No student ID cards generated yet.">
        {idCards.map((card) => (
          <DocumentRow
            key={card.id}
            title={card.student.name}
            meta={`${card.student.enrollmentNumber ?? "-"} | ${card.student.course?.name ?? "No Course"} | ${card.batchTime ?? "Regular Batch"}`}
            generatedAt={card.generatedAt}
          >
            <a href={`/documents/id-card/${card.student.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition">
              View / Print
            </a>
          </DocumentRow>
        ))}
      </DocumentSection>

      <DocumentSection title="Certificates" icon={<Award className="h-5 w-5" />} empty="No certificates generated yet.">
        {certificates.map((certificate) => (
          <DocumentRow
            key={certificate.id}
            title={certificate.student.name}
            meta={`${certificate.course.name} | Cert No: ${certificate.certificateNumber}`}
            generatedAt={certificate.generatedAt}
          >
            <a href={`/documents/certificate/${certificate.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition">
              View / Print
            </a>
          </DocumentRow>
        ))}
      </DocumentSection>

      <DocumentSection title="Marksheets" icon={<ClipboardList className="h-5 w-5" />} empty="No marksheets generated yet.">
        {marksheets.map((marksheet) => (
          <DocumentRow
            key={marksheet.id}
            title={marksheet.student.name}
            meta={`${marksheet.exam.title} | Score: ${marksheet.obtainedMarks}/${marksheet.totalMarks}${marksheet.grade ? ` | Grade: ${marksheet.grade}` : ""}`}
            generatedAt={marksheet.generatedAt}
          >
            <a href={`/documents/marksheet/${marksheet.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition">
              View / Print
            </a>
          </DocumentRow>
        ))}
      </DocumentSection>

      <DocumentSection title="Admit Cards" icon={<FileBadge className="h-5 w-5" />} empty="No admit cards generated yet.">
        {admitCards.map((admitCard) => (
          <DocumentRow
            key={admitCard.id}
            title={admitCard.student.name}
            meta={`${admitCard.student.enrollmentNumber ?? "-"} | ${admitCard.exam.title}`}
            generatedAt={admitCard.generatedAt}
          >
            <a href={`/documents/admit-card/${admitCard.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition">
              View / Print
            </a>
          </DocumentRow>
        ))}
      </DocumentSection>
    </PanelPage>
  );
}

function GeneratorCard({
  title,
  count,
  icon,
  children,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-[var(--ui-secondary)]">{icon}</span>
        <div>
          <h3 className="font-bold text-[var(--ui-text)]">{title}</h3>
          <p className="text-xs text-[var(--ui-muted)]">{count} generated</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

function DocumentSection({
  title,
  icon,
  empty,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  empty: string;
  children: React.ReactNode[];
}) {
  return (
    <section className="space-y-3">
      <h2 className="flex items-center gap-2 text-lg font-extrabold text-[var(--ui-primary)]">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[var(--ui-secondary)]">{icon}</span>
        {title}
      </h2>
      {children.length === 0 ? (
        <Card className="p-8 text-center">
          <BadgeCheck className="mx-auto h-8 w-8 text-[var(--ui-secondary)]" />
          <p className="mt-3 text-sm text-[var(--ui-muted)]">{empty}</p>
        </Card>
      ) : (
        <div className="grid gap-3">{children}</div>
      )}
    </section>
  );
}

function DocumentRow({
  title,
  meta,
  generatedAt,
  children,
}: {
  title: string;
  meta: string;
  generatedAt: Date;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-extrabold text-[var(--ui-primary)]">{title}</p>
        <p className="mt-1 text-xs font-medium text-[var(--ui-muted)]">{meta}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-xs font-medium text-[var(--ui-muted)]">{generatedAt.toLocaleDateString("en-IN")}</span>
        {children}
      </div>
    </Card>
  );
}
