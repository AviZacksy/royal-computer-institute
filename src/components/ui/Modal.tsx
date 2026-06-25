"use client";

import { useState } from "react";
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

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[var(--ui-bg)] rounded-xl shadow-2xl p-6 w-full max-w-2xl relative my-8">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--ui-bg-subtle)] text-[var(--ui-muted)]"
            >
              ✕
            </button>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
