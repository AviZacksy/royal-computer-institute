import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

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
  return `${n.toLocaleString("en-IN")}/-`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).replace(/\//g, "-");
}

export async function generateReceiptPdf(data: ReceiptData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const backgroundPaths = [
    path.join(process.cwd(), "public", "online-receipt.jpg"),
    path.join(process.cwd(), "public", "online-receipt .jpg"),
    path.join(process.cwd(), "public", "receipt-bg..jpeg"),
  ];

  const bgPath = backgroundPaths.find((candidate) => fs.existsSync(candidate));
  if (!bgPath) throw new Error("Receipt design image not found in public folder");

  const bgImage = await doc.embedJpg(fs.readFileSync(bgPath));
  const page = doc.addPage([bgImage.width, bgImage.height]);
  page.drawImage(bgImage, {
    x: 0,
    y: 0,
    width: bgImage.width,
    height: bgImage.height,
  });

  const black = rgb(0.02, 0.02, 0.02);
  const fitText = (text: string, maxChars: number) =>
    text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;

  const text = (value: string, x: number, yFromTop: number, size = 24) => {
    page.drawText(value, {
      x,
      y: bgImage.height - yFromTop,
      size,
      font: boldFont,
      color: black,
    });
  };

  text(fitText(data.studentName, 42), 690, 444, 22);
  text("-", 385, 540, 22);
  text(fitText(data.courseName, 13), 1288, 540, 20);
  text(formatCurrency(data.totalFee), 310, 638, 22);
  text(formatCurrency(data.amount), 775, 638, 22);
  text(formatCurrency(data.dueAmount), 1260, 638, 22);
  text(formatDate(data.paymentDate), 240, 736, 22);
  text(data.transactionId ? "Online" : "Cash", 870, 736, 22);

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
