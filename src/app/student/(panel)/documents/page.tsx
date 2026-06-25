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
      {/* ─── Admit Cards ─────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-[var(--ui-text)] mb-3">🪪 Admit Cards</h2>
        {admitCards.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--ui-muted)]">
            No admit cards issued yet. Your admin will generate them before your exam.
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {admitCards.map((ac) => (
              <Card key={ac.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--ui-text)]">{ac.exam.title}</p>
                  <p className="text-xs text-[var(--ui-muted)] mt-0.5">
                    Issued: {ac.generatedAt.toLocaleDateString("en-IN")}
                  </p>
                </div>
                <DownloadDocumentButton
                  storageKey={ac.storageKey}
                  label="⬇ Download"
                  filename={`admit-card-${ac.exam.title}.pdf`}
                />
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ─── Certificates ────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-[var(--ui-text)] mb-3">🎓 Certificates</h2>
        {certificates.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--ui-muted)]">
            No certificates issued yet. Complete your course to receive one.
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {certificates.map((c) => (
              <Card key={c.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--ui-text)]">{c.course.name}</p>
                  <p className="text-xs text-[var(--ui-muted)] mt-0.5">
                    Cert No: {c.certificateNumber} · {c.generatedAt.toLocaleDateString("en-IN")}
                  </p>
                </div>
                <DownloadDocumentButton
                  storageKey={c.storageKey}
                  label="⬇ Download"
                  filename={`certificate-${c.course.name}.pdf`}
                />
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* ─── Marksheets ──────────────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-[var(--ui-text)] mb-3">📋 Marksheets</h2>
        {marksheets.length === 0 ? (
          <Card className="p-6 text-center text-sm text-[var(--ui-muted)]">
            No marksheets issued yet. Your admin will publish them after your final exam.
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {marksheets.map((m) => (
              <Card key={m.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-[var(--ui-text)]">{m.exam.title}</p>
                  <p className="text-xs text-[var(--ui-muted)] mt-0.5">
                    Score: {m.obtainedMarks}/{m.totalMarks}
                    {m.grade ? ` · Grade: ${m.grade}` : ""} 
                    {" · "}{m.generatedAt.toLocaleDateString("en-IN")}
                  </p>
                </div>
                <DownloadDocumentButton
                  storageKey={m.storageKey}
                  label="⬇ Download"
                  filename={`marksheet-${m.exam.title}.pdf`}
                />
              </Card>
            ))}
          </div>
        )}
      </section>
    </PanelPage>
  );
}
