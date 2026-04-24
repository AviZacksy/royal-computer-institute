"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";

const DEFAULT_MESSAGE = "This feature will be activated in the full system.";

export function DemoAction({
  label,
  message = DEFAULT_MESSAGE,
  variant = "outline",
  fullWidthOnMobile = true,
}: {
  label: string;
  message?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  fullWidthOnMobile?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const panelId = `demo-action-${id}`;

  return (
    <div>
      <Button
        type="button"
        variant={variant}
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={fullWidthOnMobile ? "w-full sm:w-auto" : undefined}
      >
        {label}
      </Button>

      {open ? (
        <div
          id={panelId}
          className="mt-3 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-semibold text-blue-950"
          role="status"
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}

