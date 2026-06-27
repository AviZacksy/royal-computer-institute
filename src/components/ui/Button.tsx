import Link from "next/link";

type CommonProps = {
  className?: string;
  children: React.ReactNode;
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "accent"
    | "whatsapp";
  size?: "sm" | "md" | "lg";
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function buttonClasses(opts: Pick<CommonProps, "variant" | "size" | "className">) {
  const variant = opts.variant ?? "primary";
  const size = opts.size ?? "md";

  const base =
    "inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-[var(--radius-control)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ui-secondary)]";

  const sizes: Record<string, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-6 text-sm",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--ui-secondary)] text-white hover:bg-blue-700 shadow-sm shadow-blue-900/10 border border-transparent",
    secondary:
      "bg-white text-[var(--ui-text)] border border-slate-200 shadow-sm hover:bg-slate-50 hover:text-[var(--ui-primary)]",
    outline:
      "border border-slate-200 bg-white text-[var(--ui-text)] shadow-sm hover:bg-slate-50 hover:text-[var(--ui-primary)]",
    ghost:
      "text-[var(--ui-text)] hover:bg-slate-100 hover:text-[var(--ui-primary)]",
    accent:
      "bg-[var(--ui-accent)] text-[var(--ui-primary)] hover:brightness-105 shadow-sm shadow-yellow-900/10 border border-transparent font-extrabold",
    whatsapp:
      "bg-emerald-600 text-white hover:bg-emerald-700 shadow-[var(--shadow-sm)] focus-visible:ring-emerald-600",
  };

  return cx(base, sizes[size], variants[variant], opts.className);
}

export function Button({
  className,
  children,
  variant,
  size,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={props.type ?? "button"}
      {...props}
      className={buttonClasses({ className, variant, size })}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  className,
  children,
  variant,
  size,
  ...props
}: CommonProps & Omit<React.ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link
      href={href}
      {...props}
      className={buttonClasses({ className, variant, size })}
    >
      {children}
    </Link>
  );
}

export function ButtonAnchor({
  href,
  className,
  children,
  variant,
  size,
  ...props
}: CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">) {
  return (
    <a
      href={href}
      {...props}
      className={buttonClasses({ className, variant, size })}
    >
      {children}
    </a>
  );
}
