import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/documents/PrintButton";
import { getFileUrl } from "@/lib/storage";

export default async function IdCardDocument({
  params,
}: {
  params: Promise<{ studentId: string }>;
}) {
  const { studentId } = await params;
  const student = await db.studentProfile.findUnique({
    where: { id: studentId },
    include: { course: true, institute: true, studentIdCards: true },
  });

  if (!student) return notFound();

  const photoUrl = student.photoStorageKey ? await getFileUrl("documents", student.photoStorageKey) : null;

  return (
    <div
      className="print-wrapper"
      style={{
        width: "54mm",
        height: "86mm",
        backgroundImage: "url(/id-card.jpg)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "white",
        position: "relative",
        margin: "0 auto",
        boxSizing: "border-box",
        color: "black",
        fontFamily: "Arial, sans-serif",
        overflow: "hidden",
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
          .print-wrapper { margin: 20mm !important; width: 54mm !important; height: 86mm !important; box-shadow: none !important; }
        }

        .id-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
        }

        .id-photo {
          position: absolute;
          top: 32.5%;
          left: 50%;
          width: 18.5mm;
          height: 23mm;
          transform: translateX(-50%);
          object-fit: cover;
          border-radius: 1.5mm;
        }

        .id-field {
          position: absolute;
          left: 41%;
          width: 62%;
          color: #111;
          font-size: var(--fs, 6.4px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: var(--ls, 0);
          white-space: nowrap;
          overflow: hidden;
          text-transform: uppercase;
        }

        .id-signature {
          position: absolute;
          right: 67%;
          bottom: 7.5%;
          width: 17mm;
          height: 12mm;
          object-fit: contain;
        }
      `}</style>

      <div className="no-print" style={{ position: "absolute", top: "-40px", right: "0", zIndex: 100 }}>
        <PrintButton />
      </div>

      <div className="id-overlay">
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="id-photo" src={photoUrl} alt="Student" />
        )}

        <div data-field="id-student-name" className="id-field" style={{ top: "65%", "--fs": "6.4px", "--ls": "0" } as CSSProperties}>
          {student.name}
        </div>
        <div data-field="id-course-name" className="id-field" style={{ top: "69.6%", "--fs": "6.4px", "--ls": "0" } as CSSProperties}>
          {student.course?.name || ""}
        </div>
        <div data-field="id-mobile" className="id-field" style={{ top: "73.8%", "--fs": "6.4px", "--ls": "0" } as CSSProperties}>
          {student.phone}
        </div>
        <div data-field="id-referral" className="id-field" style={{ top: "79%", "--fs": "6.4px", "--ls": "0" } as CSSProperties}>
          {student.enrollmentNumber || "-"}
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="id-signature" src="/signature.png" alt="Director signature" />
      </div>
    </div>
  );
}
