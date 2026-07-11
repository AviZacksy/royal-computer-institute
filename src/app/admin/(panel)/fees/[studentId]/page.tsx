import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage, DataTable } from "@/components/panels/PanelPage";
import { FeeRecordForm } from "@/components/admin/FeeRecordForm";
import { ManualPaymentForm } from "@/components/admin/ManualPaymentForm";
import { formatCurrency } from "@/lib/format";
import { getFileUrl } from "@/lib/storage";
import { STORAGE_BUCKETS } from "@/lib/storage/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ studentId: string }>;
};

export default async function AdminStudentFeeDetailPage({ params }: Props) {
  const session = await requireAdminSession();
  if (!session) return null;

  const { studentId } = await params;

  const student = await db.studentProfile.findFirst({
    where: { id: studentId, instituteId: session.instituteId, status: "APPROVED" },
    include: {
      course: { select: { name: true } },
      user: { select: { email: true } },
      feeRecord: true,
      payments: {
        include: { receipt: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!student) notFound();

  const fee = student.feeRecord;

  // Build screenshot URLs for PENDING submissions
  const paymentsWithUrls = await Promise.all(
    student.payments.map(async (p) => {
      let screenshotUrl: string | null = null;
      if (p.screenshotStorageKey) {
        try {
          screenshotUrl = await getFileUrl(STORAGE_BUCKETS.payments, p.screenshotStorageKey);
        } catch {
          screenshotUrl = null;
        }
      }
      return { ...p, screenshotUrl };
    }),
  );

  return (
    <PanelPage
      title={student.name}
      subtitle={`${student.user.email} · ${student.course?.name ?? "No course"} · #${student.enrollmentNumber ?? "N/A"}`}
    >
      <div className="flex items-center gap-2">
        <Link
          href="/admin/fees"
          className="text-sm font-semibold text-[var(--ui-muted)] hover:text-[var(--ui-primary)]"
        >
          ← Back to Fee Management
        </Link>
      </div>

      {/* Fee summary cards */}
      {fee && (
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total Fee", value: formatCurrency(fee.totalFee), color: "text-[var(--ui-primary)]" },
            { label: "Amount Paid", value: formatCurrency(fee.receivedAmount), color: "text-green-700" },
            {
              label: "Balance Due",
              value: fee.dueAmount <= 0 ? "Paid ✓" : formatCurrency(fee.dueAmount),
              color: fee.dueAmount <= 0 ? "text-green-700" : "text-red-700",
            },
          ].map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-[var(--ui-border)] bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--ui-muted)]">
                {c.label}
              </p>
              <p className={`mt-2 text-2xl font-extrabold ${c.color}`}>{c.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Forms grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        <FeeRecordForm
          studentId={studentId}
          studentName={student.name}
          existingTotalFee={fee?.totalFee}
        />
        {fee && (
          <ManualPaymentForm
            studentId={studentId}
            dueAmount={fee.dueAmount}
          />
        )}
      </div>

      {/* Payment history */}
      <div>
        <h2 className="mb-3 text-lg font-extrabold text-[var(--ui-primary)]">
          Payment History ({student.payments.length})
        </h2>
        <DataTable
          headers={["Date", "Amount", "Balance", "Transaction ID", "Status", "Remarks", "Receipt"]}
          rows={(() => {
            let runningPaid = 0;
            // Reverse to calculate from oldest to newest
            const historyWithBalance = [...paymentsWithUrls].reverse().map((p) => {
              if (p.status === "VERIFIED") {
                runningPaid += p.amount;
              }
              const balanceDue = fee ? Math.max(0, fee.totalFee - runningPaid) : 0;
              return { ...p, runningPaid, balanceDue };
            }).reverse();

            return historyWithBalance.map((p, idx) => {
              const statusStyles: Record<string, string> = {
                PENDING: "border-amber-200 bg-amber-50 text-amber-800",
                VERIFIED: "border-green-200 bg-green-50 text-green-800",
                REJECTED: "border-red-200 bg-red-50 text-red-800",
              };
              const isLatest = idx === 0;
              
              return [
                <div key="date" className="flex items-center gap-2">
                  <span>
                    {new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  {isLatest && (
                    <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">Latest</span>
                  )}
                </div>,
                <span key="amt" className="font-semibold">{formatCurrency(p.amount)}</span>,
                <div key="bal" className="flex flex-col">
                  {p.status === "VERIFIED" ? (
                    <>
                      <span className="text-xs font-semibold text-green-700">Paid: {formatCurrency(p.runningPaid)}</span>
                      <span className="text-[10px] font-medium text-[var(--ui-muted)]">Due: {formatCurrency(p.balanceDue)}</span>
                    </>
                  ) : (
                    <span className="text-xs text-[var(--ui-muted)]">—</span>
                  )}
                </div>,
                <span key="txn" className="font-mono text-xs">{p.transactionId || "—"}</span>,
                <span
                  key="status"
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[p.status]}`}
                >
                  {p.status === "PENDING" ? "Pending" : p.status === "VERIFIED" ? "Verified" : "Rejected"}
                </span>,
                <span key="notes" className="text-xs text-[var(--ui-muted)]">{p.adminNotes || "—"}</span>,
                p.receipt ? (
                  <div key="receipt" className="flex items-center gap-3">
                    <a
                      href={`/documents/payment-slip/${p.id}?print=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-[var(--ui-primary)] hover:underline"
                    >
                      📄 Download
                    </a>
                    <a
                      href={`/documents/payment-slip/${p.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-emerald-600 hover:underline"
                    >
                      👁️ Preview
                    </a>
                  </div>
                ) : (
                  <span key="no-receipt" className="text-xs text-[var(--ui-muted)]">—</span>
                ),
              ];
            });
          })()}
        />
      </div>
    </PanelPage>
  );
}
