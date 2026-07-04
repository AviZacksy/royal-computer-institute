import Image from "next/image";
import { Clock3, GraduationCap, Users } from "lucide-react";
import { INSTITUTE } from "@/config/institute";
import { SectionHeading } from "@/components/site/SectionHeading";
import { getPublicAboutContent } from "@/lib/public-content";

const FACULTY = [
  {
    id: "director",
    role: "Director",
    name: INSTITUTE.directorName,
    description: "Academic leadership and institute operations.",
    image: "/about/Director.jpeg",
    icon: "graduation",
  },
  {
    id: "managing-director",
    role: "Managing Director",
    name: "Vishal Verma",
    description: "Senior Microsoft Azure Cloud Engineer (NTT Data LTD), Ex Wipro. M.Tech (Computer Science), BITS Pilani.",
    image: "/about/vishal.jpeg",
    icon: "users",
  },
  {
    id: "vice-director",
    role: "Vice Director",
    name: "Sumit Shrivastava",
    description: "BCA, Chandigarh University. Institute administration, student support, and academic coordination.",
    image: "/about/vicedirector.jpeg",
    icon: "users",
  },
  {
    id: "vivek-teacher",
    role: "Teacher",
    name: "Vivek Kumar",
    description: "Computer teacher focused on practical training, course guidance, and student preparation.",
    image: "/about/vivekteacher.jpeg",
    icon: "graduation",
  },
  {
    id: "prince-teacher",
    role: "Teacher",
    name: "Prince Singh",
    description: "Computer teacher focused on lab practice, fundamentals, and student mentoring.",
    image: "/about/princeteacher.jpeg",
    icon: "graduation",
  },
];

const UNIQUE_FACULTY = FACULTY.filter(
  (member, index, list) => list.findIndex((item) => item.id === member.id) === index,
);

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const about = await getPublicAboutContent();

  return (
    <div className="w-full bg-[var(--ui-surface)] min-h-screen">
      <section className="py-12 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="mx-auto max-w-screen-xl px-4 lg:px-8 relative z-10 space-y-24 sm:space-y-32">
          <div>
            <SectionHeading
              eyebrow="About Us"
              title={about.title}
              subtitle={about.description}
              centered
            />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl font-extrabold text-[var(--ui-primary)] sm:text-4xl mb-8">
              Our Mission
            </h2>
            <div className="prose prose-lg text-[var(--ui-muted)] prose-p:leading-relaxed mx-auto text-center">
              <p>
                <strong className="text-[var(--ui-secondary)] font-extrabold">{INSTITUTE.name}</strong>{" "}
                {stripInstitutePrefix(about.introduction)}
              </p>
              <p className="mt-6">
                {about.mission}
              </p>
              <p className="mt-6">{about.vision}</p>
            </div>

            {about.imageUrl ? (
              <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-[var(--ui-border)] bg-white shadow-sm">
                <Image
                  src={about.imageUrl}
                  alt={about.title}
                  width={960}
                  height={520}
                  unoptimized={about.imageUrl.startsWith("http") || about.imageUrl.startsWith("/api/")}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mt-16 border-t border-[var(--ui-border)] pt-12">
              <SectionHeading
                eyebrow="Our Faculty"
                title="Guided by Experienced Educators"
                subtitle="Leadership and teachers focused on practical computer education."
                centered
              />

              <div className="mt-10 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {UNIQUE_FACULTY.map((member) => (
                  <div key={member.id} className="flex h-[460px] flex-col rounded-xl border border-[var(--ui-border)] bg-white p-5 text-center shadow-sm">
                    <div className="mx-auto mb-5 flex h-[245px] w-[220px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[var(--ui-border)] bg-blue-50 text-[var(--ui-secondary)] shadow-sm">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={220}
                          height={275}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <FacultyIcon icon={member.icon} />
                      )}
                    </div>
                    <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-[var(--ui-secondary)]">
                      {member.role}
                    </p>
                    <p className="font-display text-xl font-extrabold text-[var(--ui-primary)]">
                      {member.name}
                    </p>
                    <p className="mt-2 line-clamp-4 text-sm leading-6 text-[var(--ui-muted)]">
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mx-auto mt-10 max-w-xl rounded-xl border border-[var(--ui-border)] bg-white px-5 py-4 text-center shadow-sm">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600">Open Timings</p>
                <p className="mt-2 flex items-center justify-center gap-2 font-display text-xl font-extrabold text-[var(--ui-primary)]">
                  <Clock3 className="h-5 w-5 text-[var(--ui-secondary)]" />
                  {INSTITUTE.timingDisplay}
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display text-3xl font-extrabold sm:text-4xl text-[var(--ui-primary)]">Our Key Facilities</h2>
              <p className="mt-6 text-lg text-[var(--ui-muted)]">Everything you need to succeed in your computer education journey.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8 max-w-5xl mx-auto">
              {about.sections.map((item) => (
                <div key={item.title} className="text-center sm:text-left">
                  <h3 className="text-xl font-extrabold text-[var(--ui-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--ui-muted)] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function stripInstitutePrefix(value: string) {
  const prefix = `${INSTITUTE.name} `;
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function FacultyIcon({ icon }: { icon: string }) {
  if (icon === "users") return <Users className="h-12 w-12" />;
  return <GraduationCap className="h-12 w-12" />;
}
