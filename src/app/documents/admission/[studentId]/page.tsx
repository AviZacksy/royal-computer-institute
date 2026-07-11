import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { db } from "@/lib/db";
import { getFileUrl } from "@/lib/storage";
import { PrintButton } from "@/components/documents/PrintButton";

export default async function AdmissionFormDocument({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const student = await db.studentProfile.findUnique({
    where: { id: studentId },
    include: { course: true, institute: true },
  });

  if (!student) return notFound();

  const photoUrl = student.photoStorageKey ? await getFileUrl("documents", student.photoStorageKey) : null;
  const signatureUrl = student.signatureStorageKey ? await getFileUrl("documents", student.signatureStorageKey) : null;
  const details = (student.admissionDetails as Record<string, string>) || {};

  const formatDate = (date?: Date | null) =>
    date ? date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "";

  const splitDate = (date?: Date | null) => ({
    day: date ? date.toLocaleDateString("en-IN", { day: "2-digit" }) : "",
    month: date ? date.toLocaleDateString("en-IN", { month: "2-digit" }) : "",
    year: date ? date.toLocaleDateString("en-IN", { year: "numeric" }) : "",
  });

  const parseAddress = (addr: string) => {
    const result = { village: "", post: "", ps: "", district: "", state: "", pin: "" };
    if (!addr) return result;
    const vMatch = addr.match(/village[\s\-:]+([^,]+)/i);
    if (vMatch) result.village = vMatch[1].trim();
    const pMatch = addr.match(/post[\s\-:]+([^,]+)/i);
    if (pMatch) result.post = pMatch[1].trim();
    const psMatch = addr.match(/p\.?s\.?[\s\-:]+([^,]+)/i);
    if (psMatch) result.ps = psMatch[1].trim();
    const dMatch = addr.match(/district[\s\-:]+([^,]+)/i);
    if (dMatch) result.district = dMatch[1].trim();
    const sMatch = addr.match(/state[\s\-:]+([^,]+)/i);
    if (sMatch) result.state = sMatch[1].trim();
    const pinMatch = addr.match(/(?:pin(?:code)?|zip)[\s\-:]*(\d{6})/i) || addr.match(/\b(\d{6})\b/);
    if (pinMatch) result.pin = pinMatch[1].trim();
    return result;
  };

  const dob = splitDate(student.dateOfBirth);
  const addr = parseAddress(student.address || student.currentAddress || "");
  const admissionDate = formatDate(student.admissionDate);

  return (
    <div
      className="print-wrapper"
      style={{
        width: "210mm",
        minHeight: "297mm",
        position: "relative",
        margin: "0 auto",
        boxSizing: "border-box",
        color: "black",
        fontFamily: "Arial, sans-serif",
        backgroundImage: "url(/Admission-Form.jpg)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "white",
      }}
    >
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          .print-wrapper { margin: 0 !important; width: 210mm !important; height: 297mm !important; min-height: 297mm !important; box-shadow: none !important; }
        }

        .admission-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
        }

        .admission-field {
          position: absolute;
          color: #111;
          font-size: var(--fs, 17px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: var(--ls, 0);
          white-space: nowrap;
          overflow: hidden;
          text-transform: uppercase;
        }

        .admission-small {
          --fs: 11px;
        }

        .admission-photo {
          position: absolute;
          top: 21.8%;
          right: 8.8%;
          width: 23mm;
          height: 33mm;
          object-fit: contain;
          border-radius: 5mm;
        }

        .student-sign {
          position: absolute;
          left: 9%;
          bottom: 10.8%;
          width: 30mm;
          height: 10mm;
          object-fit: contain;
        }

        .director-sign {
          position: absolute;
          right: 18.5%;
          bottom: 8.5%;
          width: 31mm;
          height: 26mm;
          object-fit: contain;
        }

        .letter-boxes {
          --ls: 12.6px;
          --fs: 19px;
          font-family: "Courier New", monospace;
        }
      `}</style>

      <div className="no-print" style={{ position: "absolute", top: "-40px", right: "0", zIndex: 100 }}>
        <PrintButton />
      </div>

      <div className="admission-overlay">
        <div data-field="admission-number" className="admission-field" style={{ top: "17.1%", left: "22.8%", width: "25%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.admissionNumber || ""}
        </div>
        <div data-field="admission-date" className="admission-field" style={{ top: "17.1%", right: "2.5%", width: "17%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {admissionDate}
        </div>

        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="admission-photo" src={photoUrl} alt="Student" />
        )}

        <div data-field="student-name" className="admission-field" style={{ top: "23%", left: "25.5%", width: "49%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.name}
        </div>
        <div data-field="father-name" className="admission-field" style={{ top: "26.75%", left: "25.5%", width: "49%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.fatherName || ""}
        </div>
        <div data-field="mother-name" className="admission-field" style={{ top: "30.15%", left: "25.5%", width: "49%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.motherName || ""}
        </div>

        <div data-field="dob-day" className="admission-field" style={{ top: "33.85%", left: "25.3%", width: "5%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {dob.day}
        </div>
        <div data-field="dob-month" className="admission-field" style={{ top: "33.85%", left: "29.5%", width: "5%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {dob.month}
        </div>
        <div data-field="dob-year" className="admission-field" style={{ top: "33.85%", left: "32.8%", width: "8%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {dob.year}
        </div>
        <div data-field="gender" className="admission-field" style={{ top: "33.85%", left: "64.5%", width: "16%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.gender || ""}
        </div>

        <div data-field="student-mobile" className="admission-field letter-boxes" style={{ top: "37.2%", left: "33.2%", width: "33%", "--fs": "19px", "--ls": "12.6px" } as CSSProperties}>
          {student.phone || ""}
        </div>
        <div data-field="parents-mobile" className="admission-field letter-boxes" style={{ top: "48.2%", left: "38.2%", width: "31%", "--fs": "19px", "--ls": "12.6px" } as CSSProperties}>
          {details.parentsMobile || ""}
        </div>
        <div data-field="aadhaar" className="admission-field letter-boxes" style={{ top: "52.1%", left: "27.1%", width: "30%", "--fs": "19px", "--ls": "12.6px" } as CSSProperties}>
          {details.aadhaarNumber || ""}
        </div>
        <div data-field="email" className="admission-field admission-small" style={{ top: "45%", left: "70.2%", width: "21%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {student.email || ""}
        </div>

        <div data-field="village" className="admission-field admission-small" style={{ top: "51.7%", left: "17.2%", width: "19%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.village}
        </div>
        <div data-field="post" className="admission-field admission-small" style={{ top: "51.7%", left: "45.5%", width: "18%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.post}
        </div>
        <div data-field="ps" className="admission-field admission-small" style={{ top: "51.7%", left: "69%", width: "19%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.ps}
        </div>
        <div data-field="district" className="admission-field admission-small" style={{ top: "54.6%", left: "15.2%", width: "21%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.district}
        </div>
        <div data-field="state" className="admission-field admission-small" style={{ top: "54.6%", left: "42.8%", width: "20%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.state}
        </div>
        <div data-field="pin" className="admission-field admission-small" style={{ top: "54.6%", left: "79.6%", width: "13%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.pin}
        </div>

        <div data-field="course-name" className="admission-field admission-small" style={{ top: "57.5%", left: "25.5%", width: "34%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {student.course?.name || ""}
        </div>
        <div data-field="duration" className="admission-field admission-small" style={{ top: "57.5%", left: "56.3%", width: "11%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {student.course?.duration || ""}
        </div>
        <div data-field="batch-time" className="admission-field admission-small" style={{ top: "57.5%", left: "82.2%", width: "11%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {details.batchTime || ""}
        </div>

        <div data-field="qualification" className="admission-field admission-small" style={{ top: "73.8%", left: "8.5%", width: "12%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {student.qualification || ""}
        </div>
        <div data-field="qualification-school" className="admission-field admission-small" style={{ top: "73.8%", left: "23.3%", width: "33%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {details.qualificationSchool || ""}
        </div>
        <div data-field="qualification-board" className="admission-field admission-small" style={{ top: "73.8%", left: "58.9%", width: "11%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {details.qualificationBoard || ""}
        </div>
        <div data-field="qualification-marks" className="admission-field admission-small" style={{ top: "73.8%", left: "72%", width: "9%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {details.qualificationMarks || ""}
        </div>
        <div data-field="qualification-year" className="admission-field admission-small" style={{ top: "73.8%", left: "83.3%", width: "10%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {details.qualificationYear || ""}
        </div>

        {signatureUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="student-sign" src={signatureUrl} alt="Student signature" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="director-sign" src="/signature.png" alt="Director signature" />
      </div>
    </div>
  );
}
