import { db } from "@/lib/db";
import { requireStudentSession, getStudentProfile } from "@/lib/auth";
import { PanelPage, StatGrid, StatCard } from "@/components/panels/PanelPage";
import { Card } from "@/components/ui/Card";
import { SubmitPaymentForm } from "@/components/student/SubmitPaymentForm";
import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function StudentFeesPage() {
  const session = await requireStudentSession();
  if (!session) return null;

  const profile = await getStudentProfile();
  if (!profile) return null;

  if (profile.status !== "APPROVED") {
    return (
      <PanelPage title="Fees" subtitle="Your fee status">
        <Card className="p-6">
          <p className="text-sm text-[var(--ui-muted)]">
            Your enrollment is not yet approved. Fee details will be available after approval.
          </p>
        </Card>
      </PanelPage>
    );
  }

  const payments = await db.paymentSubmission.findMany({
    where: { studentId: profile.id },
    include: { receipt: { select: { id: true, receiptNumber: true } } },
    orderBy: { createdAt: "desc" },
  });

  const fee = profile.feeRecord;
  const hasPendingPayment = payments.some((p) => p.status === "PENDING");

  const statusStyles: Record<string, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    VERIFIED: "border-green-200 bg-green-50 text-green-800",
    REJECTED: "border-red-200 bg-red-50 text-red-800",
  };
  const statusLabels: Record<string, string> = {
    PENDING: "⏳ Pending Verification",
    VERIFIED: "✓ Verified",
    REJECTED: "✕ Rejected",
  };

  return (
    <PanelPage title="My Fees" subtitle="View your fee status and payment history">
      {/* Fee summary */}
      {fee ? (
        <StatGrid>
          <StatCard label="Total Fee" value={formatCurrency(fee.totalFee)} icon="💰" />
          <StatCard label="Amount Paid" value={formatCurrency(fee.receivedAmount)} icon="✅" />
          <StatCard
            label="Balance Due"
            value={fee.dueAmount <= 0 ? "Fully Paid" : formatCurrency(fee.dueAmount)}
            icon={fee.dueAmount <= 0 ? "🎉" : "⚠️"}
          />
        </StatGrid>
      ) : (
        <Card className="p-6">
          <p className="text-sm text-[var(--ui-muted)]">
            No fee record has been created for you yet. Please contact the admin.
          </p>
        </Card>
      )}

      {/* Progress bar */}
      {fee && fee.totalFee > 0 && (
        <Card className="p-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-[var(--ui-primary)]">Fee Payment Progress</span>
            <span className="font-bold text-[var(--ui-primary)]">
              {Math.min(100, Math.round((fee.receivedAmount / fee.totalFee) * 100))}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--ui-surface)] border border-[var(--ui-border)]">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (fee.receivedAmount / fee.totalFee) * 100)}%`,
                background: fee.dueAmount <= 0
                  ? "linear-gradient(90deg, #16a34a, #22c55e)"
                  : "linear-gradient(90deg, var(--ui-primary), var(--ui-accent))",
              }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-[var(--ui-muted)]">
            <span>Paid: {formatCurrency(fee.receivedAmount)}</span>
            <span>Total: {formatCurrency(fee.totalFee)}</span>
          </div>
        </Card>
      )}

      {/* Pending payment notice */}
      {hasPendingPayment && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-semibold text-amber-800">
            ⏳ Your recent payment is under review. You&apos;ll be notified once verified.
          </p>
        </div>
      )}

      {/* Submit payment form */}
      {fee && fee.dueAmount > 0 && !hasPendingPayment && (
        <div>
          <h2 className="mb-3 text-lg font-extrabold text-[var(--ui-primary)]">
            Make a Payment
          </h2>
          <SubmitPaymentForm dueAmount={fee.dueAmount} />
        </div>
      )}

      {/* Payment history */}
      {payments.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-extrabold text-[var(--ui-primary)]">
            Payment History
          </h2>
          <div className="space-y-3">
            {payments.map((p) => (
              <Card key={p.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-lg font-extrabold text-[var(--ui-primary)]">
                      {formatCurrency(p.amount)}
                    </p>
                    <p className="text-sm text-[var(--ui-muted)]">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {p.transactionId && (
                      <p className="font-mono text-xs text-[var(--ui-muted)]">
                        Ref: {p.transactionId}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[p.status]}`}
                    >
                      {statusLabels[p.status]}
                    </span>
                    {p.receipt && (
                      <a
                        href={`/api/receipts/${p.receipt.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-[var(--ui-border)] px-3 py-1.5 text-xs font-semibold text-[var(--ui-primary)] transition-colors hover:bg-[var(--ui-surface)]"
                      >
                        📄 Download Receipt
                        <span className="text-[var(--ui-muted)]">#{p.receipt.receiptNumber}</span>
                      </a>
                    )}
                  </div>
                </div>

                {/* Admin remarks */}
                {p.adminNotes && p.status !== "VERIFIED" && (
                  <div className="mt-3 rounded-lg bg-[var(--ui-surface)] px-3 py-2">
                    <p className="text-xs font-semibold text-[var(--ui-muted)]">Admin Note:</p>
                    <p className="text-sm text-[var(--ui-text)]">{p.adminNotes}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {!fee && payments.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-sm text-[var(--ui-muted)]">
            No payment history yet. Your fee record will appear here once the admin sets it up.
          </p>
        </Card>
      )}
    </PanelPage>
  );
}
