import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getPublicCourses } from "@/lib/public-content";
import { formatCurrency } from "@/lib/format";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CourseCard } from "@/components/site/CourseCard";
import { buildMetadata } from "@/lib/seo/metadata-builder";
import { BIHAR_CITIES, generateLocalSEOContent } from "@/lib/seo/locations/bihar";
import { BreadcrumbSchema, FAQSchema, EducationalOrganizationSchema } from "@/components/seo/Schemas";

type Props = {
  params: Promise<{ city: string }>;
};

export async function generateStaticParams() {
  return BIHAR_CITIES.map((city) => ({
    city,
  }));
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const citySlug = params.city.toLowerCase();
  
  if (!BIHAR_CITIES.includes(citySlug)) {
    return {};
  }
  
  const content = generateLocalSEOContent(citySlug);
  return buildMetadata({
    title: content.title,
    description: content.description,
    path: `/locations/${citySlug}`,
  });
}

export default async function LocationPage(props: Props) {
  const params = await props.params;
  const citySlug = params.city.toLowerCase();

  if (!BIHAR_CITIES.includes(citySlug)) {
    notFound();
  }

  const content = generateLocalSEOContent(citySlug);
  const courses = await getPublicCourses();

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Locations", url: "/locations" },
    { name: content.cityName, url: `/locations/${citySlug}` },
  ];

  return (
    <div className="w-full">
      {/* JSON-LD Schemas */}
      <EducationalOrganizationSchema />
      <BreadcrumbSchema items={breadcrumbItems} />
      <FAQSchema faqs={content.faqs} />

      {/* Hero Section */}
      <section className="relative w-full min-h-[460px] md:min-h-[520px] overflow-hidden flex flex-col justify-center py-12 md:py-20">
        <Image 
          src="/hero-bg.jpg" 
          alt={`Computer education coaching in ${content.cityName}`} 
          fill 
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#001f3f]/95 via-[#001f5f]/90 to-[#001f9f]/95"></div>

        <div className="relative z-10 w-full mx-auto max-w-screen-xl px-4 text-center">
          <div className="animate-fade-up flex flex-col items-center">
            <span className="rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#f8d45c] mb-6">
              Local Learning Hub &middot; {content.cityName}
            </span>
            <h1 className="font-[var(--font-poppins)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-md uppercase max-w-5xl">
              {content.h1}
            </h1>
            <div className="mx-auto my-6 flex w-[180px] items-center justify-center gap-1.5">
              <span className="h-[2px] w-10 rounded-full bg-white/70"></span>
              <span className="h-[5px] w-16 rounded-full bg-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.8)]"></span>
              <span className="h-[2px] w-10 rounded-full bg-white/70"></span>
            </div>
            <p className="font-body text-sm sm:text-base md:text-lg text-[rgb(230,230,230)] max-w-3xl leading-relaxed mb-8 drop-shadow">
              {content.intro}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link 
                href="/admission" 
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 px-8 py-3.5 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5"
              >
                Apply Online from {content.cityName}
              </Link>
              <Link 
                href="#courses" 
                className="inline-flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-8 py-3.5 text-white font-bold hover:bg-white/25 transition-all duration-300 shadow-lg"
              >
                Explore Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights / Why Choose Us Section */}
      <section className="w-full bg-white py-16 sm:py-24 border-b border-gray-100">
        <div className="mx-auto max-w-screen-xl px-4">
          <div className="grid gap-12 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-sm font-bold uppercase tracking-wider text-blue-600">Why Choose Royal Computer Institute</span>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--ui-primary)] leading-snug">
                The Best IT Education & Computing Classes for Students from {content.cityName}
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[var(--ui-muted)]">
                {content.whyChooseUs}
              </p>
              <div className="pt-4">
                <Link 
                  href="/about" 
                  className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                >
                  Learn more about our credentials &rarr;
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 border border-slate-100 p-6 sm:p-8 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-[var(--ui-primary)] mb-4">Core Academic Highlights</h3>
              <ul className="space-y-3">
                {content.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mt-0.5">✓</span>
                    <span className="text-sm font-semibold text-gray-800">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Courses Catalog */}
      <section id="courses" className="w-full bg-[var(--ui-surface)] py-16 sm:py-24">
        <div className="mx-auto max-w-screen-xl px-4">
          <SectionHeading
            title={`IT & Computer Courses near ${content.cityName}`}
            subtitle="Acquire certified skills in DCA, ADCA, Tally Prime with GST, Python programming, and typing classes."
            centered
          />

          {courses.length === 0 ? (
            <p className="mt-8 text-center text-sm text-[var(--ui-muted)]">Our course catalog is being updated.</p>
          ) : (
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* Localized FAQ Accordion */}
      <section className="w-full bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-screen-md px-4">
          <h2 className="text-center font-display text-2xl sm:text-3xl font-extrabold text-[var(--ui-primary)] mb-12">
            Frequently Asked Questions (FAQs) in {content.cityName}
          </h2>
          <div className="space-y-6">
            {content.faqs.map((faq, idx) => (
              <div key={idx} className="border-b border-gray-100 pb-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2.5">
                  Q: {faq.question}
                </h3>
                <p className="text-sm sm:text-base leading-relaxed text-[var(--ui-muted)]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Registration CTA */}
      <section className="w-full bg-[#001f3f] py-16 text-center text-white">
        <div className="mx-auto max-w-screen-xl px-4 space-y-6">
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
            Take Your Next Step To a Bright Career in {content.cityName}
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            GetGovt.-recognized ISO certification, comprehensive training files, and expert mentorship to stand out in the competitive job market.
          </p>
          <div className="pt-4">
            <Link 
              href="/admission" 
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#eab308] hover:bg-[#d9a307] px-8 text-sm font-extrabold text-[#0f172a] shadow transition-colors"
            >
              Start Admission Process &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
