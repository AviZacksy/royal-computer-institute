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
    "inline-flex items-center justify-center rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/25 disabled:opacity-50 disabled:pointer-events-none";

  const sizes: Record<string, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-5 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variants: Record<string, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    secondary:
      "bg-blue-50 text-blue-900 hover:bg-blue-100",
    outline:
      "border border-blue-200 text-blue-900 hover:bg-blue-50",
    ghost:
      "text-blue-900 hover:bg-blue-50",
    accent:
      "bg-amber-400 text-amber-950 hover:bg-amber-500 focus-visible:ring-amber-400/30",
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

