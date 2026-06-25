import { db } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { PanelPage } from "@/components/panels/PanelPage";
import { VerifyPaymentForm } from "@/components/admin/VerifyPaymentForm";
import { formatCurrency } from "@/lib/format";
import { getFileUrl } from "@/lib/storage";
import { STORAGE_BUCKETS } from "@/lib/storage/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

const STATUS_TABS = ["PENDING", "VERIFIED", "REJECTED", "ALL"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminPaymentsPage({ searchParams }: Props) {
  const session = await requireAdminSession();
  if (!session) return null;

  const { status: rawStatus } = await searchParams;
  const activeTab: StatusTab =
    STATUS_TABS.includes(rawStatus as StatusTab) ? (rawStatus as StatusTab) : "PENDING";

  const whereStatus =
    activeTab === "ALL"
      ? {}
      : { status: activeTab as "PENDING" | "VERIFIED" | "REJECTED" };

  const payments = await db.paymentSubmission.findMany({
    where: {
      ...whereStatus,
      student: { instituteId: session.instituteId },
    },
    include: {
      student: {
        select: {
          name: true,
          enrollmentNumber: true,
          id: true,
        },
      },
      receipt: { select: { id: true, receiptNumber: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Resolve screenshot URLs for PENDING items
  const paymentsWithUrls = await Promise.all(
    payments.map(async (p) => {
      let screenshotUrl: string | null = null;
      if (p.screenshotStorageKey && p.status === "PENDING") {
        try {
          screenshotUrl = await getFileUrl(STORAGE_BUCKETS.payments, p.screenshotStorageKey);
        } catch {
          screenshotUrl = null;
        }
      }
      return { ...p, screenshotUrl };
    }),
  );

  const counts = await db.paymentSubmission.groupBy({
    by: ["status"],
    where: { student: { instituteId: session.instituteId } },
    _count: true,
  });
  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count;
  const totalCount = Object.values(countMap).reduce((a, b) => a + b, 0);

  const tabLabels: Record<StatusTab, string> = {
    PENDING: `Pending (${countMap["PENDING"] ?? 0})`,
    VERIFIED: `Verified (${countMap["VERIFIED"] ?? 0})`,
    REJECTED: `Rejected (${countMap["REJECTED"] ?? 0})`,
    ALL: `All (${totalCount})`,
  };

  const statusStyles: Record<string, string> = {
    PENDING: "border-amber-200 bg-amber-50 text-amber-800",
    VERIFIED: "border-green-200 bg-green-50 text-green-800",
    REJECTED: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <PanelPage
      title="Payment Verification"
      subtitle="Review and verify student payment submissions"
    >
      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Link
            key={tab}
            href={`/admin/payments?status=${tab}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-[var(--ui-primary)] text-white"
                : "border border-[var(--ui-border)] text-[var(--ui-muted)] hover:bg-[var(--ui-surface)]"
            }`}
          >
            {tabLabels[tab]}
          </Link>
        ))}
      </div>

      {/* Payment cards */}
      {paymentsWithUrls.length === 0 ? (
        <div className="rounded-xl border border-[var(--ui-border)] bg-[var(--ui-surface)] p-8 text-center">
          <p className="text-[var(--ui-muted)]">
            No {activeTab === "ALL" ? "" : activeTab.toLowerCase()} payments found.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {paymentsWithUrls.map((p) => (
            <div key={p.id} className="rounded-xl border border-[var(--ui-border)] bg-white shadow-sm overflow-hidden">
              {/* Card header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--ui-border)] bg-[var(--ui-surface)] px-5 py-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/fees/${p.student.id}`}
                    className="font-extrabold text-[var(--ui-primary)] hover:underline"
                  >
                    {p.student.name}
                  </Link>
                  {p.student.enrollmentNumber && (
                    <span className="text-xs text-[var(--ui-muted)]">#{p.student.enrollmentNumber}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-extrabold text-[var(--ui-primary)]">
                    {formatCurrency(p.amount)}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusStyles[p.status]}`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>

              <div className="p-5">
                {p.status === "PENDING" ? (
                  <VerifyPaymentForm
                    paymentId={p.id}
                    studentName={p.student.name}
                    amount={p.amount}
                    transactionId={p.transactionId}
                    submittedAt={new Date(p.createdAt).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    screenshotUrl={p.screenshotUrl}
                  />
                ) : (
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <p className="text-xs font-bold text-[var(--ui-muted)]">Transaction ID</p>
                      <p className="font-mono">{p.transactionId || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--ui-muted)]">Date</p>
                      <p>
                        {new Date(p.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    {p.adminNotes && (
                      <div>
                        <p className="text-xs font-bold text-[var(--ui-muted)]">Admin Remarks</p>
                        <p>{p.adminNotes}</p>
                      </div>
                    )}
                    {p.receipt && (
                      <div>
                        <p className="text-xs font-bold text-[var(--ui-muted)]">Receipt</p>
                        <a
                          href={`/api/receipts/${p.receipt.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-[var(--ui-primary)] hover:underline"
                        >
                          📄 {p.receipt.receiptNumber}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelPage>
  );
}
