"use client";

import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";

export function MobileBottomCTA() {
  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-blue-100 bg-white/95 backdrop-blur">
      <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-3">
        <div className="grid grid-cols-2 gap-2">
          <ButtonLink href="/admission" variant="accent" className="w-full">
            Apply Now
          </ButtonLink>
          <ButtonAnchor
            href="https://wa.me/910000000000"
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            className="w-full"
          >
            WhatsApp
          </ButtonAnchor>
        </div>
      </div>
    </div>
  );
}

