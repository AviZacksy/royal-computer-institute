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
    <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-blue-950">
            Demo Mode
          </p>
          <p className="text-sm font-semibold text-blue-900/70">
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
        <div className="rounded-2xl border border-blue-100 bg-white p-4 text-sm font-extrabold text-blue-950 shadow-sm">
          {message}
        </div>
      </div>
    </div>
  );
}

