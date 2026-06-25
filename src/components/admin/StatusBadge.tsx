import type { StudentStatus } from "@prisma/client";

const styles: Record<StudentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-800 border-amber-200",
  APPROVED: "bg-green-50 text-green-800 border-green-200",
  REJECTED: "bg-red-50 text-red-800 border-red-200",
};

export function StatusBadge({ status }: { status: StudentStatus | string }) {
  const key = status as StudentStatus;
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[key] ?? "bg-gray-50 text-gray-700 border-gray-200"}`}
    >
      {key === "PENDING" ? "Pending" : key === "APPROVED" ? "Approved" : key === "REJECTED" ? "Rejected" : status}
    </span>
  );
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
        active ? "bg-green-50 text-green-800 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"
      }`}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
