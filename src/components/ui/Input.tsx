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
        "h-10 w-full rounded-[var(--radius-control)] border border-slate-200 bg-white px-3 text-sm text-[var(--ui-text)] shadow-sm outline-none placeholder:text-slate-400 transition-all focus:border-[var(--ui-secondary)] focus:ring-2 focus:ring-blue-100",
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
        "h-10 w-full rounded-[var(--radius-control)] border border-slate-200 bg-white px-3 text-sm text-[var(--ui-text)] shadow-sm outline-none transition-all focus:border-[var(--ui-secondary)] focus:ring-2 focus:ring-blue-100",
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
        "min-h-[112px] w-full resize-y rounded-[var(--radius-control)] border border-slate-200 bg-white px-3 py-2.5 text-sm text-[var(--ui-text)] shadow-sm outline-none placeholder:text-slate-400 transition-all focus:border-[var(--ui-secondary)] focus:ring-2 focus:ring-blue-100",
        className,
      )}
    />
  );
}
