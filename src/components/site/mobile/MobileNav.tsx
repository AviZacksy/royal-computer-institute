"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

type Item = { href: string; label: string; children?: Item[] };

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function MobileNav({ items }: { items: Item[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const menuId = `mobile-nav-${id}`;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-controls={menuId}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <span className="sr-only">Open menu</span>
        <Menu className="h-5 w-5" />
      </button>

      <div
        className={cx(
          "fixed inset-0 z-40 transition-opacity duration-200",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        )}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
      </div>

      <div
        id={menuId}
        className={cx(
          "fixed inset-y-0 right-0 z-50 w-[min(100%,320px)] bg-white shadow-2xl transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <span className="font-display text-lg font-bold text-gray-900">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span className="sr-only">Close menu</span>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 px-4 py-6">
            <div className="flex flex-col gap-2">
              {items.map((item) => {
                const active = pathname === item.href;
                return (
                  <div key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cx(
                        "block rounded-lg px-4 py-3.5 text-base font-bold transition-colors",
                        active
                          ? "bg-blue-50 text-[var(--ui-secondary)]"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                      )}
                    >
                      {item.label}
                    </Link>
                    {item.children?.length ? (
                      <div className="mt-1 grid gap-1 border-l-2 border-blue-100 pl-3">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="rounded-lg px-4 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-blue-50 hover:text-[var(--ui-secondary)]"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-gray-100 p-4">
            <div className="flex flex-col gap-3">
              <Link
                href="/student-login"
                onClick={() => setOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-gray-100 text-[15px] font-bold text-gray-900 hover:bg-gray-200 transition-colors"
              >
                Student Login
              </Link>
              <Link
                href="/admission"
                onClick={() => setOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-[var(--ui-accent)] text-[15px] font-extrabold text-[var(--ui-primary)] shadow-md transition-all hover:scale-[1.02]"
              >
                Student Admission
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
