import Link from "next/link";
import { NAV_ITEMS } from "@/components/site/nav";
import { MobileNav } from "@/components/site/mobile/MobileNav";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { INSTITUTE } from "@/config/institute";
import { SmartBackButton } from "@/components/site/mobile/SmartBackButton";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="fixed top-0 inset-x-0 z-50 sm:sticky">
        <AnnouncementBar />
        <div className="border-b border-blue-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6">
          <div className="flex min-h-16 items-center justify-between gap-2 py-3">
            <div className="flex items-center gap-2 min-w-0">
              <SmartBackButton />
            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 font-semibold tracking-tight text-blue-950"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
                RC
              </span>
              <span className="hidden min-w-0 sm:inline">
                <span className="block max-w-[240px] whitespace-normal break-words leading-tight sm:max-w-[360px]">
                  Royal Computer Institute
                </span>
              </span>
              <span className="sm:hidden min-w-0">
                <span className="block max-w-[210px] whitespace-normal break-words leading-tight text-[13px] font-extrabold">
                  Royal Computer Institute
                </span>
              </span>
            </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-blue-900 hover:bg-blue-50 hover:text-blue-950"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/admission"
                className="hidden sm:inline-flex rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-amber-950 hover:bg-amber-500"
              >
                Admission Open
              </Link>
              <Link
                href="/contact"
                className="hidden sm:inline-flex rounded-full border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50"
              >
                Contact
              </Link>
              <MobileNav items={NAV_ITEMS} />
            </div>
          </div>
        </div>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-blue-50 via-white to-white pt-20 sm:pt-0">
        {children}
      </main>

      <footer className="border-t border-blue-100 bg-blue-950 text-white">
        <div className="relative">
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] [background-size:18px_18px]" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="relative mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-10">
            <div className="grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-sm font-extrabold text-blue-950">
                    RC
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-extrabold tracking-tight">
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
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-extrabold text-white/90"
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
                        <Link className="text-white/80 hover:text-white" href={i.href}>
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
                        <Link className="text-white/80 hover:text-white" href={i.href}>
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

