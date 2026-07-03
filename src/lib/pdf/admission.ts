import { PDFDocument, type PDFFont, type PDFPage, rgb, StandardFonts } from "pdf-lib";

export type AdmissionPdfData = {
  instituteName: string;
  admissionNumber: string;
  admissionDate: string;
  studentName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: string;
  aadhaarNumber: string;
  mobileNumber: string;
  email: string;
  courseName: string;
  qualification: {
    class: string;
    schoolCollege: string;
    board: string;
    marks: string;
    year: string;
  };
  permanentAddress: {
    village: string;
    post: string;
    policeStation: string;
    district: string;
    pinCode: string;
  };
  currentAddress: string;
};

const NAVY = rgb(0.06, 0.09, 0.18);
const BLUE = rgb(0.15, 0.39, 0.92);
const GOLD = rgb(0.92, 0.70, 0.05);
const MUTED = rgb(0.40, 0.45, 0.52);
const LIGHT = rgb(0.96, 0.97, 0.99);
const WHITE = rgb(1, 1, 1);

export async function generateAdmissionFormPdf(data: AdmissionPdfData): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]);
  const { width, height } = page.getSize();

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const regular = await doc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({ x: 0, y: height - 92, width, height: 92, color: NAVY });
  page.drawText(data.instituteName.toUpperCase(), {
    x: 36,
    y: height - 42,
    size: 20,
    font: bold,
    color: WHITE,
  });
  page.drawText("ADMISSION FORM", {
    x: 36,
    y: height - 66,
    size: 11,
    font: bold,
    color: GOLD,
  });
  page.drawRectangle({ x: 0, y: height - 98, width, height: 6, color: GOLD });

  page.drawText(`Admission No: ${data.admissionNumber}`, {
    x: width - 210,
    y: height - 42,
    size: 10,
    font: bold,
    color: WHITE,
  });
  page.drawText(`Date: ${data.admissionDate}`, {
    x: width - 210,
    y: height - 62,
    size: 10,
    font: regular,
    color: WHITE,
  });

  let y = height - 130;
  y = drawSection(page, bold, regular, y, "Student Details", [
    ["Student Name", data.studentName, "Gender", data.gender],
    ["Father Name", data.fatherName, "Mother Name", data.motherName],
    ["Date of Birth", data.dateOfBirth, "Aadhaar No.", maskAadhaar(data.aadhaarNumber)],
    ["Mobile No.", data.mobileNumber, "Email ID", data.email],
    ["Course Interested", data.courseName, "", ""],
  ]);

  y = drawSection(page, bold, regular, y - 8, "Qualification", [
    ["Class", data.qualification.class, "Board", data.qualification.board],
    ["School/College", data.qualification.schoolCollege, "Year", data.qualification.year],
    ["Marks %", data.qualification.marks, "", ""],
  ]);

  y = drawSection(page, bold, regular, y - 8, "Permanent Address", [
    ["Village", data.permanentAddress.village, "Post", data.permanentAddress.post],
    ["Police Station", data.permanentAddress.policeStation, "District", data.permanentAddress.district],
    ["PIN Code", data.permanentAddress.pinCode, "", ""],
  ]);

  y = drawSection(page, bold, regular, y - 8, "Current Address", [
    ["Address", data.currentAddress, "", ""],
  ]);

  const signY = Math.max(86, y - 58);
  page.drawLine({ start: { x: 42, y: signY }, end: { x: 190, y: signY }, thickness: 1, color: NAVY });
  page.drawText("Student Signature", { x: 62, y: signY - 16, size: 9, font: bold, color: MUTED });

  page.drawLine({ start: { x: 230, y: signY }, end: { x: 378, y: signY }, thickness: 1, color: NAVY });
  page.drawText("Director Signature", { x: 252, y: signY - 16, size: 9, font: bold, color: MUTED });

  page.drawCircle({ x: 490, y: signY + 10, size: 36, borderColor: GOLD, borderWidth: 2 });
  page.drawText("INSTITUTE", { x: 465, y: signY + 15, size: 8, font: bold, color: NAVY });
  page.drawText("STAMP", { x: 473, y: signY + 2, size: 8, font: bold, color: NAVY });

  page.drawText("This admission form is generated from the submitted online admission details.", {
    x: 36,
    y: 34,
    size: 8,
    font: regular,
    color: MUTED,
  });

  return Buffer.from(await doc.save());
}

function drawSection(
  page: PDFPage,
  bold: PDFFont,
  regular: PDFFont,
  y: number,
  title: string,
  rows: [string, string, string, string][],
) {
  const x = 36;
  const width = 523;
  const rowH = 26;
  const height = 34 + rows.length * rowH;

  page.drawRectangle({ x, y: y - height + 10, width, height, color: LIGHT, borderColor: rgb(0.86, 0.89, 0.94), borderWidth: 1 });
  page.drawRectangle({ x, y: y - 20, width, height: 26, color: BLUE });
  page.drawText(title.toUpperCase(), { x: x + 12, y: y - 12, size: 10, font: bold, color: WHITE });

  let rowY = y - 46;
  for (const [labelA, valueA, labelB, valueB] of rows) {
    drawPair(page, bold, regular, x + 12, rowY, labelA, valueA, 150);
    if (labelB) drawPair(page, bold, regular, x + 282, rowY, labelB, valueB, 112);
    rowY -= rowH;
  }

  return y - height - 4;
}

function drawPair(
  page: PDFPage,
  bold: PDFFont,
  regular: PDFFont,
  x: number,
  y: number,
  label: string,
  value: string,
  labelW: number,
) {
  page.drawText(label, { x, y, size: 8, font: bold, color: MUTED });
  page.drawText(String(value || "-").slice(0, 42), {
    x: x + labelW,
    y,
    size: 9,
    font: regular,
    color: NAVY,
  });
}

function maskAadhaar(value: string) {
  return value.length === 12 ? `XXXX XXXX ${value.slice(-4)}` : value;
}
