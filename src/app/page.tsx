import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DemoAction } from "@/components/demo/DemoAction";
import { WHATSAPP_LINK } from "@/config/institute";
import Image from "next/image";
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
      <section className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white" />
          <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-amber-200/30 blur-2xl" />
          <div className="absolute -bottom-12 -right-10 h-48 w-48 rounded-full bg-blue-200/35 blur-2xl" />
          <div className="relative p-6 sm:p-10">
            <div className="flex justify-center">
              <div className="flex w-full max-w-3xl flex-col gap-4 lg:max-w-4xl">
                <div className="inline-flex w-fit max-w-full items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-900">
                  <span>🎓</span>
                  <span className="whitespace-normal break-words leading-tight">
                    {INSTITUTE.name}, {INSTITUTE.city}
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
                  Computer Courses &amp; Practical Training
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-blue-900/70 sm:text-base">
                  Online admission, student login, exam support and certificate services — all
                  in one professional institute website (demo).
                </p>

                <div className="grid gap-2 text-sm text-blue-950 sm:grid-cols-2">
                  {[
                    "Job-oriented courses",
                    "Practical lab training",
                    "Certificate apply & verification",
                    "Online services support",
                  ].map((x) => (
                    <div key={x} className="flex items-start gap-2">
                      <span className="mt-0.5">✅</span>
                      <span className="text-blue-900/85">{x}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid gap-3 sm:flex sm:flex-row sm:items-center">
                  <ButtonLink
                    href="/admission"
                    size="lg"
                    variant="accent"
                    className="w-full sm:w-auto"
                  >
                    Apply for Admission
                  </ButtonLink>
                  <ButtonLink
                    href="/courses"
                    size="lg"
                    variant="primary"
                    className="w-full sm:w-auto"
                  >
                    View Courses
                  </ButtonLink>
                  <ButtonAnchor
                    href={WHATSAPP_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="lg"
                    variant="whatsapp"
                    className="w-full sm:w-auto"
                  >
                    Contact on WhatsApp
                  </ButtonAnchor>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-blue-900/70">
                    Highlights
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-blue-950 sm:text-xl">
                    What you get at Royal Computer Institute
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 sm:grid-cols-4">
                {[
                  { t: "Practical Training", d: "Hands-on lab practice & projects", i: "🧑‍💻" },
                  { t: "Online Admission", d: "Simple online admission form (demo)", i: "🧾" },
                  { t: "Online Exam", d: "Exam login portal (demo)", i: "📝" },
                  { t: "Certificates", d: "Apply & verify certificates (demo)", i: "📄" },
                ].map((b) => (
                  <Card key={b.t} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-lg">
                          {b.i}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-blue-950 break-words leading-tight">
                            {b.t}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-blue-900/70">
                            {b.d}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-10 sm:py-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-blue-950 sm:text-2xl">
              Popular Courses
            </h2>
            <p className="mt-1 text-sm text-blue-900/70">
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
            <Card className="border border-blue-100 bg-white transition-shadow hover:shadow-md" key={c.name}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-900">
                        💻
                      </span>
                      <p className="text-base font-extrabold text-blue-950">{c.name}</p>
                    </div>
                    <p className="mt-2 text-sm text-blue-900/70 break-words">{c.desc}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="inline-flex rounded-full border border-blue-100 bg-white px-3 py-1 text-[11px] font-extrabold text-blue-900">
                      {c.dur}
                    </span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-blue-900/70">
                  <span className="rounded-full border border-blue-100 bg-white px-3 py-1">
                    Fee: {c.fee.monthly}
                  </span>
                  <span className="rounded-full border border-blue-100 bg-white px-3 py-1">
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
              <h2 className="text-xl font-extrabold text-blue-950 sm:text-2xl">
                Why Choose Us
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-900/70">
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
                    className="rounded-2xl border border-blue-100 bg-white p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-lg">
                        {x.i}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-blue-950">
                          {x.t}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-blue-900/70">
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
              <h2 className="text-xl font-extrabold text-blue-950 sm:text-2xl">
                Online Services
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-900/70">
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
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-lg">
                          {s.i}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-blue-950">
                            {s.t}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-blue-900/70">
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
                <h2 className="text-xl font-extrabold text-blue-950 sm:text-2xl">
                  Start Your Computer Learning Journey Today
                </h2>
                <p className="mt-2 text-sm leading-6 text-blue-900/70">
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
            <p className="text-xs font-extrabold uppercase tracking-widest text-blue-900/70">
              Video Gallery
            </p>
            <h2 className="mt-2 text-xl font-extrabold text-blue-950 sm:text-2xl">
              Institute Videos
            </h2>
            <p className="mt-1 text-sm text-blue-900/70">
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
