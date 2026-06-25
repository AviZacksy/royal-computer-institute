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

  // Fetch the student's profile to find their assigned course
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
        <Card className="p-10 text-center space-y-2">
          <p className="text-3xl">📭</p>
          <p className="font-semibold text-[var(--ui-text)]">No notes available yet</p>
          <p className="text-sm text-[var(--ui-muted)]">
            Your instructor hasn&apos;t uploaded any notes for your course yet. Check back later.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id} className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
              {/* Icon + title */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-xl">
                  📄
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--ui-text)] leading-tight break-words">
                    {note.title}
                  </p>
                  <p className="text-xs text-[var(--ui-muted)] mt-0.5">
                    {note.createdAt.toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Description */}
              {note.description && (
                <p className="text-sm text-[var(--ui-muted)] leading-relaxed line-clamp-2">
                  {note.description}
                </p>
              )}

              {/* Download button */}
              <div className="pt-1">
                <DownloadDocumentButton
                  storageKey={note.storageKey}
                  label="⬇ Download PDF"
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
