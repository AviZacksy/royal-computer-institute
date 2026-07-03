import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/documents/PrintButton";

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
  
  return (
    <div className="print-wrapper" style={{
      width: '54mm',
      height: '86mm', // CR80 standard ID card
      backgroundColor: 'white',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      overflow: 'hidden',
      border: '1px solid #ccc'
    }}>
      <style>{`
        .id-top-curve {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          height: 180px;
          background: #004ba0;
          border-bottom-left-radius: 50%;
          border-bottom-right-radius: 10%;
          z-index: 1;
        }
        .id-top-curve-light {
          position: absolute;
          top: -20px;
          left: -20px;
          right: -20px;
          height: 195px;
          background: #0288d1;
          border-bottom-left-radius: 50%;
          border-bottom-right-radius: 15%;
          z-index: 0;
        }
        .id-bottom-curve {
          position: absolute;
          bottom: -20px;
          left: -20px;
          right: -20px;
          height: 80px;
          background: #004ba0;
          border-top-left-radius: 10%;
          border-top-right-radius: 50%;
          z-index: 1;
        }
        .id-bottom-curve-light {
          position: absolute;
          bottom: -20px;
          left: -20px;
          right: -20px;
          height: 95px;
          background: #0288d1;
          border-top-left-radius: 15%;
          border-top-right-radius: 50%;
          z-index: 0;
        }
        .id-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        .id-header-text {
          color: white;
          text-align: center;
          padding-top: 10px;
        }
        .id-title {
          font-family: 'Impact', sans-serif;
          font-size: 16px;
          margin: 0;
          color: white;
          text-shadow: 1px 1px 0px #ffeb3b;
          letter-spacing: 0.5px;
        }
        .id-subtitle {
          font-style: italic;
          font-size: 8px;
          margin: 2px 0;
        }
        .id-website {
          font-size: 12px;
          font-weight: bold;
          color: #00e5ff;
          margin-bottom: 2px;
        }
        .id-reg {
          font-size: 6px;
          line-height: 1.2;
        }
        .id-badge {
          background: #ff8f00;
          color: yellow;
          font-weight: bold;
          font-size: 10px;
          text-align: center;
          padding: 3px 10px;
          border-radius: 10px;
          margin: 5px auto;
          width: fit-content;
          border: 1px solid red;
        }
        .id-photo-container {
          display: flex;
          justify-content: center;
          margin-top: 10px;
          position: relative;
        }
        .id-photo {
          width: 70px;
          height: 90px;
          border: 1px solid #ccc;
          background: #f9f9f9;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          color: #999;
          overflow: hidden;
        }
        .id-details {
          padding: 10px 15px;
          font-size: 10px;
          font-weight: bold;
          line-height: 1.8;
          flex-grow: 1;
        }
        .id-footer {
          color: white;
          padding: 5px 10px 15px;
          font-size: 8px;
          font-weight: bold;
          text-align: right;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
        }
        .id-sign {
          position: absolute;
          bottom: 45px;
          left: 15px;
          font-size: 8px;
          color: red;
          font-style: italic;
          font-weight: bold;
        }
      `}</style>

      <div className="no-print" style={{ position: 'absolute', top: '-40px', right: '0' }}>
        <PrintButton />
      </div>

      <div className="id-top-curve-light"></div>
      <div className="id-top-curve"></div>
      
      <div className="id-bottom-curve-light"></div>
      <div className="id-bottom-curve"></div>

      <div className="id-content">
        <div className="id-header-text">
          <h1 className="id-title">ROYAL COMPUTER INSTITUTE</h1>
          <div className="id-subtitle">Of Information Technology</div>
          <div className="id-website">www.royalcomputerit.in</div>
          <div className="id-reg">[Reg. Under the companies Act, 2013 MSME Govt. of India]<br/>An ISO 9001:2015 Certified Organisation</div>
        </div>

        <div className="id-badge">STUDENT&apos;S ID CARD</div>

        <div className="id-photo-container">
           <div className="id-photo">
             {student.photoStorageKey ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={`/api/media/${student.photoStorageKey}`} alt="Student" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
             ) : (
               "Photo"
             )}
           </div>
        </div>

        <div className="id-details">
          <div>Student Name: <span style={{fontWeight: 'normal'}}>{student.name}</span></div>
          <div>Course Name: <span style={{fontWeight: 'normal'}}>{student.course?.name}</span></div>
          <div>Mobile Number: <span style={{fontWeight: 'normal'}}>{student.phone}</span></div>
          <div>Enrollment No: <span style={{fontWeight: 'normal'}}>{student.enrollmentNumber || "-"}</span></div>
          <div>Batch: <span style={{fontWeight: 'normal'}}>{student.batchTime || "-"}</span></div>
          {student.studentIdCards?.[0]?.validUntil && (
            <div>Validity: <span style={{fontWeight: 'normal'}}>{new Date(student.studentIdCards[0].validUntil).toLocaleDateString('en-IN')}</span></div>
          )}
        </div>

        <div className="id-sign">
          <div style={{ borderBottom: '1px solid black', width: '40px', marginBottom: '2px' }}></div>
          Director :
        </div>

        <div className="id-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ color: '#00e5ff' }}>&#9990;</span> 7352794558, 6209552882
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <span style={{ color: '#00e5ff' }}>&#128205;</span> Bhawanipur Zirat, Motihari
          </div>
        </div>
      </div>
    </div>
  );
}
