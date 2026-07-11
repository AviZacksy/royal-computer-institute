import { AlertCircle, CheckCircle2, ReceiptText } from "lucide-react";
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
    VERIFIED: "border-emerald-200 bg-emerald-50 text-emerald-800",
    REJECTED: "border-red-200 bg-red-50 text-red-800",
  };
  const statusLabels: Record<string, string> = {
    PENDING: "Pending Verification",
    VERIFIED: "Verified",
    REJECTED: "Rejected",
  };

  return (
    <PanelPage title="My Fees" subtitle="View your fee status and payment history">
      {fee ? (
        <StatGrid>
          <StatCard label="Total Fee" value={formatCurrency(fee.totalFee)} icon="fee" />
          <StatCard label="Amount Paid" value={formatCurrency(fee.receivedAmount)} icon="paid" />
          <StatCard
            label="Balance Due"
            value={fee.dueAmount <= 0 ? "Fully Paid" : formatCurrency(fee.dueAmount)}
            icon={fee.dueAmount <= 0 ? "paid" : "due"}
          />
        </StatGrid>
      ) : (
        <Card className="p-6">
          <p className="text-sm text-[var(--ui-muted)]">
            No fee record has been created for you yet. Please contact the admin.
          </p>
        </Card>
      )}

      {fee && fee.totalFee > 0 ? (
        <Card className="p-6">
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="font-extrabold text-[var(--ui-primary)]">Fee Payment Progress</span>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-[var(--ui-secondary)]">
              {Math.min(100, Math.round((fee.receivedAmount / fee.totalFee) * 100))}%
            </span>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min(100, (fee.receivedAmount / fee.totalFee) * 100)}%`,
                background:
                  fee.dueAmount <= 0
                    ? "linear-gradient(90deg, #16a34a, #22c55e)"
                    : "linear-gradient(90deg, var(--ui-secondary), var(--ui-accent))",
              }}
            />
          </div>
          <div className="mt-3 flex justify-between text-xs font-semibold text-[var(--ui-muted)]">
            <span>Paid: {formatCurrency(fee.receivedAmount)}</span>
            <span>Total: {formatCurrency(fee.totalFee)}</span>
          </div>
        </Card>
      ) : null}

      {hasPendingPayment ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
          <p className="text-sm font-semibold text-amber-800">
            Your recent payment is under review. You&apos;ll be notified once verified.
          </p>
        </div>
      ) : null}

      {fee && fee.dueAmount > 0 && !hasPendingPayment ? (
        <div>
          <h2 className="mb-3 text-lg font-extrabold text-[var(--ui-primary)]">
            Make a Payment
          </h2>
          <SubmitPaymentForm dueAmount={fee.dueAmount} />
        </div>
      ) : null}

      {payments.length > 0 ? (
        <div>
          <h2 className="mb-3 text-lg font-extrabold text-[var(--ui-primary)]">
            Payment History
          </h2>
          <div className="space-y-3">
            {payments.map((p) => (
              <Card key={p.id} className="p-5 transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-display text-2xl font-extrabold text-[var(--ui-primary)]">
                      {formatCurrency(p.amount)}
                    </p>
                    <p className="text-sm text-[var(--ui-muted)]">
                      {new Date(p.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {p.transactionId ? (
                      <p className="font-mono text-xs text-[var(--ui-muted)]">
                        Ref: {p.transactionId}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[p.status]}`}
                    >
                      {p.status === "VERIFIED" ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
                      {statusLabels[p.status]}
                    </span>
                    {p.receipt ? (
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`/documents/payment-slip/${p.id}?print=1`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-[var(--ui-primary)] shadow-sm transition-colors hover:bg-slate-50"
                        >
                          <ReceiptText className="h-3.5 w-3.5 text-[var(--ui-secondary)]" />
                          Download PDF
                          <span className="text-[var(--ui-muted)]">#{p.receipt.receiptNumber}</span>
                        </a>
                        <a
                          href={`/documents/payment-slip/${p.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 shadow-sm transition-colors hover:bg-emerald-100"
                        >
                          👁️ Preview
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>

                {p.adminNotes && p.status !== "VERIFIED" ? (
                  <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-[var(--ui-muted)]">
                      Admin Note
                    </p>
                    <p className="mt-1 text-sm text-[var(--ui-text)]">{p.adminNotes}</p>
                  </div>
                ) : null}
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {!fee && payments.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-[var(--ui-muted)]">
            No payment history yet. Your fee record will appear here once the admin sets it up.
          </p>
        </Card>
      ) : null}
    </PanelPage>
  );
}
