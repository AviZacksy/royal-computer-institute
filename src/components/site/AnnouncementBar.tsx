import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";
import { INSTITUTE, WHATSAPP_LINK } from "@/config/institute";

export function AnnouncementBar() {
  return (
    <div className="hidden sm:block border-b border-blue-100 bg-blue-950 text-white">
      <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6">
        <div className="flex flex-col gap-2 py-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-semibold tracking-wide text-white/90">
            <span className="inline-flex max-w-full truncate whitespace-nowrap">
              Admission Open for Computer Courses • Call {INSTITUTE.phoneDisplay}
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <ButtonAnchor
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="sm"
            >
              WhatsApp
            </ButtonAnchor>
            <ButtonLink href="/contact" variant="secondary" size="sm">
              Contact
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}

