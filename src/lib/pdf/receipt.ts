import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export type ReceiptData = {
  receiptNumber: string;
  studentName: string;
  enrollmentNumber: string;
  courseName: string;
  amount: number;
  totalFee: number;
  paidAmount: number;
  dueAmount: number;
  transactionId?: string | null;
  paymentDate: Date;
  verifiedAt: Date;
  verifiedByEmail?: string;
  instituteName: string;
};

function formatCurrency(n: number) {
  return `INR ${n.toLocaleString("en-IN")}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function generateReceiptPdf(data: ReceiptData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await doc.embedFont(StandardFonts.Helvetica);

  const gold = rgb(0.78, 0.62, 0.14);
  const dark = rgb(0.08, 0.1, 0.18);
  const muted = rgb(0.45, 0.45, 0.5);
  const white = rgb(1, 1, 1);
  const lightGray = rgb(0.97, 0.97, 0.98);
  const green = rgb(0.13, 0.62, 0.35);

  // ─── Header band ─────────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 100, width, height: 100, color: dark });

  page.drawText(data.instituteName, {
    x: 40,
    y: height - 45,
    size: 22,
    font: boldFont,
    color: white,
  });

  page.drawText("OFFICIAL PAYMENT RECEIPT", {
    x: 40,
    y: height - 70,
    size: 10,
    font: regularFont,
    color: gold,
  });

  // Receipt number top-right
  page.drawText(`Receipt #${data.receiptNumber}`, {
    x: width - 200,
    y: height - 45,
    size: 11,
    font: boldFont,
    color: white,
  });
  page.drawText(`Issued: ${formatDate(data.verifiedAt)}`, {
    x: width - 200,
    y: height - 65,
    size: 9,
    font: regularFont,
    color: gold,
  });

  // ─── Gold accent bar ──────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: height - 106, width, height: 6, color: gold });

  // ─── Amount hero ──────────────────────────────────────────────────────────
  let y = height - 160;
  page.drawRectangle({ x: 40, y: y - 20, width: width - 80, height: 80, color: lightGray });

  page.drawText("AMOUNT PAID", {
    x: 60,
    y: y + 38,
    size: 9,
    font: boldFont,
    color: muted,
  });
  page.drawText(formatCurrency(data.amount), {
    x: 60,
    y: y + 10,
    size: 30,
    font: boldFont,
    color: green,
  });
  page.drawText("VERIFIED", {
    x: width - 160,
    y: y + 28,
    size: 11,
    font: boldFont,
    color: green,
  });
  page.drawText("Payment Confirmed", {
    x: width - 160,
    y: y + 10,
    size: 9,
    font: regularFont,
    color: muted,
  });

  // ─── Divider ──────────────────────────────────────────────────────────────
  y -= 50;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });

  // ─── Details grid ─────────────────────────────────────────────────────────
  y -= 30;
  const labelX = 60;
  const valueX = 220;
  const col2LabelX = 330;
  const col2ValueX = 460;
  const rowH = 30;

  const rows: [string, string, string, string][] = [
    ["Student Name", data.studentName, "Enrollment No.", data.enrollmentNumber || "-"],
    ["Course", data.courseName, "Payment Date", formatDate(data.paymentDate)],
    ["Transaction ID", data.transactionId || "-", "Verified By", data.verifiedByEmail || "Admin"],
  ];

  for (const [l1, v1, l2, v2] of rows) {
    page.drawText(l1, { x: labelX, y, size: 9, font: boldFont, color: muted });
    page.drawText(v1.slice(0, 28), { x: valueX, y, size: 10, font: regularFont, color: dark });
    page.drawText(l2, { x: col2LabelX, y, size: 9, font: boldFont, color: muted });
    page.drawText(v2.slice(0, 22), { x: col2ValueX, y, size: 10, font: regularFont, color: dark });
    y -= rowH;
  }

  // ─── Fee Summary box ──────────────────────────────────────────────────────
  y -= 20;
  page.drawRectangle({ x: 40, y: y - 10, width: width - 80, height: 100, color: lightGray });
  page.drawRectangle({ x: 40, y: y + 80, width: width - 80, height: 20, color: dark });
  page.drawText("FEE SUMMARY", {
    x: 52,
    y: y + 85,
    size: 9,
    font: boldFont,
    color: white,
  });

  const sumRows: [string, string][] = [
    ["Total Fee", formatCurrency(data.totalFee)],
    ["Total Paid (incl. this payment)", formatCurrency(data.paidAmount)],
    ["Balance Due", formatCurrency(data.dueAmount)],
  ];

  let sy = y + 55;
  for (const [l, v] of sumRows) {
    page.drawText(l, { x: 60, y: sy, size: 10, font: regularFont, color: dark });
    page.drawText(v, {
      x: width - 60 - boldFont.widthOfTextAtSize(v, 10),
      y: sy,
      size: 10,
      font: boldFont,
      color: l === "Balance Due" ? (data.dueAmount === 0 ? green : rgb(0.8, 0.2, 0.2)) : dark,
    });
    sy -= 20;
  }

  // ─── Footer ───────────────────────────────────────────────────────────────
  page.drawLine({ start: { x: 40, y: 80 }, end: { x: width - 40, y: 80 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });
  page.drawText("This is a computer-generated receipt and is valid without a signature.", {
    x: 40,
    y: 60,
    size: 8,
    font: regularFont,
    color: muted,
  });
  page.drawText(`Generated on ${new Date().toLocaleString("en-IN")} • ${data.instituteName}`, {
    x: 40,
    y: 45,
    size: 8,
    font: regularFont,
    color: muted,
  });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
