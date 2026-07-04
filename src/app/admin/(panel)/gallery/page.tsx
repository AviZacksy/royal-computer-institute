import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { ActiveBadge } from "@/components/admin/StatusBadge";
import { GalleryItemForm } from "@/components/admin/GalleryItemForm";
import { DeleteGalleryButton } from "@/components/admin/DeleteGalleryButton";
import { ToggleGalleryButton } from "@/components/admin/ToggleGalleryButton";
import { resolveGalleryMediaUrl } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const session = await requireAdminSession();
  if (!session) return null;

  const { edit } = await searchParams;

  const items = await db.galleryItem.findMany({
    where: { instituteId: session.instituteId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  let editItem = null;
  if (edit) {
    editItem = items.find((i) => i.id === edit);
    if (!editItem) notFound();
  }

  const previews = await Promise.all(
    items.map(async (item) => ({
      id: item.id,
      preview: item.mediaType === "IMAGE" ? await resolveGalleryMediaUrl(item) : null,
    })),
  );
  const previewMap = Object.fromEntries(previews.map((p) => [p.id, p.preview]));

  return (
    <PanelPage title="Gallery Management" subtitle="Manage public gallery images and videos">
      <GalleryItemForm
        initial={
          editItem
            ? {
                id: editItem.id,
                title: editItem.title,
                mediaType: editItem.mediaType,
                mediaUrl: editItem.mediaUrl,
                category: editItem.category,
                sortOrder: editItem.sortOrder,
                isActive: editItem.isActive,
              }
            : undefined
        }
      />

      {edit ? (
        <Link href="/admin/gallery" className="text-sm font-semibold text-[var(--ui-primary)] hover:underline">
          Cancel edit
        </Link>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--ui-border)] bg-white">
            <div className="relative aspect-[4/3] bg-[var(--ui-surface)]">
              {item.mediaType === "IMAGE" && previewMap[item.id] ? (
                <Image
                  src={previewMap[item.id]!}
                  alt={item.title}
                  fill
                  className="object-cover"
                  unoptimized={previewMap[item.id]!.startsWith("/api/")}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl">
                  {item.mediaType === "VIDEO" ? "🎬" : "🖼️"}
                </div>
              )}
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[var(--ui-primary)]">{item.title}</p>
                  <p className="text-xs text-[var(--ui-muted)]">{item.mediaType} · {item.category}</p>
                </div>
                <ActiveBadge active={item.isActive} />
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/gallery?edit=${item.id}`}
                  className="text-sm font-semibold text-[var(--ui-primary)] hover:underline"
                >
                  Edit
                </Link>
                <ToggleGalleryButton id={item.id} isActive={item.isActive} />
                <DeleteGalleryButton id={item.id} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-[var(--ui-muted)]">
          No gallery items yet. The public page shows static fallback photos until items are added.
        </p>
      ) : null}
    </PanelPage>
  );
}
