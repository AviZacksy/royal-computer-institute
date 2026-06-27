import { ContactPanel } from "@/components/site/ContactPanel";

export default function ContactPage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="bg-[var(--ui-surface)] py-12 sm:py-32 border-b border-[var(--ui-border)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8 relative z-10 text-center">
          <span className="text-sm font-extrabold text-[var(--ui-secondary)] tracking-[0.25em] uppercase mb-5 block">
            Reach Us
          </span>
          <h1 className="font-display text-5xl font-extrabold tracking-tight text-[var(--ui-primary)] sm:text-7xl">
            Contact Us
          </h1>
          <p className="mt-8 text-lg sm:text-xl text-[var(--ui-muted)] max-w-xl mx-auto leading-relaxed">
            Have questions about admission, courses, or fees? We&apos;re happy to help.
          </p>
        </div>
      </section>

      {/* Panel */}
      <section className="bg-white py-12 sm:py-28">
        <div className="mx-auto max-w-screen-2xl px-4 lg:px-8">
          <ContactPanel />
        </div>
      </section>
    </div>
  );
}
