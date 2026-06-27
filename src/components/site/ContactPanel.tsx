import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { DemoAction } from "@/components/demo/DemoAction";
import { DemoNotice } from "@/components/demo/DemoNotice";
import { INSTITUTE, WHATSAPP_LINK } from "@/config/institute";

const CONTACT_ITEMS = [
  {
    icon: "📍",
    label: "Address",
    value: INSTITUTE.addressLines.join(", "),
  },
  {
    icon: "📞",
    label: "Phone",
    value: INSTITUTE.phoneDisplay,
  },
  {
    icon: "✉️",
    label: "Email",
    value: INSTITUTE.email,
  },
  {
    icon: "🕒",
    label: "Timing",
    value: INSTITUTE.timingDisplay,
  },
];

export function ContactPanel() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-stretch">
      {/* Left: Info */}
      <div className="flex flex-col gap-8">
        <div>
          <span className="text-sm font-extrabold text-[var(--ui-secondary)] tracking-[0.25em] uppercase block mb-3">
            Get In Touch
          </span>
          <h2 className="font-display text-3xl font-extrabold text-[var(--ui-primary)] sm:text-4xl">
            {INSTITUTE.name}
          </h2>
          <p className="mt-3 text-base text-[var(--ui-muted)] leading-relaxed">
            Directed by <span className="font-bold text-[var(--ui-primary)]">{INSTITUTE.directorName}</span>. 
            Visit us at our campus for a free counseling session, or reach out online.
          </p>
        </div>

        <div className="grid gap-4">
          {CONTACT_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-5 p-5 rounded-2xl bg-[var(--ui-surface)] border border-[var(--ui-border)] hover:border-[var(--ui-secondary)]/30 hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-[var(--ui-border)] text-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-extrabold uppercase tracking-widest text-[var(--ui-secondary)] mb-1">
                  {item.label}
                </p>
                <p className="text-base font-semibold text-[var(--ui-primary)] leading-relaxed break-words">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <ButtonLink
            href="/query"
            className="h-12 px-6 rounded-full text-sm font-bold bg-[var(--ui-primary)] text-white shadow-lg hover:scale-105 transition-all inline-flex items-center justify-center"
          >
            Send a Query
          </ButtonLink>
          <ButtonAnchor
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            className="h-12 px-6 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-all inline-flex items-center justify-center bg-[#25D366] text-white border-none"
          >
            WhatsApp Us
          </ButtonAnchor>
          <DemoAction
            label="Call Now"
            variant="outline"
            fullWidthOnMobile={false}
          />
        </div>

        <DemoNotice />
      </div>

      {/* Right: Map placeholder */}
      <div className="min-h-[400px] rounded-[2.5rem] bg-[var(--ui-surface)] border border-[var(--ui-border)] overflow-hidden relative flex flex-col group">
        <div className="px-8 pt-8 pb-6 border-b border-[var(--ui-border)] bg-white">
          <p className="font-display text-xl font-extrabold text-[var(--ui-primary)]">Our Location</p>
          <p className="mt-1 text-sm text-[var(--ui-muted)]">Visit us at our campus — {INSTITUTE.city}</p>
        </div>
        <div className="flex-1 bg-[var(--ui-surface)] relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="absolute inset-0 grid place-items-center p-6">
            <div className="bg-white rounded-2xl border border-[var(--ui-border)] p-8 text-center shadow-xl max-w-xs w-full group-hover:-translate-y-2 transition-transform duration-500">
              <span className="text-5xl block mb-4">🗺️</span>
              <p className="font-display text-lg font-extrabold text-[var(--ui-primary)]">Map Placeholder</p>
              <p className="text-sm text-[var(--ui-muted)] mt-2 leading-relaxed">
                Google Maps will be embedded here in the production build.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
