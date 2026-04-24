import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoNotice } from "@/components/demo/DemoNotice";

const COURSES = [
  { name: "ADCA", detail: "Advanced Diploma in Computer Applications" },
  { name: "DCA", detail: "Diploma in Computer Applications" },
  { name: "Tally", detail: "Accounting + GST basics (demo)" },
  { name: "DTP", detail: "Desktop Publishing tools (demo)" },
  { name: "Typing", detail: "Hindi/English typing practice (demo)" },
  { name: "CCC", detail: "Course on Computer Concepts (demo)" },
  { name: "Graphic Designing", detail: "Design fundamentals + tools (demo)" },
];

export default function CoursesPage() {
  return (
    <PageShell
      title="Courses"
      subtitle="Explore popular courses offered by Royal Computer Institute (demo UI)."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c) => (
          <Card key={c.name} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <p className="text-base font-semibold text-zinc-950 dark:text-white">
                {c.name}
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {c.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <DemoNotice />
    </PageShell>
  );
}

