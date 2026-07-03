import { Award, ClipboardList, FileBadge, FolderOpen, IdCard } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";

export const dynamic = "force-dynamic";

export default async function StudentDocumentsPage() {
  const session = await requireStudentSession();
  if (!session) return null;

  const profile = await db.studentProfile.findFirst({
    where: { userId: session.userId },
  });

  if (!profile) {
    return (
      <PanelPage title="My Documents" subtitle="Your generated student documents">
        <Card className="p-8 text-center text-sm text-[var(--ui-muted)]">
          Profile not found. Please contact admin.
        </Card>
      </PanelPage>
    );
  }

  const [idCards, admitCards, certificates, marksheets] = await Promise.all([
    db.studentIdCard.findMany({
      where: { studentId: profile.id },
      orderBy: { generatedAt: "desc" },
    }),
    db.admitCard.findMany({
      where: { studentId: profile.id },
      include: { exam: true },
      orderBy: { generatedAt: "desc" },
    }),
    db.certificate.findMany({
      where: { studentId: profile.id },
      include: { course: true },
      orderBy: { generatedAt: "desc" },
    }),
    db.marksheet.findMany({
      where: { studentId: profile.id },
      include: { exam: true },
      orderBy: { generatedAt: "desc" },
    }),
  ]);

  return (
    <PanelPage title="My Documents" subtitle="Download your ID card, certificates, marksheets, and exam documents">
      <DocumentSection
        title="Student ID Cards"
        icon={<IdCard className="h-5 w-5" />}
        empty="No ID card issued yet. Your admin will generate it after approval."
      >
        {idCards.map((card) => (
          <DocumentCard
            key={card.id}
            title="Student ID Card"
            meta={`Batch: ${card.batchTime ?? "Regular Batch"} | Issued: ${card.generatedAt.toLocaleDateString("en-IN")}`}
          >
            <a
              href={`/documents/id-card/${profile.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              View / Print
            </a>
          </DocumentCard>
        ))}
      </DocumentSection>

      <DocumentSection
        title="Certificates"
        icon={<Award className="h-5 w-5" />}
        empty="No certificates issued yet. Complete your course to receive one."
      >
        {certificates.map((certificate) => (
          <DocumentCard
            key={certificate.id}
            title={certificate.course.name}
            meta={`Cert No: ${certificate.certificateNumber} | ${certificate.generatedAt.toLocaleDateString("en-IN")}`}
          >
            <a
              href={`/documents/certificate/${certificate.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              View / Print
            </a>
          </DocumentCard>
        ))}
      </DocumentSection>

      <DocumentSection
        title="Marksheets"
        icon={<ClipboardList className="h-5 w-5" />}
        empty="No marksheets issued yet. Your admin will publish them after your final exam."
      >
        {marksheets.map((marksheet) => (
          <DocumentCard
            key={marksheet.id}
            title={marksheet.exam.title}
            meta={`Score: ${marksheet.obtainedMarks}/${marksheet.totalMarks}${marksheet.grade ? ` | Grade: ${marksheet.grade}` : ""} | ${marksheet.generatedAt.toLocaleDateString("en-IN")}`}
          >
            <a
              href={`/documents/marksheet/${marksheet.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              View / Print
            </a>
          </DocumentCard>
        ))}
      </DocumentSection>

      <DocumentSection
        title="Admit Cards"
        icon={<FileBadge className="h-5 w-5" />}
        empty="No admit cards issued yet. Your admin will generate them before your exam."
      >
        {admitCards.map((admitCard) => (
          <DocumentCard
            key={admitCard.id}
            title={admitCard.exam.title}
            meta={`Issued: ${admitCard.generatedAt.toLocaleDateString("en-IN")}`}
          >
            <a
              href={`/documents/admit-card/${admitCard.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              View / Print
            </a>
          </DocumentCard>
        ))}
      </DocumentSection>
    </PanelPage>
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
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-50 text-[var(--ui-secondary)]">
          {icon}
        </span>
        {title}
      </h2>
      {children.length === 0 ? (
        <Card className="p-8 text-center">
          <FolderOpen className="mx-auto h-8 w-8 text-[var(--ui-secondary)]" />
          <p className="mt-3 text-sm text-[var(--ui-muted)]">{empty}</p>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      )}
    </section>
  );
}

function DocumentCard({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="flex flex-col justify-between gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] sm:flex-row sm:items-center">
      <div className="min-w-0">
        <p className="font-extrabold text-[var(--ui-primary)]">{title}</p>
        <p className="mt-1 text-xs font-medium text-[var(--ui-muted)]">{meta}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </Card>
  );
}
