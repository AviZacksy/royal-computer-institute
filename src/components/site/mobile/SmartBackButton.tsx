"use client";

import { usePathname, useRouter } from "next/navigation";

export function SmartBackButton() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push("/");
      }}
      className="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-control)] border border-white/20 bg-white/5 text-white shadow-sm hover:bg-white/10 transition-colors"
      aria-label="Go back"
    >
      <span aria-hidden="true" className="text-lg leading-none">
        ←
      </span>
    </button>
  );
}

