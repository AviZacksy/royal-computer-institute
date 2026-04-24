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
        "rounded-2xl border border-blue-100 bg-white shadow-sm ring-1 ring-transparent transition-shadow hover:shadow-md",
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

