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
    "inline-flex items-center justify-center font-semibold transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-[var(--radius-control)] focus-visible:ring-4 focus-visible:ring-[color-mix(in_srgb,var(--ui-primary),transparent_80%)]";

  const sizes: Record<string, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-[var(--ui-primary)] text-white hover:bg-[#0f1424]",
    secondary:
      "bg-[var(--ui-surface)] text-[var(--ui-primary)] hover:bg-[#f3f4f6]",
    outline:
      "border border-[var(--ui-border)] text-[var(--ui-primary)] hover:bg-[var(--ui-surface)]",
    ghost:
      "text-[var(--ui-primary)] hover:bg-[var(--ui-surface)]",
    accent:
      "bg-[var(--ui-accent)] text-[var(--ui-primary)] hover:bg-[#b89436]",
    whatsapp:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-600/25",
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

