"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";

type Item = { href: string; label: string };

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const menuId = `mobile-nav-${id}`;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] border border-white/20 bg-white/5 text-white shadow-sm hover:bg-white/10 transition-colors"
      >
        <span className="sr-only">Open menu</span>
        <span className="relative block h-4 w-5" aria-hidden="true">
          <span
            className={cx(
              "absolute left-0 top-0 h-0.5 w-5 rounded bg-[#e8b84b] transition-transform duration-200",
              open ? "translate-y-[7px] rotate-45" : "translate-y-0 rotate-0",
            )}
          />
          <span
            className={cx(
              "absolute left-0 top-[7px] h-0.5 w-5 rounded bg-[#e8b84b] transition-opacity duration-200",
              open ? "opacity-0" : "opacity-100",
            )}
          />
          <span
            className={cx(
              "absolute left-0 top-[14px] h-0.5 w-5 rounded bg-[#e8b84b] transition-transform duration-200",
              open ? "translate-y-[-7px] -rotate-45" : "translate-y-0 rotate-0",
            )}
          />
        </span>
      </button>

      <div
        className={cx(
          "fixed inset-0 z-40 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-[#1a1a2e]/50 backdrop-blur-[2px]" />
      </div>

      <div
        id={menuId}
        className={cx(
          "fixed left-0 right-0 z-50 top-[72px] origin-top transition-all duration-200",
          open
            ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none",
        )}
      >
        <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6">
          <div className="rounded-3xl border border-[#e8b84b]/15 bg-[#1a1a2e]/95 backdrop-blur shadow-[var(--shadow-card)] overflow-hidden">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cx(
                        "rounded-[var(--radius-control)] border px-3 py-3 text-sm font-semibold",
                        active
                          ? "border-[#e8b84b]/35 bg-white/10 text-[#e8b84b]"
                          : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/admission"
                  onClick={() => setOpen(false)}
                  className="rounded-[var(--radius-control)] bg-gradient-to-br from-[#e8b84b] to-[#c49a2a] px-3 py-3 text-center text-sm font-extrabold text-[#1a1a2e] hover:from-[#f5d080] hover:to-[#c49a2a]"
                >
                  Enroll Now
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="rounded-[var(--radius-control)] border border-white/20 bg-white/5 px-3 py-3 text-center text-sm font-semibold text-white/85 hover:bg-white/10"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

