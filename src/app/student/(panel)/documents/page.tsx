import { Award, ClipboardList, FileBadge, FolderOpen } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";
import { DownloadDocumentButton } from "@/components/shared/DownloadDocumentButton";

export const dynamic = "force-dynamic";

export default async function StudentDocumentsPage() {
  const session = await requireStudentSession();
  if (!session) return null;

  const profile = await db.studentProfile.findFirst({
    where: { userId: session.userId },
  });

  if (!profile) {
    return (
      <PanelPage title="My Documents" subtitle="Your admit cards, certificates, and marksheets">
        <Card className="p-8 text-center text-sm text-[var(--ui-muted)]">
          Profile not found. Please contact admin.
        </Card>
      </PanelPage>
    );
  }

  const [admitCards, certificates, marksheets] = await Promise.all([
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
    <PanelPage title="My Documents" subtitle="Your admit cards, certificates, and marksheets">
      <DocumentSection
        title="Admit Cards"
        icon={<FileBadge className="h-5 w-5" />}
        empty="No admit cards issued yet. Your admin will generate them before your exam."
      >
        {admitCards.map((ac) => (
          <DocumentCard
            key={ac.id}
            title={ac.exam.title}
            meta={`Issued: ${ac.generatedAt.toLocaleDateString("en-IN")}`}
          >
            <DownloadDocumentButton
              storageKey={ac.storageKey}
              label="Download"
              filename={`admit-card-${ac.exam.title}.pdf`}
            />
          </DocumentCard>
        ))}
      </DocumentSection>

      <DocumentSection
        title="Certificates"
        icon={<Award className="h-5 w-5" />}
        empty="No certificates issued yet. Complete your course to receive one."
      >
        {certificates.map((c) => (
          <DocumentCard
            key={c.id}
            title={c.course.name}
            meta={`Cert No: ${c.certificateNumber} | ${c.generatedAt.toLocaleDateString("en-IN")}`}
          >
            <DownloadDocumentButton
              storageKey={c.storageKey}
              label="Download"
              filename={`certificate-${c.course.name}.pdf`}
            />
          </DocumentCard>
        ))}
      </DocumentSection>

      <DocumentSection
        title="Marksheets"
        icon={<ClipboardList className="h-5 w-5" />}
        empty="No marksheets issued yet. Your admin will publish them after your final exam."
      >
        {marksheets.map((m) => (
          <DocumentCard
            key={m.id}
            title={m.exam.title}
            meta={`Score: ${m.obtainedMarks}/${m.totalMarks}${m.grade ? ` | Grade: ${m.grade}` : ""} | ${m.generatedAt.toLocaleDateString("en-IN")}`}
          >
            <DownloadDocumentButton
              storageKey={m.storageKey}
              label="Download"
              filename={`marksheet-${m.exam.title}.pdf`}
            />
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
