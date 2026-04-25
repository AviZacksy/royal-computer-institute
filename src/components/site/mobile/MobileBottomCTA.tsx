"use client";

import { ButtonAnchor, ButtonLink } from "@/components/ui/Button";

export function MobileBottomCTA() {
  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[#e8b84b]/15 bg-[#1a1a2e]/95 backdrop-blur">
      <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-3 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
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

