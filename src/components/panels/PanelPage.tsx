import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  IdCard,
  Inbox,
  Laptop,
  TrendingUp,
  Users,
  WalletCards,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

export function PanelPage({
  title,
  subtitle,
  children,
  action,
  backLink,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  backLink?: { href: string; label: string };
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            {backLink ? (
              <a
                href={backLink.href}
                className="mb-3 inline-flex text-sm font-semibold text-[var(--ui-secondary)] hover:underline"
              >
                Back to {backLink.label}
              </a>
            ) : null}
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--ui-secondary)]">
              Control Center
            </p>
            <h1 className="mt-2 font-display text-2xl font-extrabold leading-tight text-[var(--ui-primary)] sm:text-3xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--ui-muted)]">
                {subtitle}
              </p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
      {children}
    </div>
  );
}

export function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>;
}

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <Card className="group overflow-hidden p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
            {label}
          </p>
          <p className="mt-3 truncate font-display text-3xl font-extrabold text-[var(--ui-primary)]">
            {value}
          </p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-[var(--ui-secondary)] ring-1 ring-blue-100 transition-colors group-hover:bg-[var(--ui-secondary)] group-hover:text-white">
          <StatIcon label={label} icon={icon} />
        </span>
      </div>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-2/3 rounded-full bg-[var(--ui-secondary)]" />
      </div>
    </Card>
  );
}

export function DataTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: React.ReactNode[][];
}) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-5 py-4 text-left text-xs font-extrabold uppercase tracking-wider text-slate-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, i) => (
              <tr key={i} className="transition-colors hover:bg-blue-50/40">
                {row.map((cell, j) => (
                  <td key={j} className="px-5 py-4 align-middle text-[var(--ui-text)]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-slate-50/60 p-12 text-center">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white text-[var(--ui-secondary)] shadow-sm">
            <Inbox className="h-7 w-7" />
          </div>
          <p className="text-sm font-extrabold text-[var(--ui-primary)]">No records found</p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-[var(--ui-muted)]">
            There is no data to display here yet. Try adjusting your filters or creating a new record.
          </p>
        </div>
      ) : null}
    </Card>
  );
}

function StatIcon({ label, icon }: { label: string; icon: string }) {
  const key = `${label} ${icon}`.toLowerCase();
  const className = "h-5 w-5";
  if (key.includes("student")) return <Users className={className} />;
  if (key.includes("pending")) return <Clock3 className={className} />;
  if (key.includes("approved") || key.includes("paid")) return <CheckCircle2 className={className} />;
  if (key.includes("course")) return <Laptop className={className} />;
  if (key.includes("fee") || key.includes("balance") || key.includes("amount")) return <WalletCards className={className} />;
  if (key.includes("enrollment")) return <IdCard className={className} />;
  if (key.includes("exam")) return <BookOpen className={className} />;
  if (key.includes("due")) return <AlertCircle className={className} />;
  if (key.includes("trained")) return <GraduationCap className={className} />;
  return <TrendingUp className={className} />;
}
