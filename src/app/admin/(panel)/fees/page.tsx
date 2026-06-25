import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage, DataTable } from "@/components/panels/PanelPage";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminFeesPage() {
  const session = await requireAdminSession();
  if (!session) return null;

  const students = await db.studentProfile.findMany({
    where: { instituteId: session.instituteId, status: "APPROVED" },
    include: {
      course: { select: { name: true } },
      feeRecord: true,
    },
    orderBy: { name: "asc" },
  });

  const withFee = students.filter((s) => s.feeRecord);
  const withoutFee = students.filter((s) => !s.feeRecord);

  const pendingPayments = await db.paymentSubmission.count({
    where: {
      status: "PENDING",
      student: { instituteId: session.instituteId },
    },
  });

  return (
    <PanelPage title="Fee Management" subtitle="Manage fee records and payment history for students">
      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Students (Approved)",
            value: students.length,
            icon: "👥",
            color: "text-[var(--ui-primary)]",
          },
          {
            label: "Fee Records Created",
            value: withFee.length,
            icon: "📋",
            color: "text-green-700",
          },
          {
            label: "Pending Payments",
            value: pendingPayments,
            icon: "⏳",
            color: "text-amber-700",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-start justify-between rounded-xl border border-[var(--ui-border)] bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
                {s.label}
              </p>
              <p className={`mt-2 text-2xl font-extrabold ${s.color}`}>{s.value}</p>
            </div>
            <span className="text-2xl">{s.icon}</span>
          </div>
        ))}
      </div>

      {/* Pending payment alert */}
      {pendingPayments > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">
            {pendingPayments} payment{pendingPayments > 1 ? "s" : ""} awaiting verification
          </p>
          <Link
            href="/admin/payments"
            className="text-sm font-bold text-amber-900 underline hover:no-underline"
          >
            Review now →
          </Link>
        </div>
      )}

      {/* Students with fee records */}
      <div>
        <h2 className="mb-3 text-lg font-extrabold text-[var(--ui-primary)]">
          Fee Records ({withFee.length})
        </h2>
        <DataTable
          headers={["Student", "Course", "Total Fee", "Paid", "Due", "Status", "Actions"]}
          rows={withFee.map((s) => {
            const fee = s.feeRecord!;
            const isPaid = fee.dueAmount <= 0;
            return [
              <span key="name" className="font-semibold">{s.name}</span>,
              s.course?.name ?? "—",
              formatCurrency(fee.totalFee),
              <span key="paid" className="font-semibold text-green-700">{formatCurrency(fee.receivedAmount)}</span>,
              <span key="due" className={`font-semibold ${isPaid ? "text-green-700" : "text-red-700"}`}>
                {isPaid ? "Paid ✓" : formatCurrency(fee.dueAmount)}
              </span>,
              <span
                key="status"
                className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                  isPaid
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                {isPaid ? "Cleared" : "Due"}
              </span>,
              <Link
                key="link"
                href={`/admin/fees/${s.id}`}
                className="text-sm font-semibold text-[var(--ui-primary)] hover:underline"
              >
                View →
              </Link>,
            ];
          })}
        />
      </div>

      {/* Students without fee records */}
      {withoutFee.length > 0 && (
        <div>
          <h2 className="mb-1 text-lg font-extrabold text-[var(--ui-primary)]">
            No Fee Record ({withoutFee.length})
          </h2>
          <p className="mb-3 text-sm text-[var(--ui-muted)]">
            These approved students don&apos;t have a fee record yet.
          </p>
          <DataTable
            headers={["Student", "Course", "Actions"]}
            rows={withoutFee.map((s) => [
              <span key="name" className="font-semibold">{s.name}</span>,
              s.course?.name ?? "—",
              <Link
                key="link"
                href={`/admin/fees/${s.id}`}
                className="text-sm font-semibold text-[var(--ui-primary)] hover:underline"
              >
                Create Record →
              </Link>,
            ])}
          />
        </div>
      )}

      {students.length === 0 && (
        <div className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-8 text-center">
          <p className="text-[var(--ui-muted)]">No approved students yet.</p>
          <Link
            href="/admin/students/approval"
            className="mt-2 block text-sm font-semibold text-[var(--ui-primary)] hover:underline"
          >
            Go to approvals →
          </Link>
        </div>
      )}
    </PanelPage>
  );
}
