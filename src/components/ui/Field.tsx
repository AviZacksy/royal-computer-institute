type Props = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
};

export function Field({ label, htmlFor, hint, children }: Props) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <div className="flex items-end justify-between gap-3">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          {label}
        </span>
        {hint ? (
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</span>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
    </label>
  );
}

