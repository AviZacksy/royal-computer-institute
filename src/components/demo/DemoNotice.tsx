"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";

export function DemoNotice({
  message = "This feature will be activated in the full system.",
}: {
  message?: string;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const noticeId = `notice-${id}`;

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-zinc-900 dark:text-white">
            Demo Mode
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Buttons/forms are UI-only in this demo.
          </p>
        </div>
        <Button
          variant="secondary"
          aria-controls={noticeId}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide message" : "Click to test"}
        </Button>
      </div>

      <div
        id={noticeId}
        className={open ? "mt-4" : "sr-only"}
        aria-live="polite"
      >
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm font-medium text-zinc-900 shadow-sm dark:border-white/10 dark:bg-zinc-950 dark:text-white">
          {message}
        </div>
      </div>
    </div>
  );
}

