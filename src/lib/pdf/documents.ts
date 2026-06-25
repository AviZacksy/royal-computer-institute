import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function formatDate(d: Date) {
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const DARK  = rgb(0.08, 0.10, 0.18);
const GOLD  = rgb(0.78, 0.62, 0.14);
const WHITE = rgb(1, 1, 1);
const MUTED = rgb(0.45, 0.45, 0.50);
const LIGHT = rgb(0.97, 0.97, 0.98);
const GREEN = rgb(0.13, 0.62, 0.35);
const RED   = rgb(0.80, 0.20, 0.20);

// ─── ADMIT CARD ───────────────────────────────────────────────────────────────

export type AdmitCardData = {
  instituteName: string;
  studentName: string;
  enrollmentNumber: string;
  courseName: string;
  examTitle: string;
  examDate?: string | null;
  examTime?: string | null;
  examDurationMinutes: number;
};

export async function generateAdmitCardPdf(data: AdmitCardData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 420]); // A5-landscape-ish
  const { width, height } = page.getSize();

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg  = await doc.embedFont(StandardFonts.Helvetica);

  // Header
  page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: DARK });
  page.drawText(data.instituteName, { x: 40, y: height - 45, size: 20, font: bold, color: WHITE });
  page.drawText("ADMIT CARD", { x: 40, y: height - 68, size: 10, font: reg, color: GOLD });
  page.drawRectangle({ x: 0, y: height - 96, width, height: 6, color: GOLD });

  // Body
  const startY = height - 130;
  const labelX = 40;
  const valueX = 200;
  const col2L  = 330;
  const col2V  = 460;
  const rowH   = 28;

  const rows: [string, string, string, string][] = [
    ["Student Name",    data.studentName,                    "Enrollment No.", data.enrollmentNumber || "-"],
    ["Course",         data.courseName,                      "Exam Title",     data.examTitle],
    ["Date",           data.examDate || "To be announced",   "Time",           data.examTime || "To be announced"],
    ["Duration",       `${data.examDurationMinutes} minutes`, "",               ""],
  ];

  let y = startY;
  for (const [l1, v1, l2, v2] of rows) {
    page.drawText(l1, { x: labelX, y, size: 9,  font: bold, color: MUTED });
    page.drawText(String(v1).slice(0, 30), { x: valueX, y, size: 10, font: reg, color: DARK });
    if (l2) page.drawText(l2, { x: col2L, y, size: 9, font: bold, color: MUTED });
    if (v2) page.drawText(String(v2).slice(0, 22), { x: col2V, y, size: 10, font: reg, color: DARK });
    y -= rowH;
  }

  // Note box
  y -= 10;
  page.drawRectangle({ x: 40, y: y - 10, width: width - 80, height: 40, color: LIGHT });
  page.drawText("This admit card must be presented at the exam centre. Keep it safe.", {
    x: 52, y: y + 10, size: 8, font: reg, color: MUTED,
  });

  // Footer
  page.drawLine({ start: { x: 40, y: 30 }, end: { x: width - 40, y: 30 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });
  page.drawText(`Generated: ${formatDate(new Date())} - ${data.instituteName}`, {
    x: 40, y: 14, size: 7, font: reg, color: MUTED,
  });

  return Buffer.from(await doc.save());
}

// ─── CERTIFICATE ──────────────────────────────────────────────────────────────

export type CertificateData = {
  instituteName: string;
  studentName: string;
  courseName: string;
  courseDuration: string;
  completionDate: Date;
  certificateNumber: string;
};

export async function generateCertificatePdf(data: CertificateData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([841, 595]); // A4 landscape
  const { width, height } = page.getSize();

  const bold   = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg    = await doc.embedFont(StandardFonts.Helvetica);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  // Outer border
  page.drawRectangle({ x: 20, y: 20, width: width - 40, height: height - 40, borderColor: GOLD, borderWidth: 3, color: WHITE });
  page.drawRectangle({ x: 28, y: 28, width: width - 56, height: height - 56, borderColor: DARK, borderWidth: 1, color: WHITE });

  // Header
  page.drawText(data.instituteName.toUpperCase(), {
    x: width / 2 - bold.widthOfTextAtSize(data.instituteName.toUpperCase(), 22) / 2,
    y: height - 80, size: 22, font: bold, color: DARK,
  });

  const sub = "CERTIFICATE OF COMPLETION";
  page.drawText(sub, {
    x: width / 2 - bold.widthOfTextAtSize(sub, 13) / 2,
    y: height - 108, size: 13, font: bold, color: GOLD,
  });

  // Gold divider
  page.drawRectangle({ x: width / 2 - 80, y: height - 120, width: 160, height: 4, color: GOLD });

  // Presented to
  const pres = "This is to certify that";
  page.drawText(pres, {
    x: width / 2 - reg.widthOfTextAtSize(pres, 12) / 2,
    y: height - 160, size: 12, font: reg, color: MUTED,
  });

  // Student name — large
  page.drawText(data.studentName, {
    x: width / 2 - bold.widthOfTextAtSize(data.studentName, 32) / 2,
    y: height - 210, size: 32, font: bold, color: DARK,
  });

  // Name underline
  page.drawLine({
    start: { x: width / 2 - 180, y: height - 218 },
    end:   { x: width / 2 + 180, y: height - 218 },
    thickness: 1, color: GOLD,
  });

  // Body text
  const line1 = `has successfully completed the course of`;
  page.drawText(line1, {
    x: width / 2 - reg.widthOfTextAtSize(line1, 11) / 2,
    y: height - 248, size: 11, font: reg, color: MUTED,
  });

  page.drawText(data.courseName, {
    x: width / 2 - bold.widthOfTextAtSize(data.courseName, 18) / 2,
    y: height - 278, size: 18, font: bold, color: DARK,
  });

  const line2 = `Duration: ${data.courseDuration}   |   Date of Completion: ${formatDate(data.completionDate)}`;
  page.drawText(line2, {
    x: width / 2 - reg.widthOfTextAtSize(line2, 10) / 2,
    y: height - 308, size: 10, font: reg, color: MUTED,
  });

  // Signature placeholder
  page.drawLine({ start: { x: width - 200, y: 100 }, end: { x: width - 60, y: 100 }, thickness: 1, color: DARK });
  page.drawText("Authorized Signatory", { x: width - 194, y: 84, size: 9, font: reg, color: MUTED });
  page.drawText(data.instituteName, { x: width - 194, y: 70, size: 8, font: italic, color: MUTED });

  // Certificate number
  page.drawText(`Certificate No: ${data.certificateNumber}`, { x: 52, y: 84, size: 9, font: bold, color: MUTED });
  page.drawText(`Issue Date: ${formatDate(new Date())}`, { x: 52, y: 68, size: 8, font: reg, color: MUTED });

  return Buffer.from(await doc.save());
}

// ─── MARKSHEET ────────────────────────────────────────────────────────────────

export type MarksheetData = {
  instituteName: string;
  studentName: string;
  enrollmentNumber: string;
  courseName: string;
  examTitle: string;
  obtainedMarks: number;
  totalMarks: number;
  grade?: string | null;
};

export async function generateMarksheetPdf(data: MarksheetData): Promise<Buffer> {
  const doc  = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg  = await doc.embedFont(StandardFonts.Helvetica);

  const percentage = data.totalMarks > 0
    ? ((data.obtainedMarks / data.totalMarks) * 100).toFixed(2)
    : "0.00";
  const passed = data.obtainedMarks / data.totalMarks >= 0.4;
  const result = passed ? "PASS" : "FAIL";
  const resultColor = passed ? GREEN : RED;

  // Header
  page.drawRectangle({ x: 0, y: height - 100, width, height: 100, color: DARK });
  page.drawText(data.instituteName, { x: 40, y: height - 45, size: 22, font: bold, color: WHITE });
  page.drawText("MARKSHEET", { x: 40, y: height - 70, size: 10, font: reg, color: GOLD });
  page.drawRectangle({ x: 0, y: height - 106, width, height: 6, color: GOLD });

  // Student info rows
  const startY = height - 150;
  const rows: [string, string, string, string][] = [
    ["Student Name",   data.studentName,              "Enrollment No.",  data.enrollmentNumber || "-"],
    ["Course",         data.courseName,               "Exam Title",      data.examTitle],
    ["Date Generated", formatDate(new Date()),         "",               ""],
  ];

  let y = startY;
  for (const [l1, v1, l2, v2] of rows) {
    page.drawText(l1, { x: 60, y, size: 9, font: bold, color: MUTED });
    page.drawText(String(v1).slice(0, 28), { x: 220, y, size: 10, font: reg, color: DARK });
    if (l2) page.drawText(l2, { x: 330, y, size: 9, font: bold, color: MUTED });
    if (v2) page.drawText(String(v2).slice(0, 22), { x: 460, y, size: 10, font: reg, color: DARK });
    y -= 28;
  }

  // Divider
  y -= 10;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });

  // Score box
  y -= 30;
  page.drawRectangle({ x: 40, y: y - 60, width: width - 80, height: 110, color: LIGHT });
  page.drawRectangle({ x: 40, y: y + 40, width: width - 80, height: 20, color: DARK });
  page.drawText("SCORE SUMMARY", { x: 52, y: y + 45, size: 9, font: bold, color: WHITE });

  const scoreRows: [string, string][] = [
    ["Obtained Marks",  `${data.obtainedMarks}`],
    ["Total Marks",     `${data.totalMarks}`],
    ["Percentage",      `${percentage}%`],
    ...(data.grade ? [["Grade", data.grade] as [string, string]] : []),
  ];

  let sy = y + 18;
  for (const [l, v] of scoreRows) {
    page.drawText(l, { x: 60, y: sy, size: 10, font: reg, color: DARK });
    page.drawText(v, { x: width - 60 - bold.widthOfTextAtSize(v, 10), y: sy, size: 10, font: bold, color: DARK });
    sy -= 18;
  }

  // Result badge
  y -= 90;
  const badge = `RESULT: ${result}`;
  page.drawRectangle({ x: 40, y: y - 10, width: width - 80, height: 50, color: passed ? rgb(0.90, 1.0, 0.93) : rgb(1.0, 0.92, 0.92) });
  page.drawText(badge, {
    x: width / 2 - bold.widthOfTextAtSize(badge, 22) / 2,
    y: y + 8, size: 22, font: bold, color: resultColor,
  });

  // Footer
  page.drawLine({ start: { x: 40, y: 80 }, end: { x: width - 40, y: 80 }, thickness: 0.5, color: rgb(0.85, 0.85, 0.88) });
  page.drawText("This is a computer-generated marksheet and is valid without a signature.", {
    x: 40, y: 60, size: 8, font: reg, color: MUTED,
  });
  page.drawText(`Generated on ${new Date().toLocaleString("en-IN")} - ${data.instituteName}`, {
    x: 40, y: 44, size: 8, font: reg, color: MUTED,
  });

  return Buffer.from(await doc.save());
}
