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

  const parseAddress = (addr: string) => {
    const result = { village: "", post: "", ps: "", district: "", state: "", pin: "" };
    if (!addr) return result;

    // Structured regex matches
    const vMatch = addr.match(/village[\s\-:]+([^,]+)/i);
    const pMatch = addr.match(/post[\s\-:]+([^,]+)/i);
    const psMatch = addr.match(/p\.?s\.?[\s\-:]+([^,]+)/i);
    const dMatch = addr.match(/district[\s\-:]+([^,]+)/i);
    const sMatch = addr.match(/state[\s\-:]+([^,]+)/i);
    const pinMatch = addr.match(/(?:pin(?:code)?|zip)[\s\-:]*(\d{6})/i) || addr.match(/\b(\d{6})\b/);

    if (vMatch) result.village = vMatch[1].trim();
    if (pMatch) result.post = pMatch[1].trim();
    if (psMatch) result.ps = psMatch[1].trim();
    if (dMatch) result.district = dMatch[1].trim();
    if (sMatch) result.state = sMatch[1].trim();
    if (pinMatch) result.pin = pinMatch[1].trim();

    // Comma-separated token extraction fallback
    const cleanAddr = addr.replace(/(?:village|post|p\.?s\.?|district|state)[\s\-:]+/gi, "");
    const parts = cleanAddr.split(",").map((p) => p.trim()).filter(Boolean);

    if (!result.village && parts[0]) {
      result.village = parts[0];
    }
    if (!result.post && parts[1]) {
      result.post = parts[1];
    }
    if (!result.district) {
      if (parts[2]) {
        result.district = parts[2].replace(/\b\d{6}\b/, "").trim();
      } else if (addr.toLowerCase().includes("motihari")) {
        result.district = "EAST CHAMPARAN";
      }
    }
    if (!result.state) {
      result.state = "BIHAR";
    }

    return result;
  };

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
          left: 10%;
          bottom: 6.8%;
          width: 29mm;
          height: 10mm;
          object-fit: contain;
        }

        .director-sign {
          position: absolute;
          right: 18.5%;
          bottom: 3.8%;
          width: 31mm;
          height: 27mm;
          object-fit: contain;
        }
      `}</style>

      <div className="no-print" style={{ position: "absolute", top: "-40px", right: "0", zIndex: 100 }}>
        <PrintButton />
      </div>

      <div className="admission-overlay">
        {/* Admission No */}
        <div data-field="admission-number" className="admission-field" style={{ top: "17.5%", left: "22.8%", width: "25%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.admissionNumber || ""}
        </div>
        {/* Admission Date */}
        <div data-field="admission-date" className="admission-field" style={{ top: "17.5%", left: "80.5%", width: "17%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {admissionDate}
        </div>

        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="admission-photo" src={photoUrl} alt="Student" />
        )}

        {/* Student Name */}
        <div data-field="student-name" className="admission-field" style={{ top: "23.4%", left: "25.5%", width: "51%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.name}
        </div>
        {/* Father's Name */}
        <div data-field="father-name" className="admission-field" style={{ top: "27.1%", left: "25.5%", width: "51%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.fatherName || ""}
        </div>
        {/* Mother's Name */}
        <div data-field="mother-name" className="admission-field" style={{ top: "30.7%", left: "25.5%", width: "51%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.motherName || ""}
        </div>

        {/* DOB & Gender */}
        <div data-field="date-of-birth" className="admission-field" style={{ top: "34.6%", left: "25.5%", width: "16%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {formatDate(student.dateOfBirth)}
        </div>
        <div data-field="gender" className="admission-field" style={{ top: "34.4%", left: "64.5%", width: "12%", "--fs": "17px", "--ls": "0" } as CSSProperties}>
          {student.gender || ""}
        </div>

        {/* Student Mobile Number (grid boxes alignment) */}
        <div id="student-mobile" data-field="student-mobile" style={{ top: "36.9%", left: "33.1%", width: "29.2%", display: "flex", justifyContent: "space-around", position: "absolute" } as CSSProperties}>
          {(student.phone || "").padEnd(10, " ").split("").slice(0, 10).map((digit, idx) => (
            <span key={idx} style={{ width: "7%", display: "inline-block", textAlign: "center", fontSize: "23px", fontWeight: "bold", pointerEvents: "none" }}>
              {digit}
            </span>
          ))}
        </div>

        {/* Parents Mobile Number (grid boxes alignment) */}
        <div id="parents-mobile" data-field="parents-mobile" style={{ top: "40.3%", left: "33.1%", width: "29.2%", display: "flex", justifyContent: "space-around", position: "absolute" } as CSSProperties}>
          {(details.parentsMobile || "").padEnd(10, " ").split("").slice(0, 10).map((digit, idx) => (
            <span key={idx} style={{ width: "7%", display: "inline-block", textAlign: "center", fontSize: "23px", fontWeight: "bold", pointerEvents: "none" }}>
              {digit}
            </span>
          ))}
        </div>

        {/* Aadhaar Number */}
        <div id="student-aadhaar" data-field="aadhaar" className="admission-field" style={{ top: "44.9%", left: "27.5%", width: "39%", "--fs": "19px", "--ls": "3px" } as CSSProperties}>
          {details.aadhaarNumber || ""}
        </div>
        {/* Email ID */}
        <div id="student-email" data-field="email" className="admission-field" style={{ top: "48.5%", left: "25.5%", width: "39%", "--fs": "13px", "--ls": "0" } as CSSProperties}>
          {student.email || ""}
        </div>

        {/* Full Address - Row 1 */}
        <div data-field="village" className="admission-field admission-small" style={{ top: "55.1%", left: "17.2%", width: "19%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.village}
        </div>
        <div data-field="post" className="admission-field admission-small" style={{ top: "55.1%", left: "45.5%", width: "18%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.post}
        </div>
        <div data-field="ps" className="admission-field admission-small" style={{ top: "55.1%", left: "69.0%", width: "19%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.ps}
        </div>

        {/* Full Address - Row 2 */}
        <div data-field="district" className="admission-field admission-small" style={{ top: "58.5%", left: "16.5%", width: "20%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.district}
        </div>
        <div data-field="state" className="admission-field admission-small" style={{ top: "58.5%", left: "45.0%", width: "18%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.state}
        </div>
        <div data-field="pin" className="admission-field admission-small" style={{ top: "58.5%", left: "79.6%", width: "13%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {addr.pin}
        </div>

        {/* Course Details */}
        <div data-field="course-name" className="admission-field admission-small" style={{ top: "61.9%", left: "25.5%", width: "34%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {student.course?.name || ""}
        </div>
        <div data-field="duration" className="admission-field admission-small" style={{ top: "61.5%", left: "56.5%", width: "11%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {student.course?.duration || ""}
        </div>
        <div data-field="batch-time" className="admission-field admission-small" style={{ top: "61.9%", left: "84.5%", width: "11%", "--fs": "11px", "--ls": "0" } as CSSProperties}>
          {details.batchTime || ""}
        </div>

        <div data-field="qualification" className="admission-field admission-small" style={{ top: "71.1%", left: "6.5%", width: "12%", "--fs": "14px", "--ls": "0" } as CSSProperties}>
          {student.qualification || ""}
        </div>
        <div data-field="qualification-school" className="admission-field admission-small" style={{ top: "71.1%", left: "23.3%", width: "33%", "--fs": "14px", "--ls": "0" } as CSSProperties}>
          {details.qualificationSchool || ""}
        </div>
        <div data-field="qualification-board" className="admission-field admission-small" style={{ top: "71.1%", left: "58.9%", width: "11%", "--fs": "14px", "--ls": "0" } as CSSProperties}>
          {details.qualificationBoard || ""}
        </div>
        <div data-field="qualification-marks" className="admission-field admission-small" style={{ top: "71.1%", left: "72%", width: "9%", "--fs": "14px", "--ls": "0" } as CSSProperties}>
          {details.qualificationMarks || ""}
        </div>
        <div data-field="qualification-year" className="admission-field admission-small" style={{ top: "71.1%", left: "83.3%", width: "10%", "--fs": "14px", "--ls": "0" } as CSSProperties}>
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
