export function generateEnrollmentNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RCI${year}${rand}`;
}

export function generateAdmissionNumber() {
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `ADM${year}${rand}`;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function statusLabel(status: string) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "APPROVED":
      return "Approved";
    case "REJECTED":
      return "Rejected";
    default:
      return status;
  }
}
