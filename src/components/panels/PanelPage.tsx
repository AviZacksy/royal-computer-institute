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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {backLink && (
            <a href={backLink.href} className="text-sm font-medium text-[var(--ui-primary)] hover:underline mb-2 inline-block">
              &larr; {backLink.label}
            </a>
          )}
          <h1 className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">{title}</h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-[var(--ui-muted)]">{subtitle}</p>
          ) : null}
        </div>
        {action && <div>{action}</div>}
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
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-extrabold text-[var(--ui-primary)]">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
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
    <Card className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--ui-border)] bg-[var(--ui-surface)]">
            {headers.map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-[var(--ui-border)] last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-[var(--ui-text)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 ? (
        <p className="p-6 text-center text-sm text-[var(--ui-muted)]">No records found.</p>
      ) : null}
    </Card>
  );
}
