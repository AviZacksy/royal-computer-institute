interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  centered?: boolean;
}

export function SectionHeading({ title, subtitle, eyebrow, centered = false }: SectionHeadingProps) {
  return (
    <div className={`flex flex-col ${centered ? "items-center text-center mx-auto max-w-3xl" : "max-w-3xl"}`}>
      {eyebrow && (
        <span className="text-sm font-medium text-[var(--ui-secondary)] tracking-[0.25em] uppercase mb-5 block">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-4xl font-medium tracking-tight text-[var(--ui-primary)] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-6 text-lg leading-relaxed text-[var(--ui-muted)] sm:text-xl ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
