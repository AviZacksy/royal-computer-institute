import { Card, CardContent } from "@/components/ui/Card";

export type VideoItem = {
  title: string;
  subtitle?: string;
  src: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function VideoStrip({
  videos,
  mobileAspect = "video",
  desktopAspect = "reel",
}: {
  videos: VideoItem[];
  mobileAspect?: "video" | "reel";
  desktopAspect?: "video" | "reel";
}) {
  const mobileAspectClass = mobileAspect === "video" ? "aspect-video" : "aspect-[9/16]";
  const desktopAspectClass = desktopAspect === "video" ? "sm:aspect-video" : "sm:aspect-[9/16]";

  return (
    <div>
      <div className="sm:hidden -mx-4 px-4 overflow-x-auto">
        <div className="flex gap-4 snap-x snap-mandatory pb-2">
          {videos.map((v) => (
            <div key={v.src} className="snap-start w-[78vw] max-w-[360px] flex-none">
              <Card className="group overflow-hidden">
                <div
                  className={cx(
                    `relative ${mobileAspectClass} w-full`,
                    "bg-[var(--ui-surface)]",
                  )}
                >
                  <video
                    src={v.src}
                    className="absolute inset-0 h-full w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
                  <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[var(--ui-primary)] shadow-sm">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--ui-surface)] text-[12px]">
                      ▶
                    </span>
                    Video
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-extrabold text-[var(--ui-text)] leading-snug">
                    {v.title}
                  </p>
                  {v.subtitle ? (
                    <p className="mt-1 text-xs text-[var(--ui-muted)] leading-5">
                      {v.subtitle}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <Card key={v.src} className="group overflow-hidden">
            <div
              className={cx(
                `relative aspect-video ${desktopAspectClass} w-full`,
                "bg-[var(--ui-surface)]",
              )}
            >
              <video
                src={v.src}
                className="absolute inset-0 h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />
              <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[var(--ui-primary)] shadow-sm">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--ui-surface)] text-[12px]">
                  ▶
                </span>
                Video
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-extrabold text-[var(--ui-text)] leading-snug">
                {v.title}
              </p>
              {v.subtitle ? (
                <p className="mt-1 text-xs text-[var(--ui-muted)] leading-5">
                  {v.subtitle}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

