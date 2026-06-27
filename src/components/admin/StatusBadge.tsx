import type { StudentStatus } from "@prisma/client";

const styles: Record<StudentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200 ring-amber-100",
  APPROVED: "bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-100",
  REJECTED: "bg-red-50 text-red-800 border-red-200 ring-red-100",
};

export function StatusBadge({ status }: { status: StudentStatus | string }) {
  const key = status as StudentStatus;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ring-2 ${styles[key] ?? "bg-slate-50 text-slate-700 border-slate-200 ring-slate-100"}`}
    >
      {key === "PENDING" ? "Pending" : key === "APPROVED" ? "Approved" : key === "REJECTED" ? "Rejected" : status}
    </span>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ring-2 ${
        active ? "bg-emerald-50 text-emerald-800 border-emerald-200 ring-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200 ring-slate-100"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
