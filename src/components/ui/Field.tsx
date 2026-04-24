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
        <span className="text-sm font-extrabold text-blue-950">
          {label}
        </span>
        {hint ? (
          <span className="text-xs font-semibold text-blue-900/60">{hint}</span>
        ) : null}
      </div>
      <div className="mt-2">{children}</div>
    </label>
  );
}

