import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoAction } from "@/components/demo/DemoAction";
import { WHATSAPP_LINK } from "@/config/institute";
import { VideoStrip } from "@/components/media/VideoStrip";
import { INSTITUTE } from "@/config/institute";

const INSTITUTE_VIDEOS = [
  {
    title: "Coaching Video (Institute)",
    subtitle: "Short overview video",
    src: "/Video/Coching%20video/video_2026-04-24_17-53-58.mp4",
  },
  {
    title: "Institute Ad Video 1",
    subtitle: "Promo (demo media)",
    src: "/Video/Ads/video_2026-04-24_17-53-41.mp4",
  },
  {
    title: "Institute Ad Video 2",
    subtitle: "Promo (demo media)",
    src: "/Video/Ads/video_2026-04-24_17-53-53.mp4",
  },
] as const;

export default function Home() {
  return (
    <div>
      <section className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 pt-6 pb-10 sm:pt-10 sm:pb-14">
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--ui-border)] bg-white shadow-[var(--shadow-card)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[var(--ui-surface)] via-white to-white" />
          <div className="relative p-6 sm:p-10 lg:p-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="flex flex-col gap-6">
                <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-[var(--ui-border)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--ui-primary)] shadow-sm">
                  <span>🎓</span>
                  <span className="whitespace-normal break-words leading-tight">
                    {INSTITUTE.name}, {INSTITUTE.city}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <h1 className="font-display text-4xl font-extrabold tracking-tight text-[var(--ui-text)] sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
                    Build Your Computer Skills with Practical Training
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-[var(--ui-muted)] sm:text-lg sm:leading-8">
                    Job-oriented computer courses, online admission, exam support and certificate services in one place.
                  </p>
                </div>

                <div className="grid gap-3 text-sm font-semibold text-[var(--ui-text)] sm:grid-cols-2">
                  {[
                    "Job-oriented courses",
                    "Practical lab training",
                    "Certificate & verification",
                    "Online exam portal",
                  ].map((x) => (
                    <div key={x} className="flex items-center gap-2.5">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--ui-accent)]/20 text-[10px] text-[var(--ui-primary)]">
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>{x}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 flex flex-col sm:flex-row gap-3">
                  <ButtonLink
                    href="/student/register"
                    size="lg"
                    variant="accent"
                    className="w-full sm:w-auto font-bold shadow-sm"
                  >
                    Apply for Admission →
                  </ButtonLink>
                  <ButtonLink
                    href="/courses"
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto font-bold bg-white"
                  >
                    View Courses
                  </ButtonLink>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-md lg:max-w-none lg:pl-8">
                <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--ui-accent)]/20 to-[var(--ui-primary)]/10 rounded-[var(--radius-card)] blur-2xl" />
                
                <div className="relative grid gap-4 sm:grid-cols-2">
                  <div className="space-y-4">
                    <Card className="bg-[var(--ui-primary)] text-white shadow-xl shadow-[var(--ui-primary)]/20 border-none relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:14px_24px]" />
                      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl transition-all group-hover:scale-150 duration-500" />
                      <CardContent className="p-6 relative">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-2xl shadow-inner border border-white/10">
                          🧑‍💻
                        </div>
                        <h3 className="mt-5 font-display text-lg font-bold tracking-tight">Practical Lab Training</h3>
                        <p className="mt-2 text-[13px] text-white/80 leading-relaxed">
                          Master skills with hands-on practice in our modern computer labs.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-white shadow-lg shadow-black/5 border-[var(--ui-border)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-5 text-5xl transition-transform group-hover:scale-110 duration-500">🧾</div>
                      <CardContent className="p-6">
                        <h3 className="font-display text-base font-bold text-[var(--ui-text)]">Online Admission</h3>
                        <div className="mt-4 space-y-2.5">
                          <div className="h-2 w-full rounded-full bg-[var(--ui-surface)]"></div>
                          <div className="h-2 w-2/3 rounded-full bg-[var(--ui-surface)]"></div>
                        </div>
                        <div className="mt-5 flex items-center justify-between text-xs font-semibold text-[var(--ui-primary)] bg-[var(--ui-surface)]/50 px-3 py-2 rounded-lg">
                          <span>Process simple</span>
                          <span className="text-[var(--ui-accent)] text-lg leading-none">→</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4 sm:mt-8">
                     <Card className="bg-white shadow-lg shadow-black/5 border-[var(--ui-border)] relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-5 text-5xl transition-transform group-hover:scale-110 duration-500">📄</div>
                      <CardContent className="p-6">
                         <h3 className="font-display text-base font-bold text-[var(--ui-text)]">Verified Certificates</h3>
                         <div className="mt-4 flex items-center gap-3 bg-[var(--ui-surface)]/50 p-3 rounded-xl border border-[var(--ui-border)]/50">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--ui-accent)]/20 text-[var(--ui-primary)]">
                              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="text-[13px] font-medium text-[var(--ui-text)]">Authentic Verification</div>
                         </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-[#1a1a2e] text-white shadow-xl shadow-[#1a1a2e]/20 relative overflow-hidden border-none group hover:-translate-y-1 transition-transform duration-300">
                       <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[var(--ui-accent)]/20 blur-2xl transition-all group-hover:scale-150 duration-500" />
                      <CardContent className="p-6 relative">
                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-2xl border border-white/5 backdrop-blur-sm">
                          🎓
                        </div>
                        <h3 className="mt-5 font-display text-lg font-bold tracking-tight">Expert Faculty</h3>
                        <p className="mt-2 text-[13px] text-white/70 leading-relaxed">
                          Learn directly from experienced professionals.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-extrabold text-royal sm:text-2xl">
              Popular Courses
            </h2>
            <p className="mt-1 text-sm text-muted">
              Job-focused computer courses for students and beginners.
            </p>
          </div>
          <ButtonLink href="/courses" variant="outline" className="hidden sm:inline-flex">
            View all
          </ButtonLink>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "ADCA",
              desc: "Advanced computer applications",
              dur: "12 Months (demo)",
              fee: { monthly: "₹—/month", total: "₹— total" },
            },
            {
              name: "DCA",
              desc: "Basics to intermediate computing",
              dur: "6 Months (demo)",
              fee: { monthly: "₹—/month", total: "₹— total" },
            },
            {
              name: "Tally",
              desc: "Accounts + GST basics (demo)",
              dur: "3 Months (demo)",
              fee: { monthly: "₹—/month", total: "₹— total" },
            },
            {
              name: "CCC",
              desc: "Computer concepts for beginners",
              dur: "3 Months (demo)",
              fee: { monthly: "₹—/month", total: "₹— total" },
            },
            {
              name: "Typing",
              desc: "Hindi/English typing practice",
              dur: "2 Months (demo)",
              fee: { monthly: "₹—/month", total: "₹— total" },
            },
            {
              name: "Graphic Designing",
              desc: "Design fundamentals + tools",
              dur: "6 Months (demo)",
              fee: { monthly: "₹—/month", total: "₹— total" },
            },
          ].map((c) => (
            <Card className="bg-white transition-shadow hover:shadow-md" key={c.name}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl border border-black/5 bg-section text-royal">
                        💻
                      </span>
                      <p className="text-base font-extrabold text-royal">{c.name}</p>
                    </div>
                    <p className="mt-2 text-sm text-muted break-words">{c.desc}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex rounded-full border border-black/5 bg-white px-3 py-1 text-[11px] font-extrabold text-royal">
                      {c.dur}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-muted">
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1">
                    Fee: {c.fee.monthly}
                  </span>
                  <span className="rounded-full border border-black/5 bg-white px-3 py-1">
                    {c.fee.total}
                  </span>
                </div>
                <div className="mt-4">
                  <DemoAction label="Enquire" variant="primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <ButtonLink href="/courses" variant="outline" className="w-full whitespace-nowrap">
            View all courses
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-10 sm:py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="font-display text-xl font-extrabold text-royal sm:text-2xl">
                Why Choose Us
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Trustworthy, local-institute friendly learning with clear guidance
                for students and parents.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { t: "Practical Lab Training", i: "🧑‍💻", d: "Hands-on practice" },
                  { t: "Experienced Faculty", i: "👨‍🏫", d: "Clear guidance" },
                  { t: "Job-Oriented Courses", i: "🎯", d: "Career focused" },
                  { t: "Affordable Fees", i: "💰", d: "Value for money" },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="rounded-[var(--radius-card)] border border-black/5 bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-[var(--radius-control)] bg-section text-lg">
                        {x.i}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-royal">
                          {x.t}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-muted">
                          {x.d}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="font-display text-xl font-extrabold text-royal sm:text-2xl">
                Online Services
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Quick access (demo).
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {[
                  { t: "Online Admission", h: "/admission", i: "🧾", d: "Apply online (demo)" },
                  { t: "Student Login", h: "/student-login", i: "🔐", d: "Student portal (demo)" },
                  { t: "Online Exam", h: "/exam-login", i: "📝", d: "Exam portal (demo)" },
                  { t: "Certificate", h: "/certificate", i: "📄", d: "Apply / verify (demo)" },
                ].map((s) => (
                  <Card key={s.t} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-[var(--radius-control)] bg-section text-lg">
                          {s.i}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-royal">
                            {s.t}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-muted">
                            {s.d}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <ButtonLink href={s.h} variant="outline" className="w-full">
                          Open
                        </ButtonLink>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 pb-14 sm:pb-16">
        <Card className="overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="font-display text-xl font-extrabold text-royal sm:text-2xl">
                  Start Your Computer Learning Journey Today
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Talk to us for course guidance, admission details, fee status, and
                  certificate support.
                </p>
              </div>
              <div className="grid gap-3 sm:flex sm:justify-end">
                <ButtonLink
                  href="/admission"
                  size="lg"
                  variant="accent"
                  className="w-full sm:w-auto"
                >
                  Apply Now
                </ButtonLink>
                <ButtonLink
                  href="/contact"
                  size="lg"
                  variant="primary"
                  className="w-full sm:w-auto"
                >
                  Call Now
                </ButtonLink>
                <ButtonAnchor
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="lg"
                  variant="whatsapp"
                  className="w-full sm:w-auto"
                >
                  WhatsApp
                </ButtonAnchor>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 pb-14 sm:pb-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted">
              Video Gallery
            </p>
            <h2 className="mt-2 font-display text-xl font-extrabold text-royal sm:text-2xl">
              Institute Videos
            </h2>
            <p className="mt-1 text-sm text-muted">
              Official institute videos and coaching promos (embedded).
            </p>
          </div>
          <ButtonLink href="/gallery" variant="outline" className="hidden sm:inline-flex">
            View all
          </ButtonLink>
        </div>

        <div className="mt-6">
          <VideoStrip videos={[...INSTITUTE_VIDEOS]} mobileAspect="video" desktopAspect="reel" />
        </div>

        <div className="mt-6 sm:hidden">
          <ButtonLink href="/gallery" variant="outline" className="w-full">
            View all videos
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
