import { PageShell } from "@/components/ui/Page";
import { INSTITUTE, WHATSAPP_LINK } from "@/config/institute";
import { ButtonAnchor } from "@/components/ui/Button";

export default function AboutPage() {
  return (
    <PageShell
      title="About Us"
      subtitle={`Learn about ${INSTITUTE.name} — Bihar's premier computer training center.`}
    >
      <div className="grid gap-6 text-sm leading-7 text-[var(--ui-text)]">
        <p>
          <strong>{INSTITUTE.name}</strong> is located in {INSTITUTE.city} and offers job-oriented
          computer courses with practical lab training. We help students build skills in office
          applications, accounting, design, typing, and government exam preparation.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[var(--radius-card)] border border-[var(--ui-border)] bg-[var(--ui-surface)] p-5">
            <p className="font-extrabold text-[var(--ui-primary)]">Director</p>
            <p className="mt-1">{INSTITUTE.directorName}</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-[var(--ui-border)] bg-[var(--ui-surface)] p-5">
            <p className="font-extrabold text-[var(--ui-primary)]">Timings</p>
            <p className="mt-1">{INSTITUTE.timingDisplay}</p>
          </div>
        </div>
        <ul className="grid gap-2">
          {["Practical lab training", "Online admission & student portal", "Mock & final MCQ exams", "Certificate & marksheet support"].map((item) => (
            <li key={item} className="flex gap-2"><span>✅</span><span>{item}</span></li>
          ))}
        </ul>
        <ButtonAnchor href={WHATSAPP_LINK} variant="whatsapp" className="w-fit">Contact on WhatsApp</ButtonAnchor>
      </div>
    </PageShell>
  );
}
