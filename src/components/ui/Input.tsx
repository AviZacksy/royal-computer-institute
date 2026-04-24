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
        "h-11 w-full rounded-2xl border border-blue-200 bg-white px-4 text-sm text-blue-950 shadow-sm outline-none placeholder:text-blue-900/45 focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
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
        "h-11 w-full rounded-2xl border border-blue-200 bg-white px-4 text-sm text-blue-950 shadow-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
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
        "min-h-[110px] w-full resize-y rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm text-blue-950 shadow-sm outline-none placeholder:text-blue-900/45 focus:border-blue-400 focus:ring-4 focus:ring-blue-100",
        className,
      )}
    />
  );
}

