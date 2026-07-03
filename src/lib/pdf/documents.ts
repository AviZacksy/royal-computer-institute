import { PDFDocument, type PDFImage, type PDFPage, rgb, StandardFonts } from "pdf-lib";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const NAVY = rgb(0.03, 0.09, 0.26);
const GOLD = rgb(0.88, 0.66, 0.08);
const WHITE = rgb(1, 1, 1);
const MUTED = rgb(0.42, 0.45, 0.52);
const BORDER = rgb(0.83, 0.86, 0.90);
const LIGHT = rgb(0.96, 0.98, 1);
const GREEN = rgb(0.12, 0.55, 0.32);
const RED = rgb(0.78, 0.12, 0.12);

async function embedImage(doc: PDFDocument, bytes?: Buffer | null) {
  if (!bytes?.length) return null;
  try {
    if (bytes[0] === 0x89 && bytes[1] === 0x50) return doc.embedPng(bytes);
    if (bytes[0] === 0xff && bytes[1] === 0xd8) return doc.embedJpg(bytes);
  } catch {
    return null;
  }
  return null;
}

function drawImageBox(page: PDFPage, image: PDFImage | null, box: { x: number; y: number; width: number; height: number }) {
  page.drawRectangle({ ...box, color: WHITE, borderColor: BORDER, borderWidth: 1 });
  if (!image) {
    page.drawText("PHOTO", {
      x: box.x + box.width / 2 - 18,
      y: box.y + box.height / 2 - 4,
      size: 8,
      color: MUTED,
    });
    return;
  }
  const scale = Math.min(box.width / image.width, box.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  page.drawImage(image, {
    x: box.x + (box.width - width) / 2,
    y: box.y + (box.height - height) / 2,
    width,
    height,
  });
}

function drawStamp(page: PDFPage, x: number, y: number, instituteName: string) {
  page.drawCircle({ x, y, size: 36, borderColor: GOLD, borderWidth: 2 });
  page.drawCircle({ x, y, size: 28, borderColor: NAVY, borderWidth: 1 });
  page.drawText("INSTITUTE", { x: x - 23, y: y + 8, size: 6, color: NAVY });
  page.drawText("STAMP", { x: x - 14, y: y - 2, size: 7, color: GOLD });
  page.drawText(instituteName.slice(0, 22).toUpperCase(), { x: x - 30, y: y - 14, size: 5, color: MUTED });
}

function drawDirectorSignature(page: PDFPage, data: { x: number; y: number; width: number; directorName: string }) {
  page.drawLine({
    start: { x: data.x, y: data.y },
    end: { x: data.x + data.width, y: data.y },
    thickness: 1,
    color: NAVY,
  });
  page.drawText(data.directorName, { x: data.x + 4, y: data.y + 10, size: 9, color: NAVY });
  page.drawText("Director Signature", { x: data.x + 12, y: data.y - 14, size: 8, color: MUTED });
}

function drawField(page: PDFPage, label: string, value: string, x: number, y: number, width = 260) {
  page.drawText(label.toUpperCase(), { x, y: y + 13, size: 6.5, color: MUTED });
  page.drawText((value || "-").slice(0, 42), { x, y, size: 10, color: NAVY });
  page.drawLine({ start: { x, y: y - 5 }, end: { x: x + width, y: y - 5 }, thickness: 0.5, color: BORDER });
}

export type StudentIdCardData = {
  instituteName: string;
  directorName: string;
  studentName: string;
  enrollmentNumber: string;
  email: string;
  courseName: string;
  batchTime: string;
  photoBytes?: Buffer | null;
  logoBytes?: Buffer | null;
};

export async function generateStudentIdCardPdf(data: StudentIdCardData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([420, 265]);
  const { width, height } = page.getSize();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const photo = await embedImage(doc, data.photoBytes);
  const logo = await embedImage(doc, data.logoBytes);

  page.setFont(reg);
  page.drawRectangle({ x: 0, y: 0, width, height, color: LIGHT });
  page.drawRectangle({ x: 0, y: height - 66, width, height: 66, color: NAVY });
  page.drawRectangle({ x: 0, y: height - 72, width, height: 6, color: GOLD });

  if (logo) {
    page.drawImage(logo, { x: 18, y: height - 56, width: 42, height: 42 });
  } else {
    page.drawCircle({ x: 39, y: height - 35, size: 21, color: WHITE });
  }

  page.drawText(data.instituteName.toUpperCase(), { x: 70, y: height - 34, size: 16, font: bold, color: WHITE });
  page.drawText("STUDENT ID CARD", { x: 70, y: height - 52, size: 8, font: bold, color: GOLD });

  drawImageBox(page, photo, { x: 24, y: 74, width: 92, height: 112 });
  page.drawRectangle({ x: 24, y: 54, width: 92, height: 18, color: NAVY });
  page.drawText(data.enrollmentNumber || "REGISTRATION", { x: 31, y: 60, size: 7, font: bold, color: WHITE });

  drawField(page, "Student Name", data.studentName, 140, 168, 240);
  drawField(page, "Enrollment / Registration No.", data.enrollmentNumber, 140, 130, 240);
  drawField(page, "User ID / Email", data.email, 140, 92, 240);
  drawField(page, "Course", data.courseName, 140, 54, 155);
  drawField(page, "Batch Time", data.batchTime, 306, 54, 74);

  drawDirectorSignature(page, { x: 24, y: 28, width: 112, directorName: data.directorName });
  drawStamp(page, width - 55, 31, data.instituteName);

  return Buffer.from(await doc.save());
}

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
  const page = doc.addPage([595, 420]);
  const { width, height } = page.getSize();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({ x: 0, y: height - 90, width, height: 90, color: NAVY });
  page.drawText(data.instituteName, { x: 40, y: height - 45, size: 20, font: bold, color: WHITE });
  page.drawText("ADMIT CARD", { x: 40, y: height - 68, size: 10, font: reg, color: GOLD });
  page.drawRectangle({ x: 0, y: height - 96, width, height: 6, color: GOLD });

  const rows: [string, string, string, string][] = [
    ["Student Name", data.studentName, "Enrollment No.", data.enrollmentNumber || "-"],
    ["Course", data.courseName, "Exam Title", data.examTitle],
    ["Date", data.examDate || "To be announced", "Time", data.examTime || "To be announced"],
    ["Duration", `${data.examDurationMinutes} minutes`, "", ""],
  ];

  let y = height - 130;
  for (const [label1, value1, label2, value2] of rows) {
    page.drawText(label1, { x: 40, y, size: 9, font: bold, color: MUTED });
    page.drawText(value1.slice(0, 30), { x: 200, y, size: 10, font: reg, color: NAVY });
    if (label2) page.drawText(label2, { x: 330, y, size: 9, font: bold, color: MUTED });
    if (value2) page.drawText(value2.slice(0, 22), { x: 460, y, size: 10, font: reg, color: NAVY });
    y -= 28;
  }

  page.drawRectangle({ x: 40, y: y - 20, width: width - 80, height: 46, color: LIGHT });
  page.drawText("This admit card must be presented at the exam centre. Keep it safe.", {
    x: 52,
    y: y + 2,
    size: 8,
    font: reg,
    color: MUTED,
  });
  page.drawText(`Generated: ${formatDate(new Date())} - ${data.instituteName}`, {
    x: 40,
    y: 18,
    size: 7,
    font: reg,
    color: MUTED,
  });

  return Buffer.from(await doc.save());
}

export type CertificateData = {
  instituteName: string;
  directorName: string;
  studentName: string;
  courseName: string;
  courseDuration: string;
  completionStatus: string;
  issueDate: Date;
  certificateNumber: string;
  logoBytes?: Buffer | null;
};

export async function generateCertificatePdf(data: CertificateData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([841, 595]);
  const { width, height } = page.getSize();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);
  const logo = await embedImage(doc, data.logoBytes);

  page.drawRectangle({ x: 18, y: 18, width: width - 36, height: height - 36, borderColor: GOLD, borderWidth: 4, color: WHITE });
  page.drawRectangle({ x: 30, y: 30, width: width - 60, height: height - 60, borderColor: NAVY, borderWidth: 1, color: WHITE });
  page.drawRectangle({ x: 42, y: 42, width: width - 84, height: height - 84, borderColor: BORDER, borderWidth: 0.5 });

  if (logo) {
    page.drawImage(logo, { x: width / 2 - 34, y: height - 90, width: 68, height: 68 });
  }

  const institute = data.instituteName.toUpperCase();
  page.drawText(institute, { x: width / 2 - bold.widthOfTextAtSize(institute, 22) / 2, y: height - 125, size: 22, font: bold, color: NAVY });
  page.drawText("CERTIFICATE OF COMPLETION", { x: width / 2 - 108, y: height - 153, size: 13, font: bold, color: GOLD });
  page.drawRectangle({ x: width / 2 - 78, y: height - 166, width: 156, height: 4, color: GOLD });

  page.drawText("This is to certify that", { x: width / 2 - 57, y: height - 205, size: 12, font: reg, color: MUTED });
  page.drawText(data.studentName, { x: width / 2 - bold.widthOfTextAtSize(data.studentName, 32) / 2, y: height - 255, size: 32, font: bold, color: NAVY });
  page.drawLine({ start: { x: width / 2 - 185, y: height - 264 }, end: { x: width / 2 + 185, y: height - 264 }, thickness: 1, color: GOLD });
  page.drawText("has successfully completed the course", { x: width / 2 - 91, y: height - 295, size: 12, font: reg, color: MUTED });
  page.drawText(data.courseName, { x: width / 2 - bold.widthOfTextAtSize(data.courseName, 19) / 2, y: height - 328, size: 19, font: bold, color: NAVY });

  page.drawText(`Duration: ${data.courseDuration}`, { x: 270, y: height - 360, size: 10, font: reg, color: MUTED });
  page.drawText(`Status: ${data.completionStatus}`, { x: 430, y: height - 360, size: 10, font: bold, color: GREEN });
  page.drawText(`Issue Date: ${formatDate(data.issueDate)}`, { x: 52, y: 86, size: 9, font: reg, color: MUTED });
  page.drawText(`Certificate No: ${data.certificateNumber}`, { x: 52, y: 68, size: 9, font: bold, color: MUTED });

  drawDirectorSignature(page, { x: width - 220, y: 104, width: 145, directorName: data.directorName });
  page.drawText(data.instituteName, { x: width - 204, y: 72, size: 8, font: italic, color: MUTED });
  drawStamp(page, width - 315, 103, data.instituteName);

  return Buffer.from(await doc.save());
}

export type MarksheetData = {
  instituteName: string;
  directorName: string;
  studentName: string;
  registrationNumber: string;
  courseName: string;
  examTitle: string;
  obtainedMarks: number;
  totalMarks: number;
  grade?: string | null;
  issueDate: Date;
  logoBytes?: Buffer | null;
};

export async function generateMarksheetPdf(data: MarksheetData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg = await doc.embedFont(StandardFonts.Helvetica);
  const logo = await embedImage(doc, data.logoBytes);
  const percentage = data.totalMarks > 0 ? (data.obtainedMarks / data.totalMarks) * 100 : 0;
  const result = percentage >= 40 ? "PASS" : "FAIL";
  const resultColor = result === "PASS" ? GREEN : RED;

  page.drawRectangle({ x: 0, y: height - 112, width, height: 112, color: NAVY });
  if (logo) {
    page.drawImage(logo, { x: 38, y: height - 78, width: 48, height: 48 });
  }
  page.drawText(data.instituteName.toUpperCase(), { x: 98, y: height - 48, size: 20, font: bold, color: WHITE });
  page.drawText("FINAL EXAM MARKSHEET", { x: 98, y: height - 73, size: 10, font: bold, color: GOLD });
  page.drawRectangle({ x: 0, y: height - 118, width, height: 6, color: GOLD });

  drawField(page, "Student Name", data.studentName, 56, height - 160, 210);
  drawField(page, "Registration Number", data.registrationNumber, 330, height - 160, 190);
  drawField(page, "Course", data.courseName, 56, height - 207, 210);
  drawField(page, "Subject / Exam", data.examTitle, 330, height - 207, 190);

  const tableTop = height - 285;
  page.drawRectangle({ x: 56, y: tableTop, width: width - 112, height: 34, color: NAVY });
  page.drawText("Subject / Exam", { x: 72, y: tableTop + 12, size: 9, font: bold, color: WHITE });
  page.drawText("Marks", { x: 390, y: tableTop + 12, size: 9, font: bold, color: WHITE });
  page.drawRectangle({ x: 56, y: tableTop - 42, width: width - 112, height: 42, borderColor: BORDER, borderWidth: 1, color: WHITE });
  page.drawText(data.examTitle.slice(0, 44), { x: 72, y: tableTop - 18, size: 10, font: reg, color: NAVY });
  page.drawText(`${data.obtainedMarks} / ${data.totalMarks}`, { x: 390, y: tableTop - 18, size: 10, font: bold, color: NAVY });

  page.drawRectangle({ x: 56, y: tableTop - 116, width: width - 112, height: 52, color: LIGHT });
  page.drawText(`Percentage: ${percentage.toFixed(2)}%`, { x: 72, y: tableTop - 84, size: 11, font: bold, color: NAVY });
  page.drawText(`Grade: ${data.grade ?? "N/A"}`, { x: 245, y: tableTop - 84, size: 11, font: bold, color: NAVY });
  page.drawText(`Result Status: ${result}`, { x: 390, y: tableTop - 84, size: 11, font: bold, color: resultColor });

  page.drawText(`Issue Date: ${formatDate(data.issueDate)}`, { x: 56, y: 132, size: 9, font: reg, color: MUTED });
  drawDirectorSignature(page, { x: width - 204, y: 132, width: 145, directorName: data.directorName });
  drawStamp(page, width / 2, 130, data.instituteName);

  page.drawText("This marksheet is auto-generated from the submitted final exam result.", {
    x: 56,
    y: 52,
    size: 8,
    font: reg,
    color: MUTED,
  });

  return Buffer.from(await doc.save());
}
