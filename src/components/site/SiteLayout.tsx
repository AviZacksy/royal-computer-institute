import Link from "next/link";
import { NAV_ITEMS } from "@/components/site/nav";
import { MobileNav } from "@/components/site/mobile/MobileNav";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/85 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight text-blue-950"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
                RC
              </span>
              <span className="hidden sm:inline">Royal Computer Institute</span>
              <span className="sm:hidden">Royal CI</span>
            </Link>

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

            <div className="flex items-center gap-2">
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
      </header>

      <main className="flex-1 bg-gradient-to-b from-blue-50 via-white to-white">
        {children}
      </main>

      <footer className="border-t border-blue-100 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-blue-900/70">
              © {new Date().getFullYear()} Royal Computer Institute — Demo UI
            </p>
            <p className="text-sm text-blue-900/70">
              Developed by Avi Razput • Frontend only (demo)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

