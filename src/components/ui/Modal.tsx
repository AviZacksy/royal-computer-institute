"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

type ModalProps = {
  triggerText: string;
  triggerVariant?: "primary" | "secondary" | "outline" | "accent";
  children: React.ReactNode;
};

export function Modal({ triggerText, triggerVariant = "primary", children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant={triggerVariant} onClick={() => setIsOpen(true)}>
        {triggerText}
      </Button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="relative my-8 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-[var(--ui-muted)] shadow-sm transition hover:bg-slate-50 hover:text-[var(--ui-primary)]"
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}
