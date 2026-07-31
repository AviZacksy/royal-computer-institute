import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, IndianRupee, GraduationCap, BriefcaseBusiness, ListChecks } from "lucide-react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ButtonLink } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/format";
import { getPublicCourseById, getPublicEnquiryCourses } from "@/lib/public-content";
import { buildMetadata } from "@/lib/seo/metadata-builder";
import { BreadcrumbSchema, CourseSchema } from "@/components/seo/Schemas";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await props.params;
  const course = await getPublicCourseById(courseId);
  if (!course) return {};

  return buildMetadata({
    title: `${course.name} Course Details, Fees & Duration`,
    description: `${course.name} computer coaching course details: syllabus, duration, fees, eligibility, and career scope at Royal Computer Institute, Motihari, Bihar.`,
    path: `/courses/${courseId}`,
  });
}

export default async function CourseDetailPage(props: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await props.params;
  const [course, courses] = await Promise.all([
    getPublicCourseById(courseId),
    getPublicEnquiryCourses(),
  ]);

  if (!course) notFound();

  const price = course.oneTimeFee || course.totalFee;
  const hasFeeComparison = Boolean(course.actualFee && course.actualFee !== price);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Courses", url: "/courses" },
    { name: course.name, url: `/courses/${courseId}` },
  ];

  return (
    <div className="bg-[var(--ui-surface)]">
      <BreadcrumbSchema items={breadcrumbItems} />
      <CourseSchema name={course.name} description={course.description} duration={course.duration} />
      <section className="bg-[var(--ui-primary)] py-10 text-white sm:py-20">
        <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="flex flex-col justify-center">
            <Link href="/courses" className="mb-6 text-sm font-bold text-white/70 hover:text-white">
              Back to Courses
            </Link>
            <p className="text-sm font-extrabold uppercase tracking-[0.22em] text-[var(--ui-accent)]">
              Course Details
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
              {course.name}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75">
              {course.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <InfoPill icon={<Clock className="h-4 w-4" />} label={course.duration} />
              <InfoPill icon={<IndianRupee className="h-4 w-4" />} label={`${formatCurrency(price)} one-time`} />
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl">
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.name}
                fill
                unoptimized={course.imageUrl.startsWith("http")}
                className="object-cover"
                priority
              />
            ) : (
              <div className="grid h-full place-items-center text-5xl font-black text-white/70">
                {course.name.slice(0, 2)}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-20">
        <div className="mx-auto grid max-w-screen-2xl gap-8 px-4 lg:grid-cols-[1fr_420px] lg:px-8">
          <div className="space-y-6">
            <DetailCard title="Full Description" icon={<GraduationCap className="h-5 w-5" />}>
              <TextBlock value={course.description} />
            </DetailCard>

            <DetailCard title="Syllabus" icon={<ListChecks className="h-5 w-5" />}>
              <TextBlock value={course.syllabus} empty="Syllabus details will be updated by the institute." />
            </DetailCard>

            <div className="grid gap-6 md:grid-cols-2">
              <DetailCard title="Eligibility" icon={<GraduationCap className="h-5 w-5" />}>
                <TextBlock value={course.eligibility} empty="Eligibility details will be updated by the institute." />
              </DetailCard>

              <DetailCard title="Career Scope" icon={<BriefcaseBusiness className="h-5 w-5" />}>
                <TextBlock value={course.careerScope} empty="Career scope details will be updated by the institute." />
              </DetailCard>
            </div>

            <DetailCard title="Duration and Fee" icon={<IndianRupee className="h-5 w-5" />}>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Metric label="Duration" value={course.duration} />
                <Metric label="Actual Fee" value={formatCurrency(course.actualFee || course.totalFee)} muted={hasFeeComparison} />
                <Metric label="Installment Fee" value={formatCurrency(course.installmentFee || course.totalFee)} />
                <Metric label="One Time Fee" value={formatCurrency(price)} highlight />
              </div>
            </DetailCard>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {course.isEnquiryEnabled ? (
              <EnquiryForm courses={courses.map((item) => ({ id: item.id, name: item.name }))} defaultCourseId={course.id} />
            ) : (
              <div className="rounded-2xl border border-[var(--ui-border)] bg-white p-6 text-sm font-semibold text-[var(--ui-muted)]">
                Enquiry is currently closed for this course.
              </div>
            )}
            <div className="mt-4 rounded-2xl border border-[var(--ui-border)] bg-white p-5">
              <p className="text-sm font-bold text-[var(--ui-primary)]">Ready for admission?</p>
              <p className="mt-1 text-sm text-[var(--ui-muted)]">
                Submit student admission with your selected course.
              </p>
              <ButtonLink href="/admission" className="mt-4 flex h-11 w-full items-center justify-center rounded-xl text-sm font-bold">
                Student Admission
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function InfoPill({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white">
      {icon}
      {label}
    </span>
  );
}

function DetailCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[var(--ui-border)] bg-white p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-3 font-display text-2xl font-extrabold text-[var(--ui-primary)]">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[var(--ui-secondary)]">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TextBlock({ value, empty }: { value?: string | null; empty?: string }) {
  const text = value?.trim();
  if (!text) {
    return <p className="text-sm leading-6 text-[var(--ui-muted)]">{empty ?? "Details will be updated by the institute."}</p>;
  }

  return (
    <div className="space-y-2 text-sm leading-7 text-[var(--ui-muted)]">
      {text.split(/\r?\n/).filter(Boolean).map((line, index) => (
        <p key={`${index}-${line}`}>{line}</p>
      ))}
    </div>
  );
}

function Metric({ label, value, muted, highlight }: { label: string; value: string; muted?: boolean; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "border-[var(--ui-accent)] bg-amber-50" : "border-[var(--ui-border)] bg-[var(--ui-surface)]"}`}>
      <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--ui-muted)]">{label}</p>
      <p className={`mt-2 text-lg font-extrabold ${muted ? "text-[var(--ui-muted)] line-through" : "text-[var(--ui-primary)]"}`}>
        {value}
      </p>
    </div>
  );
}
