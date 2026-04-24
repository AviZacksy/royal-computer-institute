import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoNotice } from "@/components/demo/DemoNotice";

const PHOTOS = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: `Institute Photo ${i + 1}`,
}));

export default function GalleryPage() {
  return (
    <PageShell title="Gallery" subtitle="Institute photo gallery (demo placeholders).">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PHOTOS.map((p) => (
          <Card key={p.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-[4/3] w-full bg-blue-50">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200/70 via-blue-50 to-white" />
              <div className="absolute inset-0 p-4">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-extrabold text-blue-900 backdrop-blur">
                    RCI Gallery
                  </span>
                  <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-blue-900/80 backdrop-blur">
                    Placeholder
                  </span>
                </div>
              </div>
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid h-14 w-14 place-items-center rounded-3xl bg-white/80 text-2xl text-blue-900 shadow-sm">
                  🏫
                </div>
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

      <DemoNotice />
    </PageShell>
  );
}

