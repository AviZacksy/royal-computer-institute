import Image from "next/image";
import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { VideoStrip } from "@/components/media/VideoStrip";
import {
  getPublicGalleryItems,
  resolveGalleryMediaUrl,
  STATIC_GALLERY_PHOTOS,
  STATIC_GALLERY_VIDEOS,
} from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const dbItems = await getPublicGalleryItems();
  const useFallback = dbItems.length === 0;

  const items = useFallback
    ? null
    : await Promise.all(
        dbItems.map(async (item) => ({
          id: item.id,
          title: item.title,
          category: item.category,
          mediaType: item.mediaType,
          src: await resolveGalleryMediaUrl(item),
        })),
      );

  const dbVideos = items?.filter((i) => i.mediaType === "VIDEO" && i.src) ?? [];
  const dbImages = items?.filter((i) => i.mediaType === "IMAGE" && i.src) ?? [];

  return (
    <PageShell title="Gallery" subtitle="Institute photo and video gallery.">
      {useFallback ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATIC_GALLERY_PHOTOS.map((p) => (
              <Card key={p.id} className="overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-[4/3] w-full bg-section">
                  <Image
                    src={p.src}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-extrabold text-royal">{p.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-10">
            <VideoStrip videos={STATIC_GALLERY_VIDEOS} mobileAspect="video" desktopAspect="reel" />
          </div>
        </>
      ) : (
        <>
          {dbImages.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {dbImages.map((p) => (
                <Card key={p.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <div className="relative aspect-[4/3] w-full bg-section">
                    <Image
                      src={p.src!}
                      alt={p.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      unoptimized={p.src!.startsWith("/api/")}
                    />
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-extrabold text-royal backdrop-blur">
                        {p.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-extrabold text-royal">{p.title}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : null}

          {dbVideos.length > 0 ? (
            <div className={dbImages.length > 0 ? "mt-10" : ""}>
              <p className="text-xs font-extrabold uppercase tracking-widest text-muted">Videos</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {dbVideos.map((v) => (
                  <Card key={v.id} className="overflow-hidden">
                    <video
                      src={v.src!}
                      controls
                      className="aspect-video w-full bg-black object-contain"
                      preload="metadata"
                    />
                    <CardContent className="p-4">
                      <p className="text-sm font-extrabold text-royal">{v.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : null}

          {dbImages.length === 0 && dbVideos.length === 0 ? (
            <p className="text-sm text-[var(--ui-muted)]">No gallery items available.</p>
          ) : null}
        </>
      )}
    </PageShell>
  );
}
