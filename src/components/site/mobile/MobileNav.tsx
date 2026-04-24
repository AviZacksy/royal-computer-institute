"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

type Item = { href: string; label: string };

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const menuId = `mobile-nav-${id}`;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-200 bg-white text-blue-900 shadow-sm hover:bg-blue-50"
      >
        <span className="sr-only">Open menu</span>
        <span className="text-lg leading-none">{open ? "✕" : "☰"}</span>
      </button>

      <div
        id={menuId}
        className={cx(
          "absolute left-0 right-0 top-16 border-b border-blue-100 bg-white shadow-sm",
          open ? "block" : "hidden",
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            {items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "rounded-2xl border px-3 py-3 text-sm font-semibold",
                    active
                      ? "border-blue-200 bg-blue-50 text-blue-950"
                      : "border-blue-100 bg-white text-blue-900 hover:bg-blue-50",
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
              className="rounded-2xl bg-amber-400 px-3 py-3 text-center text-sm font-extrabold text-amber-950 hover:bg-amber-500"
            >
              Admission Open
            </Link>
            <Link
              href="/contact"
              className="rounded-2xl border border-blue-200 bg-white px-3 py-3 text-center text-sm font-semibold text-blue-900 hover:bg-blue-50"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

