import Image from "next/image";
import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoNotice } from "@/components/demo/DemoNotice";
import { VideoStrip } from "@/components/media/VideoStrip";

const PHOTOS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: `Institute Photo ${i + 1}`,
}));

const VIDEOS = [
  {
    title: "Coaching Video (Institute)",
    subtitle: "Short overview video",
    src: "/Video/Coching%20video/video_2026-04-24_17-53-58.mp4",
  },
  {
    title: "Institute Ad Video 1",
    subtitle: "Promo (demo media)",
    src: "/Video/Ads/video_2026-04-24_17-53-41.mp4",
  },
  {
    title: "Institute Ad Video 2",
    subtitle: "Promo (demo media)",
    src: "/Video/Ads/video_2026-04-24_17-53-53.mp4",
  },
];

export default function GalleryPage() {
  return (
    <PageShell title="Gallery" subtitle="Institute photo gallery (demo with real images).">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PHOTOS.map((p) => (
          <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-[4/3] w-full bg-blue-50">
              <Image
                src={`/images/gallery/${p.id}.jpg`}
                alt={p.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/55 via-blue-950/10 to-transparent" />
              <div className="absolute left-3 top-3">
                <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-extrabold text-blue-900 backdrop-blur">
                  RCI Gallery
                </span>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-extrabold text-blue-950">
                {p.title}
              </p>
              <p className="mt-1 text-xs text-blue-900/70">
                Institute activity / lab / class photo (demo)
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-900/70">
              Video Gallery
            </p>
            <p className="mt-2 text-lg font-extrabold text-blue-950 sm:text-xl">
              Institute Videos
            </p>
            <p className="mt-1 text-sm text-blue-900/70">
              Official institute videos and coaching promos (embedded).
            </p>
          </div>
        </div>

        <div className="mt-4">
          <VideoStrip videos={VIDEOS} mobileAspect="video" desktopAspect="reel" />
        </div>
      </div>

      <DemoNotice />
    </PageShell>
  );
}

