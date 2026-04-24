import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-white to-white" />
          <div className="relative p-6 sm:p-10">
            <div className="flex flex-col gap-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-semibold text-blue-900">
                <span>🎓</span>
                <span>Professional Computer Training Institute</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
                Royal Computer Institute
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-blue-900/70 sm:text-base">
                Computer Courses, Online Admission, Exam &amp; Certificate Services
              </p>

              <div className="mt-2 grid gap-3 sm:flex sm:flex-row sm:items-center">
                <ButtonLink href="/admission" size="lg" variant="accent" className="w-full sm:w-auto">
                  Apply for Admission
                </ButtonLink>
                <ButtonLink href="/courses" size="lg" variant="primary" className="w-full sm:w-auto">
                  View Courses
                </ButtonLink>
                <ButtonAnchor
                  href="https://wa.me/910000000000"
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

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: "Practical Training", d: "Lab-based learning & projects", i: "🧑‍💻" },
                { t: "Certificate Support", d: "Apply & verify certificates", i: "📄" },
                { t: "Online Exam", d: "Exam login demo available", i: "📝" },
                { t: "Student Login", d: "Dashboard in full version", i: "🔐" },
              ].map((b) => (
                <Card key={b.t} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-50 text-lg">
                        {b.i}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-blue-950">{b.t}</p>
                        <p className="mt-1 text-xs leading-5 text-blue-900/70">{b.d}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
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
            { name: "ADCA", desc: "Advanced computer applications" },
            { name: "DCA", desc: "Basics to intermediate computing" },
            { name: "Tally", desc: "Accounts + GST basics (demo)" },
            { name: "CCC", desc: "Computer concepts for beginners" },
            { name: "Typing", desc: "Hindi/English typing practice" },
            { name: "Graphic Designing", desc: "Design fundamentals + tools" },
          ].map((c) => (
            <Card key={c.name} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <p className="text-base font-extrabold text-blue-950">{c.name}</p>
                <p className="mt-1 text-sm text-blue-900/70">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <ButtonLink href="/courses" variant="outline" className="w-full">
            View all courses
          </ButtonLink>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
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
              <ul className="mt-5 grid gap-3 text-sm text-blue-950">
                {[
                  "Small batch support & clear explanation",
                  "Practical lab sessions + practice tasks",
                  "Help for exam / certificate related services",
                  "Easy admission process (demo UI)",
                ].map((x) => (
                  <li key={x} className="flex items-start gap-2">
                    <span className="mt-0.5">✅</span>
                    <span className="text-blue-900/90">{x}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-xl font-extrabold text-blue-950 sm:text-2xl">
                Online Services (Demo)
              </h2>
              <p className="mt-2 text-sm leading-6 text-blue-900/70">
                All advanced actions show a demo activation message (no backend).
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  { t: "Admission Enquiry", h: "/query", i: "❓" },
                  { t: "Online Admission", h: "/admission", i: "🧾" },
                  { t: "Fee Paid", h: "/fee-paid", i: "💳" },
                  { t: "Exam Login", h: "/exam-login", i: "📝" },
                  { t: "Certificate Apply", h: "/certificate", i: "📄" },
                  { t: "Certificate Verification", h: "/certificate", i: "🔎" },
                ].map((s) => (
                  <ButtonLink
                    key={s.t}
                    href={s.h}
                    variant="secondary"
                    className="w-full justify-start gap-3 rounded-2xl"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white text-base">
                      {s.i}
                    </span>
                    <span className="text-left text-sm font-extrabold text-blue-950">
                      {s.t}
                    </span>
                  </ButtonLink>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-14 sm:pb-16">
        <Card className="overflow-hidden">
          <div className="p-6 sm:p-10">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-xl font-extrabold text-blue-950 sm:text-2xl">
                  Need help choosing a course?
                </h2>
                <p className="mt-2 text-sm leading-6 text-blue-900/70">
                  Contact us for guidance about course selection, admission, fees,
                  and certificate support.
                </p>
              </div>
              <div className="grid gap-3 sm:flex sm:justify-end">
                <ButtonLink href="/contact" size="lg" variant="primary" className="w-full sm:w-auto">
                  Contact Details
                </ButtonLink>
                <ButtonLink href="/admission" size="lg" variant="accent" className="w-full sm:w-auto">
                  Apply Now
                </ButtonLink>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
