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
  
  let grade = "C";
  if (percentage >= 85) grade = "A+";
  else if (percentage >= 70) grade = "A";
  else if (percentage >= 55) grade = "B";

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
      /* The exact blank marksheet image goes here */
      backgroundImage: 'url(/marksheet-bg.jpg)',
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

        /* Estimated Positions for Marksheet Data Overlay */
        .m-reg {
          position: absolute;
          top: 13%;
          left: 17%;
          font-weight: bold;
          font-size: 12px;
        }
        .m-sl {
          position: absolute;
          top: 13%;
          left: 49%;
          font-weight: bold;
          font-size: 12px;
        }

        .m-student {
          position: absolute;
          top: 30.5%;
          left: 26%;
          width: 25%;
          font-weight: bold;
          font-size: 14px;
        }
        .m-father {
          position: absolute;
          top: 32.5%;
          left: 26%;
          width: 25%;
          font-weight: bold;
          font-size: 14px;
        }
        .m-mother {
          position: absolute;
          top: 34.5%;
          left: 26%;
          width: 25%;
          font-weight: bold;
          font-size: 14px;
        }
        
        .m-course {
          position: absolute;
          top: 30.5%;
          left: 71%;
          width: 20%;
          font-weight: bold;
          font-size: 14px;
        }
        .m-duration {
          position: absolute;
          top: 32.5%;
          left: 71%;
          width: 20%;
          font-weight: bold;
          font-size: 14px;
        }
        .m-dob {
          position: absolute;
          top: 34.5%;
          left: 71%;
          width: 20%;
          font-weight: bold;
          font-size: 14px;
        }

        /* Table Data */
        .m-table-subject {
          position: absolute;
          top: 45%;
          left: 9%;
          width: 40%;
          font-weight: bold;
          font-size: 14px;
        }
        
        .m-table-obj {
          position: absolute;
          top: 45%;
          left: 54.5%;
          width: 8%;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
        }
        .m-table-prac {
          position: absolute;
          top: 45%;
          left: 67%;
          width: 8%;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
        }
        .m-table-total-row {
          position: absolute;
          top: 45%;
          left: 80%;
          width: 10%;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
        }
        
        .m-table-final-total {
          position: absolute;
          top: 67.5%;
          left: 80%;
          width: 10%;
          text-align: center;
          font-weight: bold;
          font-size: 14px;
        }

        .m-result-date {
          position: absolute;
          bottom: 8.5%;
          left: 17%;
          font-weight: bold;
          font-size: 12px;
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

      <div className="no-print" style={{ position: 'absolute', top: '-60px', left: '0', background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>
        INSTRUCTION: Save a completely blank version of the marksheet PDF as an image and place it at "public/marksheet-bg.jpg" for this to work perfectly.
      </div>

      <div className="mark-data-overlay">
        
        <div className="m-reg">{marksheet.student.enrollmentNumber || "-"}</div>
        <div className="m-sl">{marksheet.id.substring(0,8)}</div>
        
        {/* Student Details */}
        <div className="m-student">{marksheet.student.name}</div>
        <div className="m-father">-</div>
        <div className="m-mother">-</div>
        
        <div className="m-course">{marksheet.exam.course.name}</div>
        <div className="m-duration">{marksheet.exam.course.duration} Months</div>
        <div className="m-dob">-</div>
        
        {/* Statement of Marks */}
        <div className="m-table-subject">{marksheet.exam.title}</div>
        <div className="m-table-obj">-</div>
        <div className="m-table-prac">-</div>
        <div className="m-table-total-row">{marksheet.obtainedMarks}</div>
        
        <div className="m-table-final-total">{marksheet.obtainedMarks}</div>
        
        <div className="m-result-date">{new Date().toLocaleDateString('en-IN')}</div>
        
        {/* QR Box Placeholder */}
        <div className="m-qr"></div>
        
      </div>
    </div>
  );
}
