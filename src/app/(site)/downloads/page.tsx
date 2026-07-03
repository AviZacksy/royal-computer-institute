import Link from "next/link";
import { Award, BadgeCheck, BookOpen, Download, FileText, Info } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

const DOWNLOADS = [
  {
    title: "Notes",
    description: "Access course study notes from your student dashboard.",
    href: "/student/notes",
    icon: "notes",
  },
  {
    title: "Certificate",
    description: "Download issued certificates from student documents.",
    href: "/student/documents",
    icon: "certificate",
  },
  {
    title: "Prospectus",
    description: "Download the institute prospectus to learn about our courses and facilities.",
    href: "#",
    icon: "prospectus",
  },
  {
    title: "Offline Admission Form",
    description: "Download the offline admission form to fill out and submit at the center.",
    href: "#",
    icon: "form",
  },
];

export default function DownloadsPage() {
  return (
    <div className="w-full bg-[var(--ui-surface)]">
      <section className="mx-auto max-w-screen-xl px-4 py-16 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Student Downloads"
          title="Downloads"
          subtitle="Quick access to important student materials and issued documents."
          centered
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {DOWNLOADS.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-xl border border-[var(--ui-border)] bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[var(--ui-secondary)] transition-colors group-hover:bg-[var(--ui-secondary)] group-hover:text-white">
                  <DownloadCardIcon icon={item.icon} />
                </div>
                <h2 className="mt-5 font-display text-xl font-extrabold text-[var(--ui-primary)]">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[var(--ui-muted)]">
                  {item.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--ui-secondary)]">
                  Open
                  <Download className="h-4 w-4" />
                </span>
              </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function DownloadCardIcon({ icon }: { icon: string }) {
  const className = "h-6 w-6";
  if (icon === "certificate") return <Award className={className} />;
  if (icon === "id-card") return <BadgeCheck className={className} />;
  if (icon === "prospectus") return <Info className={className} />;
  if (icon === "form") return <FileText className={className} />;
  return <BookOpen className={className} />;
}
