import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/documents/PrintButton";

export default async function MarksheetDocument({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const marksheet = await db.marksheet.findUnique({
    where: { id },
    include: { student: true, exam: { include: { course: true } }, institute: true },
  });

  if (!marksheet) return notFound();

  const percentage = (marksheet.obtainedMarks / marksheet.totalMarks) * 100;
  const grade = marksheet.grade || "C";
  const formattedDate = marksheet.generatedAt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const dob = marksheet.student.dateOfBirth
    ? marksheet.student.dateOfBirth.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "-";
  const durationText = /month/i.test(marksheet.exam.course.duration)
    ? marksheet.exam.course.duration
    : `${marksheet.exam.course.duration} Months`;

  return (
    <div className="print-wrapper" style={{
      width: '210mm',
      minHeight: '297mm',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      padding: '0',
      backgroundImage: 'url(/marksheet.jpg)',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: 'white' // fallback
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        
        .mark-data-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 0; background: white; }
          .no-print { display: none !important; }
          .print-wrapper { margin: 0 !important; box-shadow: none !important; width: 210mm !important; height: 297mm !important; min-height: 297mm !important; }
        }

        .mark-data-overlay div {
          color: #111;
          line-height: 1.1;
          white-space: nowrap;
        }

        .m-reg {
          position: absolute;
          top: 12.7%;
          left: 11.5%;
          font-weight: bold;
          font-size: 11px;
        }
        .m-sl {
          position: absolute;
          top: 12.7%;
          right: 12.5%;
          font-weight: bold;
          font-size: 11px;
        }

        .m-student {
          position: absolute;
          top: 29.3%;
          left: 17.5%;
          width: 32%;
          font-weight: bold;
          font-size: 12px;
        }
        .m-father {
          position: absolute;
          top: 31.35%;
          left: 17.5%;
          width: 32%;
          font-weight: bold;
          font-size: 12px;
        }
        .m-mother {
          position: absolute;
          top: 33.35%;
          left: 17.5%;
          width: 32%;
          font-weight: bold;
          font-size: 12px;
        }
        
        .m-course {
          position: absolute;
          top: 29.3%;
          left: 65%;
          width: 24%;
          font-weight: bold;
          font-size: 11px;
        }
        .m-duration {
          position: absolute;
          top: 31.35%;
          left: 65%;
          width: 24%;
          font-weight: bold;
          font-size: 11px;
        }
        .m-dob {
          position: absolute;
          top: 33.35%;
          left: 65%;
          width: 24%;
          font-weight: bold;
          font-size: 11px;
        }

        /* Table Data */
        .m-table-subject {
          position: absolute;
          top: 44.4%;
          left: 12%;
          width: 42%;
          font-weight: bold;
          font-size: 12px;
        }
        
        .m-table-obj {
          position: absolute;
          top: 44.4%;
          left: 59.8%;
          width: 6%;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }
        .m-table-prac {
          position: absolute;
          top: 44.4%;
          left: 69.9%;
          width: 6%;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }
        .m-table-total-row {
          position: absolute;
          top: 44.4%;
          left: 80%;
          width: 6%;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }
        
        .m-table-final-total {
          position: absolute;
          top: 62.9%;
          left: 80%;
          width: 6%;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }

        .m-total-marks {
          position: absolute;
          top: 44.4%;
          left: 88%;
          width: 6%;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }

        .m-final-total-marks {
          position: absolute;
          top: 62.9%;
          left: 88%;
          width: 6%;
          text-align: center;
          font-weight: bold;
          font-size: 12px;
        }

        .m-grade {
          position: absolute;
          bottom: 16.3%;
          right: 14.4%;
          width: 8%;
          text-align: center;
          font-weight: bold;
          font-size: 13px;
        }

        .m-result-date {
          position: absolute;
          bottom: 5.8%;
          left: 12.5%;
          font-weight: bold;
          font-size: 10px;
        }

        .m-qr {
          position: absolute;
          bottom: 12%;
          left: 10%;
          width: 18mm;
          height: 18mm;
        }
      `}</style>
      
      <div className="no-print" style={{ position: 'absolute', top: '-40px', right: '0', zIndex: 100 }}>
        <PrintButton />
      </div>

      <div className="mark-data-overlay">
        
        <div className="m-reg">{marksheet.student.enrollmentNumber || "-"}</div>
        <div className="m-sl">{marksheet.id.substring(0,8)}</div>
        
        {/* Student Details */}
        <div className="m-student">{marksheet.student.name}</div>
        <div className="m-father">{marksheet.student.fatherName || "-"}</div>
        <div className="m-mother">{marksheet.student.motherName || "-"}</div>
        
        <div className="m-course">{marksheet.exam.course.name}</div>
        <div className="m-duration">{durationText}</div>
        <div className="m-dob">{dob}</div>
        
        {/* Statement of Marks */}
        <div className="m-table-subject">{marksheet.exam.title}</div>
        <div className="m-table-obj">{marksheet.obtainedMarks}</div>
        <div className="m-table-prac">-</div>
        <div className="m-table-total-row">{marksheet.obtainedMarks}</div>
        <div className="m-total-marks">{marksheet.totalMarks}</div>
        
        <div className="m-table-final-total">{marksheet.obtainedMarks}</div>
        <div className="m-final-total-marks">{marksheet.totalMarks}</div>
        <div className="m-grade">{grade} ({percentage.toFixed(1)}%)</div>
        
        <div className="m-result-date">{formattedDate}</div>
        
        {/* QR Box Placeholder */}
        <div className="m-qr"></div>
        
      </div>
    </div>
  );
}
