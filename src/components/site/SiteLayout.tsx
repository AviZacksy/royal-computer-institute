import Link from "next/link";
import { NAV_ITEMS } from "@/components/site/nav";
import { MobileNav } from "@/components/site/mobile/MobileNav";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { INSTITUTE } from "@/config/institute";
import { SmartBackButton } from "@/components/site/mobile/SmartBackButton";
import { MobileBottomCTA } from "@/components/site/mobile/MobileBottomCTA";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="fixed top-0 inset-x-0 z-50 sm:sticky">
        <AnnouncementBar />
        <div className="border-b border-[var(--ui-border)] bg-white">
          <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6">
            <div className="flex min-h-[72px] items-center justify-between gap-2 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <SmartBackButton />
                <Link href="/" className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--ui-surface)] text-lg">
                    👑
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-[15px] font-extrabold leading-tight text-[var(--ui-primary)] sm:text-base">
                      {INSTITUTE.name}
                    </span>
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ui-muted)] sm:text-[12px]">
                      Bihar&apos;s Premier Training Center
                    </span>
                  </span>
                </Link>
              </div>

              <nav className="hidden lg:flex items-center gap-6">
                {NAV_ITEMS.slice(0, 5).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-semibold tracking-wide text-[var(--ui-text)]/80 transition-colors hover:text-[var(--ui-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/admission"
                  className="hidden sm:inline-flex rounded-[var(--radius-control)] bg-[var(--ui-accent)] px-4 py-2 text-sm font-semibold text-[var(--ui-primary)] hover:bg-[#b89436]"
                >
                  Enroll Now →
                </Link>
                <Link
                  href="/contact"
                  className="hidden sm:inline-flex rounded-[var(--radius-control)] border border-[var(--ui-border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--ui-primary)] hover:bg-[var(--ui-surface)]"
                >
                  Contact
                </Link>
                <MobileNav items={NAV_ITEMS} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-white pt-20 pb-24 sm:pt-0 sm:pb-0">
        {children}
      </main>

      <MobileBottomCTA />

      <footer className="border-t border-[var(--ui-border)] bg-[var(--ui-primary)] text-white">
        <div className="relative">
          <div className="relative mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-10">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-lg">
                    👑
                  </div>
                  <div className="min-w-0">
                    <p className="font-display text-base font-extrabold tracking-tight text-white">
                      {INSTITUTE.name}
                    </p>
                    <p className="mt-1 text-sm text-white/75">{INSTITUTE.city}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-6 text-white/75">
                  Job-oriented computer courses with practical lab training, online
                  admission, exam support and certificate services.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {["Practical Training", "Online Services", "Certificate Support"].map((x) => (
                    <span
                      key={x}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white/85"
                    >
                      {x}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                    Quick Links
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm">
                    {NAV_ITEMS.slice(0, 5).map((i) => (
                      <li key={i.href}>
                        <Link className="text-white/75 hover:text-white" href={i.href}>
                          {i.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                    Services
                  </p>
                  <ul className="mt-4 grid gap-2 text-sm">
                    {NAV_ITEMS.slice(5, 10).map((i) => (
                      <li key={i.href}>
                        <Link className="text-white/75 hover:text-white" href={i.href}>
                          {i.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
                    Contact
                  </p>
                  <div className="mt-4 grid gap-2 text-sm text-white/80 break-words">
                    <p className="leading-6">📞 {INSTITUTE.phoneDisplay}</p>
                    <p className="leading-6 break-all">✉️ {INSTITUTE.email}</p>
                    <p className="leading-6">🕒 {INSTITUTE.timingDisplay}</p>
                    <p className="leading-6 break-words">📍 {INSTITUTE.addressLines.join(", ")}</p>
                    <p className="leading-6">📷 {INSTITUTE.instagramHandle}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-white/70">
                © {new Date().getFullYear()} {INSTITUTE.name}. All rights reserved.
              </p>
              <p className="text-xs text-white/70">Developed by Avi Razput</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

