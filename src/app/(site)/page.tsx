import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { CourseCard } from "@/components/site/CourseCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { getPublicCourses } from "@/lib/public-content";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

const GALLERY_IMAGES = [
  "/gallery/WhatsApp Image 2026-06-26 at 3.39.46 PM.jpeg",
  "/gallery/WhatsApp Image 2026-06-26 at 3.39.47 PM.jpeg",
  "/gallery/WhatsApp Image 2026-06-26 at 3.39.57 PM.jpeg",
  "/gallery/WhatsApp Image 2026-06-26 at 3.40.05 PM.jpeg",
  "/gallery/WhatsApp Image 2026-06-26 at 3.40.11 PM.jpeg",
  "/gallery/WhatsApp Image 2026-06-26 at 3.40.13 PM.jpeg",
];

export default async function Home() {
  const courses = await getPublicCourses();

  return (
    <div className="w-full">
      <section className="w-full bg-white pt-3 sm:pt-6">
        <div className="mx-auto grid w-full max-w-screen-2xl gap-4 px-3 sm:gap-6 sm:px-4 lg:px-8">
          <div className="order-2 flex flex-col justify-center rounded-md bg-blue-700 px-5 py-7 text-center text-white shadow-md sm:px-8 lg:py-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--ui-accent)] sm:text-sm">
              Royal Computer Institute
            </p>
            <h1 className="mt-3 font-display text-3xl font-black leading-tight sm:mt-4 sm:text-5xl">
              Job-ready computer courses in Motihari
            </h1>
            <p className="mx-auto mt-3 max-w-3xl text-sm font-medium leading-6 text-white/80 sm:mt-4 sm:text-base sm:leading-7">
              Learn practical computer skills with hands-on training, exam
              support, and placement guidance through our latest course catalog.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:flex sm:flex-wrap sm:justify-center">
              <Link href="/student/register" className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--ui-accent)] px-5 text-sm font-extrabold text-[var(--ui-primary)] shadow-xl shadow-[var(--ui-accent)]/20 transition-all hover:scale-105 sm:px-7">
                Apply Now
              </Link>
              <Link href="/courses" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-extrabold text-blue-700 shadow-xl shadow-blue-950/10 transition-all hover:scale-105 hover:bg-blue-50 sm:px-7">
                View Courses
              </Link>
            </div>
          </div>

          <div className="relative order-1 aspect-[16/9] w-full overflow-hidden rounded-md bg-[var(--ui-surface)] shadow-md sm:aspect-[3/1] lg:aspect-[4/1]">
            <Image
              src="/banner/banner1.jpeg"
              alt="Institute Banner"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
        <div className="mx-auto mt-3 grid w-full max-w-screen-2xl grid-cols-2 gap-3 px-3 sm:mt-5 sm:flex sm:items-center sm:justify-center sm:gap-4 sm:px-4 lg:px-8">
          <div className="rounded-md bg-white px-3 py-3 text-center shadow-md ring-1 ring-black/5 sm:px-8 sm:py-4">
            <p className="font-display text-2xl font-black leading-none text-[var(--ui-primary)] sm:text-4xl">
              1000+
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[var(--ui-muted)] sm:text-sm">
              Students Trained
            </p>
          </div>
          <div className="rounded-md bg-white px-3 py-3 text-center shadow-md ring-1 ring-black/5 sm:px-8 sm:py-4">
            <p className="font-display text-2xl font-black leading-none text-[var(--ui-primary)] sm:text-4xl">
              400+
            </p>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-[var(--ui-muted)] sm:text-sm">
              Placements
            </p>
          </div>
        </div>
      </section>

      <section id="courses" className="w-full bg-[var(--ui-surface)] pt-16 sm:pt-32 pb-12 sm:pb-16">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
          <SectionHeading
            title="Our Courses"
            subtitle="Explore the latest active programs, fees, and durations available for admission."
            centered
          />

          {courses.length === 0 ? (
            <div className="mt-16 rounded-md border border-[var(--ui-border)] bg-white p-8 text-center shadow-sm">
              <p className="font-display text-2xl font-black text-[var(--ui-primary)]">
                Course catalog is being updated
              </p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--ui-muted)]">
                Please contact the institute for current course details, fees,
                and batch availability.
              </p>
            </div>
          ) : (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  name={course.name}
                  subHeading={course.description}
                  duration={course.duration}
                  fee={formatCurrency(course.oneTimeFee || course.totalFee)}
                  actualFee={formatCurrency(course.actualFee || course.totalFee)}
                  image={course.imageUrl ?? undefined}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-[#f8fafc] pt-12 sm:pt-16 pb-24 sm:pb-32">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
          <SectionHeading title="Our Photo Gallery" centered />
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {GALLERY_IMAGES.map((src, i) => (
              <div key={i} className="bg-white p-3 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg bg-gray-50">
                  <Image
                    src={src}
                    alt={`Gallery Image ${i + 1}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <ButtonLink href="/gallery" className="h-14 px-8 rounded-none text-base font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors inline-flex items-center justify-center border-none">
              View All Photos
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
