function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "h-11 w-full rounded-[var(--radius-control)] border border-[var(--ui-border)] bg-white px-4 text-sm text-[var(--ui-text)] shadow-sm outline-none placeholder:text-[var(--ui-muted)] focus:border-[var(--ui-accent)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--ui-accent),transparent_85%)]",
        className,
      )}
    />
  );
}

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cx(
        "h-11 w-full rounded-[var(--radius-control)] border border-[var(--ui-border)] bg-white px-4 text-sm text-[var(--ui-text)] shadow-sm outline-none focus:border-[var(--ui-accent)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--ui-accent),transparent_85%)]",
        className,
      )}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cx(
        "min-h-[110px] w-full resize-y rounded-[var(--radius-control)] border border-[var(--ui-border)] bg-white px-4 py-3 text-sm text-[var(--ui-text)] shadow-sm outline-none placeholder:text-[var(--ui-muted)] focus:border-[var(--ui-accent)] focus:ring-4 focus:ring-[color-mix(in_srgb,var(--ui-accent),transparent_85%)]",
        className,
      )}
    />
  );
}

