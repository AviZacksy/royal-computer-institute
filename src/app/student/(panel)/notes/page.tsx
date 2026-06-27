import { BookOpen, FileText, Library } from "lucide-react";
import { db } from "@/lib/db";
import { requireStudentSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";
import { DownloadDocumentButton } from "@/components/shared/DownloadDocumentButton";
import { getNoteUrlAction } from "@/actions/admin/notes";

export const dynamic = "force-dynamic";

export default async function StudentNotesPage() {
  const session = await requireStudentSession();
  if (!session) return null;

  const profile = await db.studentProfile.findFirst({
    where: { userId: session.userId, status: "APPROVED" },
    include: { course: true },
  });

  if (!profile) {
    return (
      <PanelPage title="Study Notes" subtitle="PDF notes for your course">
        <Card className="p-8 text-center text-sm text-[var(--ui-muted)]">
          Your profile is pending approval. Notes will be available once your account is approved.
        </Card>
      </PanelPage>
    );
  }

  if (!profile.courseId) {
    return (
      <PanelPage title="Study Notes" subtitle="PDF notes for your course">
        <Card className="p-8 text-center text-sm text-[var(--ui-muted)]">
          You are not assigned to a course yet. Please contact your admin.
        </Card>
      </PanelPage>
    );
  }

  const notes = await db.note.findMany({
    where: {
      courseId: profile.courseId,
      instituteId: profile.instituteId,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PanelPage
      title="Study Notes"
      subtitle={`PDF notes for ${profile.course?.name ?? "your course"}`}
    >
      {notes.length === 0 ? (
        <Card className="p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[var(--ui-secondary)]">
            <Library className="h-7 w-7" />
          </div>
          <p className="mt-4 font-semibold text-[var(--ui-primary)]">No notes available yet</p>
          <p className="mt-1 text-sm text-[var(--ui-muted)]">
            Your instructor hasn&apos;t uploaded any notes for your course yet. Check back later.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="flex flex-col gap-4 p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
              <div className="flex items-start gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-[var(--ui-secondary)]">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold leading-tight text-[var(--ui-primary)]">
                    {note.title}
                  </p>
                  <p className="mt-1 text-xs font-medium text-[var(--ui-muted)]">
                    {note.createdAt.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {note.description ? (
                <p className="line-clamp-2 text-sm leading-6 text-[var(--ui-muted)]">
                  {note.description}
                </p>
              ) : null}

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--ui-muted)]">
                  <BookOpen className="h-3.5 w-3.5" />
                  Course material
                </span>
                <DownloadDocumentButton
                  storageKey={note.storageKey}
                  label="Download PDF"
                  filename={`${note.title}.pdf`}
                  getUrl={getNoteUrlAction}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </PanelPage>
  );
}
