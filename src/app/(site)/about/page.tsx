import Image from "next/image";
import { INSTITUTE } from "@/config/institute";
import { SectionHeading } from "@/components/site/SectionHeading";

export default function AboutPage() {
  return (
    <div className="w-full bg-[var(--ui-surface)] min-h-screen">
      <section className="py-12 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
        
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8 relative z-10 space-y-24 sm:space-y-32">
          
          {/* Header Area */}
          <div>
            <SectionHeading
              eyebrow="About Us"
              title={`Welcome to ${INSTITUTE.name}`}
              subtitle={`Bihar's premier computer training center dedicated to building professional careers through practical education.`}
              centered
            />
          </div>

          {/* Story Area */}
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
            
            <div className="mt-16 pt-12 border-t border-[var(--ui-border)] flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-24 text-center">
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-4 sm:mb-6 rounded-full overflow-hidden shadow-lg border-4 border-white ring-1 ring-gray-100">
                  <Image 
                    src="/about/Director.jpeg" 
                    alt={INSTITUTE.directorName} 
                    fill 
                    className="object-cover" 
                  />
                </div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--ui-secondary)] mb-2 sm:mb-3">Director</p>
                <p className="font-display text-xl sm:text-2xl font-extrabold text-[var(--ui-primary)]">{INSTITUTE.directorName}</p>
              </div>

              <div className="hidden sm:block w-px h-16 bg-[var(--ui-border)]"></div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-600 mb-3">Open Timings</p>
                <p className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">🕒 {INSTITUTE.timingDisplay}</p>
              </div>
            </div>
          </div>

          {/* Facilities Area */}
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
                { title: "Govt. Recognized", desc: "Verifiable certificates useful for job placements." }
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
