import Image from "next/image";
import { Clock3, GraduationCap, Users } from "lucide-react";
import { INSTITUTE } from "@/config/institute";
import { SectionHeading } from "@/components/site/SectionHeading";

const FACULTY = [
  {
    role: "Director",
    name: INSTITUTE.directorName,
    description: "Academic leadership and institute operations.",
    image: "/about/Director.jpeg",
    icon: "graduation",
  },
  {
    role: "Managing Director",
    name: "Royal Computer Institute",
    description: "Admissions, administration, and student support.",
    image: null,
    icon: "users",
  },
  {
    role: "Teachers",
    name: "Expert Faculty Team",
    description: "Practical lab training, course guidance, and exam preparation.",
    image: null,
    icon: "graduation",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-[var(--ui-surface)] min-h-screen">
      <section className="py-12 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

        <div className="mx-auto max-w-screen-xl px-4 lg:px-8 relative z-10 space-y-24 sm:space-y-32">
          <div>
            <SectionHeading
              eyebrow="About Us"
              title={`Welcome to ${INSTITUTE.name}`}
              subtitle={`Bihar's premier computer training center dedicated to building professional careers through practical education.`}
              centered
            />
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-display text-3xl font-extrabold text-[var(--ui-primary)] sm:text-4xl mb-8">
              Our Mission
            </h2>
            <div className="prose prose-lg text-[var(--ui-muted)] prose-p:leading-relaxed mx-auto text-center">
              <p>
                <strong className="text-[var(--ui-secondary)] font-extrabold">{INSTITUTE.name}</strong> is a premier institute for Programming and Coding Classes located in {INSTITUTE.city}. We offer expert training in Python, Java, C, C++, Full-Stack Web Development, Data Analysis, Data Science, and AI.
              </p>
              <p className="mt-6">
                We believe that theoretical knowledge must be paired with hands-on practice. That&apos;s why our state-of-the-art computer labs are designed to provide every student with the independent practice time they need to master their chosen technologies and secure successful placements.
              </p>
            </div>

            <div className="mt-16 border-t border-[var(--ui-border)] pt-12">
              <SectionHeading
                eyebrow="Our Faculty"
                title="Guided by Experienced Educators"
                subtitle="Leadership and teachers focused on practical computer education."
                centered
              />

              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                {FACULTY.map((member) => (
                  <div key={member.role} className="rounded-xl border border-[var(--ui-border)] bg-white p-6 text-center shadow-sm">
                    <div className="mx-auto mb-5 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-blue-50 text-[var(--ui-secondary)] shadow-lg ring-1 ring-gray-100">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={128}
                          height={128}
                          className="h-full w-full object-cover"
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
                    <p className="mt-2 text-sm leading-6 text-[var(--ui-muted)]">
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
              {[
                { title: "Practical Lab Training", desc: "1:1 computer ratio for hands-on experience." },
                { title: "Online Admission Portal", desc: "Easy, paperless registration from anywhere." },
                { title: "Mock & Final Exams", desc: "Online portal to prepare for final certifications." },
                { title: "Govt. Recognized", desc: "Verifiable certificates useful for job placements." },
              ].map((item) => (
                <div key={item.title} className="text-center sm:text-left">
                  <h3 className="text-xl font-extrabold text-[var(--ui-primary)] mb-2">{item.title}</h3>
                  <p className="text-[var(--ui-muted)] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FacultyIcon({ icon }: { icon: string }) {
  if (icon === "users") return <Users className="h-12 w-12" />;
  return <GraduationCap className="h-12 w-12" />;
}
