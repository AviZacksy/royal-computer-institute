import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";

export default function AdmissionPage() {
  const steps = [
    {
      s: "01",
      t: "Register Online",
      d: "Fill out the online registration form with your basic personal details to create your student account. Takes less than 5 minutes.",
      icon: "🖊️",
    },
    {
      s: "02",
      t: "Select Your Course",
      d: "Browse our latest job-oriented course catalog. Choose the program that best fits your career ambitions.",
      icon: "📚",
    },
    {
      s: "03",
      t: "Pay Your Fees",
      d: "Make a secure online fee payment through our integrated payment gateway. Receipts are generated automatically.",
      icon: "💳",
    },
    {
      s: "04",
      t: "Start Learning",
      d: "Once payment is confirmed, your admission is complete. Access your student dashboard and begin your journey immediately.",
      icon: "🎓",
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-[var(--ui-surface)] py-12 sm:py-32 border-b border-[var(--ui-border)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 relative z-10 text-center">
          <span className="text-sm font-extrabold text-[var(--ui-secondary)] tracking-[0.25em] uppercase mb-5 block">
            Get Started
          </span>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-[var(--ui-primary)] sm:text-7xl max-w-4xl mx-auto">
            Admission Process
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-[var(--ui-muted)] max-w-2xl mx-auto leading-relaxed">
            Enrolling at Royal Computer Institute is fully online, simple, and takes just a few minutes.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="bg-white py-12 sm:py-32">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8">
          <div className="relative">
            {/* Vertical connecting line - desktop only */}
            <div className="absolute left-[3.5rem] top-16 bottom-16 w-px bg-gradient-to-b from-[var(--ui-secondary)] via-[var(--ui-secondary)]/50 to-transparent hidden lg:block" />

            <div className="space-y-10">
              {steps.map((step, i) => (
                <div key={step.s} className="group relative flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
                  {/* Step Number Bubble */}
                  <div className="flex-shrink-0 flex flex-col items-center z-10">
                    <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-[var(--ui-primary)] to-[var(--ui-secondary)] text-white flex flex-col items-center justify-center shadow-2xl shadow-[var(--ui-primary)]/20 group-hover:scale-105 transition-transform duration-500">
                      <span className="text-3xl mb-1">{step.icon}</span>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/60">{step.s}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-[var(--ui-surface)] rounded-[2rem] p-8 sm:p-10 border border-[var(--ui-border)] group-hover:shadow-lg group-hover:border-[var(--ui-secondary)]/20 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute top-6 right-6 text-[120px] font-display font-extrabold text-[var(--ui-primary)]/[0.04] leading-none select-none">
                      {i + 1}
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[var(--ui-primary)] mb-4 relative z-10">
                      {step.t}
                    </h3>
                    <p className="text-base sm:text-lg text-[var(--ui-muted)] leading-relaxed relative z-10 max-w-2xl">
                      {step.d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Block */}
      <section className="bg-[var(--ui-primary)] py-12 sm:py-28 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--ui-secondary)]/30 rounded-full blur-[120px] -mt-[300px] -mr-[300px]" />
        
        <div className="mx-auto max-w-screen-xl px-4 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <h2 className="font-display text-4xl font-extrabold text-white sm:text-6xl max-w-3xl mb-6">
            Ready to Begin?
          </h2>
          <p className="text-lg text-white/70 max-w-xl mb-12 leading-relaxed">
            Admissions are open now. Click below to register and start the process in under 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <ButtonLink
              href="/student/register"
              className="w-full sm:w-auto h-16 px-12 rounded-full text-lg font-bold bg-white text-[var(--ui-primary)] shadow-2xl hover:scale-105 transition-all inline-flex items-center justify-center"
            >
              Start Admission Now →
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm text-white/50">
            Already registered?{" "}
            <Link href="/student-login" className="text-[var(--ui-accent)] font-bold hover:underline">
              Login to your dashboard
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
