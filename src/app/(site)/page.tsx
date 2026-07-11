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
      <section className="relative w-full min-h-[520px] md:min-h-[620px] overflow-hidden flex flex-col justify-between pt-16 pb-8 md:pt-20 md:pb-12">
        <Image src="/hero-bg.jpg" alt="Computer lab" fill className="object-cover object-center"/>
        <div className="absolute inset-0 bg-gradient-to-b from-[#001f3f]/90 via-[#001f5f]/80 to-[#001f9f]/90"></div>
        
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 w-full mx-auto max-w-screen-xl">
          <div className="animate-fade-up animation-delay-100 flex flex-col items-center">
            <h1 className="w-full font-[var(--font-poppins)] text-center uppercase text-white drop-shadow-2xl">
              <span className="block whitespace-nowrap text-[23px] sm:text-[46px] md:text-[62px] lg:text-[76px] font-black tracking-normal leading-none">
                Royal Computer Institute
              </span>
            </h1>
            <div className="mx-auto mt-5 flex w-[220px] items-center justify-center gap-2">
              <span className="h-[3px] w-12 rounded-full bg-white/80"></span>
              <span className="h-[6px] w-24 rounded-full bg-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.9)]"></span>
              <span className="h-[3px] w-12 rounded-full bg-white/80"></span>
            </div>
            <p className="mt-5 max-w-[760px] font-body text-sm font-bold leading-relaxed text-[#f8d45c] drop-shadow sm:text-base md:text-lg">
              <span className="block">ISO IAF 9001:2015 Certified Institute</span>
              <span className="block">Reg. Under MSME Gov. Of India</span>
            </p>
          </div>
          
          <h2 className="animate-fade-up animation-delay-300 mt-9 max-w-4xl font-[var(--font-poppins)] text-[26px] sm:text-[34px] md:text-[44px] lg:text-[52px] leading-[1.12] font-extrabold text-white mb-4 sm:mb-6 drop-shadow-md">
            Best Computer Training Institute in Motihari
          </h2>
          
          <p className="animate-fade-up animation-delay-400 font-body text-sm sm:text-base md:text-lg text-[rgb(240,240,240)] max-w-[700px] mb-8 drop-shadow">
            Providing high-quality computer education, practical training, and 100% job placement assistance to help you build a successful career.
          </p>
          
          <div className="animate-fade-up animation-delay-500 flex flex-wrap items-center justify-center gap-4 mb-8 sm:mb-12">
            <Link href="/admission" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 px-8 py-3.5 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1">Student Admission</Link>
            <Link href="/courses" className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/30 px-8 py-3.5 text-white font-bold hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">View Courses</Link>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 mt-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="animate-fade-up animation-delay-700 rounded-xl bg-white/[0.08] backdrop-blur-[10px] border border-white/20 px-4 py-6 text-center shadow-lg transition-transform hover:-translate-y-1">
              <p className="font-display text-3xl md:text-4xl font-black text-[#f8d45c]">1000+</p>
              <p className="mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-white">
                Happy Students
              </p>
            </div>
            <div className="animate-fade-up animation-delay-800 rounded-xl bg-white/[0.08] backdrop-blur-[10px] border border-white/20 px-4 py-6 text-center shadow-lg transition-transform hover:-translate-y-1">
              <p className="font-display text-3xl md:text-4xl font-black text-[#f8d45c]">30+</p>
              <p className="mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-white">
                Professional Courses
              </p>
            </div>
            <div className="animate-fade-up animation-delay-900 rounded-xl bg-white/[0.08] backdrop-blur-[10px] border border-white/20 px-4 py-6 text-center shadow-lg transition-transform hover:-translate-y-1">
              <p className="font-display text-3xl md:text-4xl font-black text-[#f8d45c]">8+</p>
              <p className="mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-white">
                Years Experience
              </p>
            </div>
            <div className="animate-fade-up animation-delay-1000 rounded-xl bg-white/[0.08] backdrop-blur-[10px] border border-white/20 px-4 py-6 text-center shadow-lg transition-transform hover:-translate-y-1">
              <p className="font-display text-3xl md:text-4xl font-black text-[#f8d45c]">100%</p>
              <p className="mt-2 text-xs md:text-sm font-bold uppercase tracking-wider text-white">
                Job Assistance
              </p>
            </div>
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
            <div className="mt-8 sm:mt-16 grid grid-cols-2 items-start gap-3 sm:gap-6 lg:grid-cols-3">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  name={course.name}
                  subHeading={course.description}
                  duration={course.duration}
                  fee={formatCurrency(course.oneTimeFee || course.totalFee)}
                    actualFee={formatCurrency(course.actualFee || course.totalFee)}
                    image={course.imageUrl ?? undefined}
                    href={`/courses/${course.id}`}
                    enquiryHref={course.isEnquiryEnabled ? `/query?courseId=${course.id}` : undefined}
                    details={course.syllabus}
                  />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-[#f8fafc] pt-12 sm:pt-16 pb-24 sm:pb-32">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
          <SectionHeading title="Our Photo Gallery" centered />
          <div className="mt-8 sm:mt-16 grid grid-cols-2 gap-3 sm:gap-8 lg:grid-cols-3">
            {GALLERY_IMAGES.map((src, i) => (
              <div key={i} className="bg-white p-1.5 sm:p-3 rounded-lg sm:rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
                <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md sm:rounded-lg bg-gray-50">
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
