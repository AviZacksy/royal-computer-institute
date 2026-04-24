import { PageShell } from "@/components/ui/Page";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoAction } from "@/components/demo/DemoAction";

const COURSES = [
  {
    name: "ADCA",
    detail: "Advanced Diploma in Computer Applications",
    dur: "12 Months (demo)",
    fee: { monthly: "₹—/month", total: "₹— total" },
  },
  {
    name: "DCA",
    detail: "Diploma in Computer Applications",
    dur: "6 Months (demo)",
    fee: { monthly: "₹—/month", total: "₹— total" },
  },
  {
    name: "Tally",
    detail: "Accounting + GST basics (demo)",
    dur: "3 Months (demo)",
    fee: { monthly: "₹—/month", total: "₹— total" },
  },
  {
    name: "DTP",
    detail: "Desktop Publishing tools (demo)",
    dur: "3 Months (demo)",
    fee: { monthly: "₹—/month", total: "₹— total" },
  },
  {
    name: "Typing",
    detail: "Hindi/English typing practice (demo)",
    dur: "2 Months (demo)",
    fee: { monthly: "₹—/month", total: "₹— total" },
  },
  {
    name: "CCC",
    detail: "Course on Computer Concepts (demo)",
    dur: "3 Months (demo)",
    fee: { monthly: "₹—/month", total: "₹— total" },
  },
  {
    name: "Graphic Designing",
    detail: "Design fundamentals + tools (demo)",
    dur: "6 Months (demo)",
    fee: { monthly: "₹—/month", total: "₹— total" },
  },
];

export default function CoursesPage() {
  return (
    <PageShell
      title="Courses"
      subtitle="Explore job-oriented computer courses with practical training (demo UI)."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c) => (
          <Card
            key={c.name}
            className="border border-blue-100 bg-white transition-shadow hover:shadow-md"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-900">
                      💻
                    </span>
                    <p className="text-base font-extrabold text-blue-950">{c.name}</p>
                  </div>
                  <p className="mt-2 text-sm text-blue-900/70">{c.detail}</p>
                </div>
                <div className="shrink-0 text-right">
                  <span className="inline-flex rounded-full border border-blue-100 bg-white px-3 py-1 text-[11px] font-extrabold text-blue-900">
                    {c.dur}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-900/70">
                <span className="rounded-full border border-blue-100 bg-white px-3 py-1">
                  Fee: {c.fee.monthly}
                </span>
                <span className="rounded-full border border-blue-100 bg-white px-3 py-1">
                  {c.fee.total}
                </span>
              </div>
              <div className="mt-4 grid gap-2">
                <DemoAction label="Enquire" variant="primary" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}

