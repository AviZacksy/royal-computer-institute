import React from "react";

export function PageShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-white">
      <div className="bg-[var(--ui-primary)] py-16 px-4 sm:py-20 lg:px-6 relative overflow-hidden">
        {/* Subtle background pattern for header */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="mx-auto w-full max-w-screen-2xl relative z-10 text-center sm:text-left">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/80 sm:text-lg mx-auto sm:mx-0">
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mx-auto w-full max-w-screen-2xl px-4 lg:px-6 py-12 sm:py-16 min-h-[50vh]">
        {children}
      </div>
    </div>
  );
}
