import { Card, CardContent } from "@/components/ui/Card";

export type VideoItem = {
  title: string;
  subtitle?: string;
  src: string;
};

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
              <Card className="overflow-hidden">
                <div className={`relative ${mobileAspectClass} w-full bg-blue-950`}>
                  <video
                    src={v.src}
                    className="absolute inset-0 h-full w-full object-contain"
                    controls
                    playsInline
                    preload="metadata"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="text-sm font-extrabold text-blue-950">{v.title}</p>
                  {v.subtitle ? (
                    <p className="mt-1 text-xs text-blue-900/70">{v.subtitle}</p>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="hidden sm:grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {videos.map((v) => (
          <Card key={v.src} className="overflow-hidden">
            <div className={`relative aspect-video ${desktopAspectClass} w-full bg-blue-50`}>
              <video
                src={v.src}
                className="absolute inset-0 h-full w-full object-cover"
                controls
                playsInline
                preload="metadata"
              />
            </div>
            <CardContent className="p-4">
              <p className="text-sm font-extrabold text-blue-950">{v.title}</p>
              {v.subtitle ? (
                <p className="mt-1 text-xs text-blue-900/70">{v.subtitle}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

