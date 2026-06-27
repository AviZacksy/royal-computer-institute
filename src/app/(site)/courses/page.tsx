import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { formatCurrency } from "@/lib/format";
import { getPublicCourses } from "@/lib/public-content";

export const dynamic = "force-dynamic";

function getCourseInitials(name: string): string {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return initials || "RC";
}

export default async function CoursesPage() {
  const courses = await getPublicCourses();

  return (
    <div className="w-full">
      <section className="relative overflow-hidden bg-[var(--ui-primary)] py-12 text-white sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute right-0 top-0 -mr-[300px] -mt-[300px] h-[600px] w-[600px] rounded-full bg-[var(--ui-secondary)]/30 blur-[120px]" />
        <div className="absolute bottom-0 left-0 -mb-[200px] -ml-[200px] h-[400px] w-[400px] rounded-full bg-[var(--ui-accent)]/10 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-screen-2xl px-4 text-center lg:px-8">
          <span className="mb-5 block text-sm font-extrabold uppercase tracking-[0.25em] text-[var(--ui-accent)]">
            Our Programs
          </span>
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
            Choose Your Career Path
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-2xl">
            Job-oriented courses designed for practical lab training, exam support,
            and certificate-ready learning.
          </p>
        </div>
      </section>

      <section className="bg-[var(--ui-surface)] py-12 sm:py-28">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
          {courses.length === 0 ? (
            <div className="py-32 text-center">
              <h2 className="mb-4 font-display text-3xl font-extrabold text-[var(--ui-primary)]">
                Coming Soon
              </h2>
              <p className="mx-auto mb-10 max-w-md text-lg leading-relaxed text-[var(--ui-muted)]">
                Our course catalog is being updated. Please contact the institute
                directly for enrollment.
              </p>
              <ButtonLink href="/query" className="inline-flex h-14 items-center justify-center rounded-full bg-[var(--ui-primary)] px-10 text-base font-bold text-white shadow-lg transition-all hover:scale-105">
                Send Enquiry
              </ButtonLink>
            </div>
          ) : (
            <>
              <div className="mb-12">
                <SectionHeading
                  eyebrow={`${courses.length} Programs Available`}
                  title="All Courses"
                  subtitle="Select a program to enquire about admission, fees, and batch schedules."
                />
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="group relative flex flex-col rounded-[2rem] border border-[var(--ui-border)]/50 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-[var(--ui-border)]/50 bg-[var(--ui-surface)] shadow-sm transition-transform duration-500 group-hover:scale-105">
                        {course.imageUrl ? (
                          <Image
                            src={course.imageUrl}
                            alt={course.name}
                            fill
                            unoptimized={course.imageUrl.startsWith("http")}
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl font-black text-[var(--ui-primary)]">
                            {getCourseInitials(course.name)}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="mt-8 font-display text-2xl font-extrabold text-[var(--ui-primary)]">
                      {course.name}
                    </h3>

                    <p className="mt-4 flex-1 text-base leading-relaxed text-[var(--ui-muted)]">
                      {course.description}
                    </p>

                    <div className="mt-8 flex flex-col gap-3 border-t border-[var(--ui-border)]/50 pt-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="rounded-lg border border-[var(--ui-border)] bg-[var(--ui-surface)] px-3 py-1.5 text-sm font-bold text-[var(--ui-primary)]">
                          {course.duration}
                        </div>
                        <div className="text-right">
                          {course.actualFee && course.actualFee !== (course.oneTimeFee || course.totalFee) ? (
                            <div className="text-xs font-bold text-[var(--ui-muted)] line-through">
                              {formatCurrency(course.actualFee)}
                            </div>
                          ) : null}
                          <div className="rounded-lg bg-[var(--ui-secondary)]/5 px-3 py-1.5 text-sm font-bold text-[var(--ui-secondary)]">
                            {formatCurrency(course.oneTimeFee || course.totalFee)}
                          </div>
                        </div>
                      </div>
                      <ButtonLink
                        href={`/query?courseId=${course.id}`}
                        variant="primary"
                        className="mt-2 flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold transition-all group-hover:shadow-lg group-hover:shadow-[var(--ui-primary)]/10"
                      >
                        Enquire About This Course
                      </ButtonLink>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="bg-white py-12 sm:py-28">
        <div className="mx-auto max-w-screen-xl px-4 text-center lg:px-8">
          <h2 className="mb-6 font-display text-3xl font-extrabold text-[var(--ui-primary)] sm:text-5xl">
            Not sure which course is right?
          </h2>
          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[var(--ui-muted)]">
            Book a free counseling session. Our expert faculty will guide you to
            the best program for your career goals.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink
              href="/query"
              className="inline-flex h-14 w-full items-center justify-center rounded-full bg-[var(--ui-primary)] px-10 text-base font-bold text-white shadow-xl transition-all hover:scale-105 sm:w-auto"
            >
              Book Free Counseling
            </ButtonLink>
            <ButtonLink
              href="/student/register"
              variant="outline"
              className="inline-flex h-14 w-full items-center justify-center rounded-full border-2 bg-white px-10 text-base font-bold transition-all hover:bg-[var(--ui-surface)] sm:w-auto"
            >
              Apply for Admission
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
