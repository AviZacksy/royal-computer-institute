import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { UploadNoteForm, ToggleNoteButton, DeleteNoteButton } from "@/components/admin/NoteControls";
import { DownloadDocumentButton } from "@/components/shared/DownloadDocumentButton";
import { getNoteUrlAction } from "@/actions/admin/notes";

export const dynamic = "force-dynamic";

// Reuse shared button but wire it to the notes bucket action
function NoteDownloadButton({ storageKey, title }: { storageKey: string; title: string }) {
  return (
    <DownloadDocumentButton
      storageKey={storageKey}
      label="Download"
      filename={`${title}.pdf`}
      getUrl={getNoteUrlAction}
    />
  );
}

export default async function AdminNotesPage(props: { searchParams: Promise<{ courseId?: string }> }) {
  const session = await requireAdminSession();
  if (!session) return null;

  const searchParams = await props.searchParams;
  const courseFilter = searchParams.courseId;

  const courses = await db.course.findMany({
    where: { instituteId: session.instituteId },
    select: { id: true, name: true },
    orderBy: { sortOrder: "asc" },
  });

  const notes = await db.note.findMany({
    where: {
      instituteId: session.instituteId,
      ...(courseFilter ? { courseId: courseFilter } : {}),
    },
    include: { course: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <PanelPage
      title="Notes"
      subtitle="Upload and manage PDF study materials"
      action={
        <Modal triggerText="Upload Note">
          <h2 className="mb-4 text-xl font-bold">Upload Note</h2>
          <UploadNoteForm courses={courses} />
        </Modal>
      }
    >
      {/* Course filter pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href="/admin/notes"
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            !courseFilter
              ? "bg-[var(--ui-primary)] text-white"
              : "bg-[var(--ui-bg-subtle)] text-[var(--ui-text)] hover:bg-[var(--ui-border)]"
          }`}
        >
          All Courses
        </Link>
        {courses.map((c) => (
          <Link
            key={c.id}
            href={`/admin/notes?courseId=${c.id}`}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              courseFilter === c.id
                ? "bg-[var(--ui-primary)] text-white"
                : "bg-[var(--ui-bg-subtle)] text-[var(--ui-text)] hover:bg-[var(--ui-border)]"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Notes table */}
      {notes.length === 0 ? (
        <Card className="p-8 text-center text-sm text-[var(--ui-muted)]">
          No notes found.{" "}
          {courseFilter ? "Try selecting a different course or " : ""}
          Upload your first note to get started.
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--ui-border)] bg-[var(--ui-bg-subtle)]">
                {["Title", "Course", "Description", "Status", "Uploaded", "Actions"].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {notes.map((note) => (
                <tr key={note.id} className="border-b border-[var(--ui-border)] last:border-0 hover:bg-[var(--ui-bg-subtle)] transition-colors">
                  <td className="px-4 py-3 font-medium text-[var(--ui-text)] max-w-[180px]">
                    <span className="block truncate" title={note.title}>
                      📄 {note.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--ui-muted)] whitespace-nowrap">
                    {note.course.name}
                  </td>
                  <td className="px-4 py-3 text-[var(--ui-muted)] max-w-[200px]">
                    <span className="block truncate text-xs" title={note.description ?? ""}>
                      {note.description || <em>No description</em>}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ToggleNoteButton noteId={note.id} isActive={note.isActive} />
                  </td>
                  <td className="px-4 py-3 text-[var(--ui-muted)] whitespace-nowrap text-xs">
                    {note.createdAt.toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <NoteDownloadButton storageKey={note.storageKey} title={note.title} />
                      <DeleteNoteButton noteId={note.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </PanelPage>
  );
}
