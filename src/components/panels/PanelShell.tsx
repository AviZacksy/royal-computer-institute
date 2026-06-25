"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

  return (
    <div className="min-h-screen bg-[var(--ui-surface)]">
      <header className="border-b border-[var(--ui-border)] bg-white">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 lg:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
              {title}
            </p>
            <p className="font-display text-lg font-extrabold text-[var(--ui-primary)]">
              {INSTITUTE.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm font-semibold text-[var(--ui-muted)] hover:text-[var(--ui-primary)]"
            >
              ← Website
            </Link>
            {logoutAction}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-screen-2xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr] lg:px-6">
        <aside className="h-fit rounded-[var(--radius-card)] border border-[var(--ui-border)] bg-white p-3">
          <nav className="grid gap-1">
            {navItems.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  item.href !== "/student/dashboard" &&
                  pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-[var(--radius-control)] px-3 py-2.5 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-[var(--ui-primary)] text-white"
                      : "text-[var(--ui-text)] hover:bg-[var(--ui-surface)]"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
