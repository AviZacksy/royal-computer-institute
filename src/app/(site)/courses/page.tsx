import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/Button";
import { getPublicCourses } from "@/lib/public-content";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await getPublicCourses();

  return (
    <PageShell
      title="Courses"
      subtitle="Explore job-oriented computer courses with practical training."
    >
      {courses.length === 0 ? (
        <p className="text-sm text-[var(--ui-muted)]">
          Courses will be listed here soon. Please contact the institute for details.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="bg-white transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl border border-black/5 bg-section text-royal">
                        💻
                      </span>
                      <p className="text-base font-extrabold text-royal">{c.name}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted">{c.description}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-black/5 bg-white px-3 py-1 text-[11px] font-extrabold text-royal">
                    {c.duration}
                  </span>
                </div>
                <div className="mt-3 text-xs font-semibold text-muted">
                  Fee: {formatCurrency(c.totalFee)}
                </div>
                <div className="mt-4">
                  <ButtonLink href={`/query?courseId=${c.id}`} variant="primary" size="sm">
                    Enquire
                  </ButtonLink>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
