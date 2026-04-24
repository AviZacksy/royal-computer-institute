import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoAction } from "@/components/demo/DemoAction";

const ADS = [
  {
    t: "Institute Ad Video 1",
    d: "Promo reel (demo media)",
    src: "/Video/Ads/video_2026-04-24_17-53-41.mp4",
  },
  {
    t: "Institute Ad Video 2",
    d: "Promo reel (demo media)",
    src: "/Video/Ads/video_2026-04-24_17-53-53.mp4",
  },
] as const;

export default function OnlineAdvertisingPage() {
  return (
    <PageShell
      title="Online Advertising"
      subtitle="Demo page for institute promos and online advertising."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {ADS.map((x) => (
          <Card key={x.t} className="overflow-hidden border border-blue-100 bg-white">
            <div className="relative aspect-video w-full bg-blue-950">
              <video
                className="h-full w-full object-contain"
                src={x.src}
                controls
                playsInline
                preload="metadata"
              />
            </div>
            <CardContent className="p-5">
              <p className="text-sm font-extrabold text-blue-950">{x.t}</p>
              <p className="mt-1 text-sm text-blue-900/70">{x.d}</p>
              <div className="mt-4">
                <DemoAction label="Boost / Promote" variant="secondary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

