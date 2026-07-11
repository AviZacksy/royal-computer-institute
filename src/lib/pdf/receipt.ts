import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";

export type ReceiptData = {
  receiptNumber: string;
  studentName: string;
  fatherName: string;
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
  return `Rs. ${n}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN");
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
  const mmToPt = (mm: number) => (mm * 72) / 25.4;
  const pageWidth = mmToPt(210);
  const pageHeight = mmToPt(140);
  const page = doc.addPage([pageWidth, pageHeight]);
  page.drawImage(bgImage, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
  });

  const black = rgb(0.02, 0.02, 0.02);
  const fitText = (text: string, maxChars: number) =>
    text.length > maxChars ? `${text.slice(0, maxChars - 3)}...` : text;

  const mmFontSize = mmToPt(4);

  const text = (value: string, xMm: number, yMmFromTop: number, size = mmFontSize) => {
    page.drawText(value, {
      x: mmToPt(xMm),
      y: pageHeight - mmToPt(yMmFromTop) - size * 0.75,
      size,
      font: boldFont,
      color: black,
    });
  };

  text(fitText(data.studentName, 42), 100, 52);
  text(fitText(data.fatherName || "-", 42), 54, 64);
  text(formatCurrency(data.totalFee), 49, 77);
  text(formatCurrency(data.amount), 108, 77);
  text(formatCurrency(data.dueAmount), 170, 77);
  text(formatDate(data.paymentDate), 35, 89);
  text(data.transactionId ? "ONLINE" : "CASH", 120, 89);

  const stampPath = path.join(process.cwd(), "public", "stamp.png");
  if (fs.existsSync(stampPath)) {
    const stampBytes = fs.readFileSync(stampPath);
    const stampImg = await doc.embedPng(stampBytes);
    page.drawImage(stampImg, {
      x: pageWidth - mmToPt(14 + 35),
      y: mmToPt(26),
      width: mmToPt(35),
      height: mmToPt(20),
      opacity: 0.85,
    });
  }

  const sigPath = path.join(process.cwd(), "public", "signature.png");
  if (fs.existsSync(sigPath)) {
    const sigBytes = fs.readFileSync(sigPath);
    const sigImg = await doc.embedPng(sigBytes);
    page.drawImage(sigImg, {
      x: pageWidth - mmToPt(31 + 40),
      y: mmToPt(17),
      width: mmToPt(40),
      height: mmToPt(31),
    });
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}
