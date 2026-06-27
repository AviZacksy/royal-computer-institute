type Props = {
  className?: string;
  children: React.ReactNode;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Card({ className, children }: Props) {
  return (
    <div
      className={cx(
        "rounded-xl border border-slate-200 bg-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: Props) {
  return <div className={cx("p-6 pb-0", className)}>{children}</div>;
}

export function CardContent({ className, children }: Props) {
  return <div className={cx("p-6", className)}>{children}</div>;
}
