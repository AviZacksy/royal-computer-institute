"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileQuestion,
  FileText,
  FolderOpen,
  GraduationCap,
  Home,
  Images,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  NotebookTabs,
  ReceiptText,
  School,
  Settings,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { INSTITUTE } from "@/config/institute";

export type PanelNavItem = {
  href: string;
  label: string;
  icon: string;
};

export function PanelShell({
  title,
  navItems,
  children,
  logoutAction,
}: {
  title: string;
  navItems: PanelNavItem[];
  children: React.ReactNode;
  logoutAction?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="grid gap-1.5">
      {navItems.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin/dashboard" &&
            item.href !== "/student/dashboard" &&
            pathname.startsWith(item.href));
        const Icon = getNavIcon(item);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              active
                ? "bg-blue-50 text-[var(--ui-secondary)] shadow-sm ring-1 ring-blue-100"
                : "text-slate-600 hover:bg-slate-50 hover:text-[var(--ui-primary)]"
            }`}
          >
            {active ? (
              <span className="absolute left-0 top-2 h-7 w-1 rounded-r-full bg-[var(--ui-secondary)]" />
            ) : null}
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition-colors ${
                active
                  ? "bg-[var(--ui-secondary)] text-white"
                  : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-[var(--ui-secondary)]"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[var(--ui-surface)]">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full shadow-sm">
              <Image src="/logo/logo.jpeg" alt="Institute Logo" fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
                {title}
              </p>
              <p className="truncate font-display text-lg font-extrabold text-[var(--ui-primary)]">
                {INSTITUTE.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-[var(--ui-primary)]"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Website</span>
            </Link>
            <div className="[&_button]:rounded-xl">{logoutAction}</div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl gap-6 px-4 py-6 lg:grid-cols-[280px_1fr] lg:px-6">
        <aside className="sticky top-[84px] hidden h-[calc(100vh-108px)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:block">
          <div className="mb-5 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Management Portal
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--ui-primary)]">
              Education + Technology
            </p>
          </div>
          {nav}
        </aside>

        <main className="min-w-0 pb-8">{children}</main>
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(320px,86vw)] flex-col border-r border-slate-200 bg-white p-4 shadow-2xl">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-sm">
                  <Image src="/logo/logo.jpeg" alt="Institute Logo" fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                    {title}
                  </p>
                  <p className="text-sm font-extrabold text-[var(--ui-primary)]">
                    Menu
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-y-auto pr-1">{nav}</div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}

function getNavIcon(item: PanelNavItem) {
  const key = `${item.href} ${item.label}`.toLowerCase();
  if (key.includes("dashboard")) return LayoutDashboard;
  if (key.includes("approval")) return ClipboardCheck;
  if (key.includes("student")) return Users;
  if (key.includes("course")) return GraduationCap;
  if (key.includes("fee")) return WalletCards;
  if (key.includes("payment")) return ReceiptText;
  if (key.includes("enquir")) return MessageSquareText;
  if (key.includes("gallery")) return Images;
  if (key.includes("question")) return FileQuestion;
  if (key.includes("exam")) return FileText;
  if (key.includes("document")) return FolderOpen;
  if (key.includes("note")) return NotebookTabs;
  if (key.includes("my fees")) return CreditCard;
  if (key.includes("my documents")) return Award;
  if (key.includes("my notes")) return BookOpen;
  if (key.includes("setting")) return Settings;
  return LayoutDashboard;
}
