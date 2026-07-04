import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getPublicEnquiryCourses } from "@/lib/public-content";

export const dynamic = "force-dynamic";

export default async function QueryPage({
  searchParams,
}: {
  searchParams: Promise<{ courseId?: string }>;
}) {
  const { courseId } = await searchParams;
  const courses = await getPublicEnquiryCourses();

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-[var(--ui-primary)] py-12 sm:py-32 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--ui-secondary)]/30 rounded-full blur-[120px] -mt-[300px] -mr-[300px]" />

        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 relative z-10 text-center">
          <span className="text-sm font-extrabold text-[var(--ui-accent)] tracking-[0.25em] uppercase mb-5 block">
            We&apos;re Here to Help
          </span>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Student Enquiry
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-white/70 max-w-xl mx-auto leading-relaxed">
            Send us your question about admissions, courses, fees, or schedules — and we&apos;ll get back to you quickly.
          </p>
        </div>
      </section>

      {/* Split layout */}
      <section className="bg-[var(--ui-surface)] py-12 sm:py-28">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:items-start">
            {/* Form */}
            <div className="lg:col-span-3">
              <EnquiryForm
                courses={courses.map((c) => ({ id: c.id, name: c.name }))}
                defaultCourseId={courseId}
              />
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-[2rem] bg-[var(--ui-primary)] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--ui-secondary)]/20 rounded-full blur-2xl -mt-10 -mr-10" />
                <h3 className="font-display text-xl font-extrabold mb-6 relative z-10">Why Enquire?</h3>
                <ul className="space-y-4 text-sm text-white/80 relative z-10">
                  {[
                    "Free career counseling session",
                    "Flexible batch timings",
                    "Demo class available",
                    "Easy installment-based fees",
                    "Fast admission process",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="h-5 w-5 rounded-full bg-[var(--ui-accent)]/20 text-[var(--ui-accent)] flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] bg-white border border-[var(--ui-border)] p-8">
                <h3 className="font-display text-lg font-extrabold text-[var(--ui-primary)] mb-5">Quick Contact</h3>
                <div className="space-y-4 text-sm text-[var(--ui-muted)]">
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl">📞</span>
                    <span className="text-[var(--ui-primary)]">We respond same day</span>
                  </div>
                  <div className="flex items-center gap-3 font-semibold">
                    <span className="text-xl">⏱️</span>
                    <span className="text-[var(--ui-primary)]">Avg. reply in 2 hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
