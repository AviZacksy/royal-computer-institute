import Image from "next/image";
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

  const photos = useFallback ? STATIC_GALLERY_PHOTOS : dbImages;
  const videos = useFallback
    ? (STATIC_GALLERY_VIDEOS as { src: string; title: string }[])
    : dbVideos.map((v) => ({ src: v.src!, title: v.title }));

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-[#0A1128] py-12 sm:py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--ui-secondary)]/20 rounded-full blur-[120px] -mt-[300px] -mr-[300px]" />
        
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 relative z-10 text-center">
          <span className="text-sm font-extrabold text-[var(--ui-accent)] tracking-[0.25em] uppercase mb-5 block">
            Campus Life
          </span>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Our Gallery
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
            A glimpse into our labs, classrooms, events, and student achievements.
          </p>
        </div>
      </section>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <section className="bg-white py-12 sm:py-28">
          <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
            <h2 className="font-display text-3xl font-extrabold text-[var(--ui-primary)] mb-12">
              Photos
            </h2>
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
              {(photos as { id: string | number; src: string; title: string; category?: string }[]).map((p, i) => (
                <div
                  key={p.id ?? i}
                  className={`relative overflow-hidden rounded-[1.5rem] group cursor-pointer ${
                    i === 0 ? "col-span-2 row-span-2" : ""
                  }`}
                >
                  <div className="relative w-full h-full min-h-[200px]" style={{ aspectRatio: i === 0 ? "1/1" : "4/3" }}>
                    <Image
                      src={p.src}
                      alt={p.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes={i === 0 ? "(max-width: 1024px) 50vw, 33vw" : "(max-width: 1024px) 50vw, 25vw"}
                      unoptimized={typeof p.src === "string" && p.src.startsWith("/api/")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm font-bold text-white">{p.title}</p>
                      {p.category && (
                        <span className="mt-1 inline-block rounded-full bg-white/20 px-3 py-0.5 text-xs font-bold text-white/90 backdrop-blur-sm">
                          {p.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Video Section */}
      {videos.length > 0 && (
        <section className="bg-[var(--ui-surface)] py-12 sm:py-28 border-t border-[var(--ui-border)]">
          <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
            <h2 className="font-display text-3xl font-extrabold text-[var(--ui-primary)] mb-12">
              Videos
            </h2>
            <VideoStrip
              videos={videos as Parameters<typeof VideoStrip>[0]["videos"]}
              mobileAspect="video"
              desktopAspect="reel"
            />
          </div>
        </section>
      )}

      {/* Empty state */}
      {photos.length === 0 && videos.length === 0 && (
        <section className="bg-white py-32">
          <div className="mx-auto max-w-screen-xl px-4 lg:px-8 text-center">
            <span className="text-6xl block mb-6">📷</span>
            <h2 className="font-display text-3xl font-extrabold text-[var(--ui-primary)] mb-4">Gallery Coming Soon</h2>
            <p className="text-lg text-[var(--ui-muted)] max-w-md mx-auto">Photos and videos of our institute will be added here soon.</p>
          </div>
        </section>
      )}
    </div>
  );
}
