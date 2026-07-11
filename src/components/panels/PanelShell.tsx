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
  section?: string;
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

  const renderNavItems = (items: PanelNavItem[]) =>
    items.map((item) => {
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
            className={`group relative flex min-h-11 items-center gap-3.5 rounded-lg px-4 py-2.5 text-[15px] font-medium transition-all ${
              active
                ? "bg-[#5438FF] text-white shadow-md"
                : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
            }`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`} />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      });

  const groupedNav = navItems.reduce<Array<{ title?: string; items: PanelNavItem[] }>>((groups, item) => {
    const last = groups[groups.length - 1];
    if (last && last.title === item.section) {
      last.items.push(item);
    } else {
      groups.push({ title: item.section, items: [item] });
    }
    return groups;
  }, []);

  const nav = (
    <nav className="grid gap-4">
      {groupedNav.map((group, index) => (
        <div key={`${group.title ?? "main"}-${index}`} className="grid gap-1.5">
          {group.title ? (
            <p className="px-3 pt-2 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              {group.title}
            </p>
          ) : null}
          {renderNavItems(group.items)}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen flex-col bg-[var(--ui-surface)]">
      {/* Full-width Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white shadow-sm">
        <div className="flex h-16 items-center justify-between gap-4 px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full shadow-sm">
              <Image src="/logo/logo.jpeg" alt="Institute Logo" fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ui-muted)]">
                {title}
              </p>
              <p className="truncate font-display text-base font-extrabold text-[var(--ui-primary)]">
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

      {/* Main Layout Area */}
      <div className="flex flex-1">
        {/* Desktop Sidebar (Flushed to left, no gaps) */}
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] w-[280px] shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-[#0f172a] lg:flex">
          <div className="flex-1 p-4">
            {nav}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-x-hidden p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation overlay"
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-[min(320px,86vw)] flex-col border-r border-slate-800 bg-[#0f172a] shadow-2xl">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-4">
              <div className="flex items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full shadow-sm bg-white">
                  <Image src="/logo/logo.jpeg" alt="Institute Logo" fill className="object-cover" />
                </div>
                <p className="font-display text-sm font-extrabold text-white">
                  Menu
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">{nav}</div>
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
