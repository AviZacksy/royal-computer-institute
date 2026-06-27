import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { NAV_ITEMS } from "@/components/site/nav";
import { MobileNav } from "@/components/site/mobile/MobileNav";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { INSTITUTE, WHATSAPP_LINK } from "@/config/institute";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex-1 w-full flex flex-col bg-white">
      <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white shadow-md border-b border-gray-200">
        <AnnouncementBar />
        <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-8">
          <div className="flex h-[88px] items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                <Image src="/logo/logo.jpeg" alt={INSTITUTE.name} width={48} height={48} className="rounded-full shadow-sm border border-white/20 object-cover" />
                <span className="min-w-0 block">
                  <span className="block font-display text-sm sm:text-[22px] font-black leading-tight text-gray-900 tracking-normal truncate">
                    {INSTITUTE.name}
                  </span>
                  <span className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[13px] font-medium text-gray-500 mt-0.5">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">Bhawanipur Zirat, infront of stone clinic motihari</span>
                  </span>
                </span>
              </Link>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-[18px] font-bold text-gray-700 transition-colors hover:text-gray-900 relative group py-2"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/student-login"
                className="hidden sm:inline-flex items-center justify-center h-12 px-6 rounded-full bg-gray-100 text-[15px] font-bold text-gray-900 hover:bg-gray-200 transition-all"
              >
                Student Login
              </Link>
              <Link
                href="/student/register"
                className="hidden sm:inline-flex items-center justify-center h-12 px-7 rounded-full bg-[var(--ui-accent)] text-[15px] font-extrabold text-[var(--ui-primary)] shadow-xl shadow-[var(--ui-accent)]/20 hover:scale-105 transition-all"
              >
                Apply Now
              </Link>
              <MobileNav items={NAV_ITEMS} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full flex flex-col pt-[88px] sm:pt-[124px]">

        
        {children}
      </main>

      <footer className="bg-[#0f172a] text-slate-300 border-t border-slate-800">
        <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 lg:px-8 lg:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.25fr]">
            <div className="space-y-5">
              <Link href="/" className="inline-flex items-center gap-3">
                <Image
                  src="/logo/logo.jpeg"
                  alt={INSTITUTE.name}
                  width={52}
                  height={52}
                  className="rounded-full border border-white/10 object-cover"
                />
                <span>
                  <span className="block font-display text-xl font-black text-white">
                    {INSTITUTE.name}
                  </span>
                  <span className="block text-sm font-semibold text-[var(--ui-accent)]">
                    Computer education in {INSTITUTE.city}
                  </span>
                </span>
              </Link>
              <p className="max-w-md text-sm leading-7 text-slate-400">
                Practical computer training, career-focused courses, exam support,
                and student services from admission to certification.
              </p>
              <div className="flex flex-wrap gap-3 text-sm font-bold">
                <Link
                  href="/student/register"
                  className="rounded-md bg-[var(--ui-accent)] px-4 py-2 text-[var(--ui-primary)] transition hover:bg-yellow-400"
                >
                  Apply Now
                </Link>
                <Link
                  href="/student-login"
                  className="rounded-md border border-slate-700 px-4 py-2 text-white transition hover:border-slate-500 hover:bg-white/5"
                >
                  Student Login
                </Link>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <ul className="space-y-3 text-sm font-semibold">
                {[
                  { label: "Home", href: "/" },
                  { label: "About", href: "/about" },
                  { label: "Courses", href: "/courses" },
                  { label: "Gallery", href: "/gallery" },
                  { label: "Contact", href: "/contact" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">
                Student Services
              </h3>
              <ul className="space-y-3 text-sm font-semibold">
                {[
                  { label: "Admission", href: "/admission" },
                  { label: "Exam Registration", href: "/exam-registration" },
                  { label: "Fee Payment", href: "/fee-paid" },
                  { label: "Certificate", href: "/certificate" },
                ].map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-black uppercase tracking-wider text-white">
                Contact
              </h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[var(--ui-accent)]" />
                  <span>{INSTITUTE.addressLines.join(", ")}</span>
                </li>
                <li className="flex gap-3">
                  <Phone className="h-5 w-5 shrink-0 text-[var(--ui-accent)]" />
                  <a href={`tel:${INSTITUTE.phoneE164}`} className="transition hover:text-white">
                    {INSTITUTE.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MessageCircle className="h-5 w-5 shrink-0 text-[var(--ui-accent)]" />
                  <a href={WHATSAPP_LINK} className="transition hover:text-white">
                    {INSTITUTE.whatsappDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-[var(--ui-accent)]" />
                  <a href={`mailto:${INSTITUTE.email}`} className="break-all transition hover:text-white">
                    {INSTITUTE.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {new Date().getFullYear()} {INSTITUTE.name}. All rights reserved.</p>
            <div className="flex flex-wrap gap-4 font-semibold">
              <Link href="https://www.facebook.com/share/1HGd4tLzyo/" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Facebook
              </Link>
              <Link href="https://www.instagram.com/royal_computer_institute.01?igsh=eDFqam5obW5hd3V6" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                Instagram
              </Link>
              <Link href="https://youtube.com/@royal.computer_motihari?si=t_13Zejkgau3AqDy" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                YouTube
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
