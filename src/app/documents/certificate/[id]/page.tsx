import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/documents/PrintButton";

export default async function CertificateDocument({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const certificate = await db.certificate.findUnique({
    where: { id },
    include: { student: true, course: true, institute: true },
  });

  if (!certificate) return notFound();

  return (
    <div className="print-wrapper" style={{
      width: '297mm',
      minHeight: '210mm',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      padding: '0',
      /* The exact blank certificate image goes here */
      backgroundImage: 'url(/certificate-bg.jpg)',
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundColor: 'white' // fallback
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
        
        .cert-data-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
        }

        /* 
          These positions are estimated based on the provided PDF image. 
          You can tweak the top/left/width percentages slightly to perfectly align 
          with your exact background image.
        */
        
        .d-reg {
          position: absolute;
          top: 17%;
          left: 45%;
          font-weight: bold;
          font-size: 14px;
        }
        .d-sl {
          position: absolute;
          top: 17%;
          left: 70%;
          font-weight: bold;
          font-size: 14px;
        }

        .d-date {
          position: absolute;
          top: 42%;
          left: 33%;
          font-weight: bold;
          font-size: 14px;
        }

        .d-name {
          position: absolute;
          top: 51.5%;
          left: 46%;
          width: 32%;
          text-align: center;
          font-weight: bold;
          font-size: 20px;
          font-style: italic;
        }

        .d-course {
          position: absolute;
          top: 57.5%;
          left: 51%;
          width: 27%;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
        }

        .d-duration {
          position: absolute;
          top: 61.5%;
          left: 27%;
          width: 8%;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
        }
        
        .d-grade {
          position: absolute;
          top: 61.5%;
          left: 44%;
          width: 4%;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
        }
        
        .d-marks {
          position: absolute;
          top: 61.5%;
          left: 56.5%;
          width: 5%;
          text-align: center;
          font-weight: bold;
          font-size: 16px;
        }

        .d-course-bottom {
          position: absolute;
          top: 67%;
          left: 32%;
          width: 35%;
          text-align: center;
          font-weight: bold;
          font-size: 18px;
        }

        .d-photo {
          position: absolute;
          top: 35%;
          right: 12%;
          width: 25mm;
          height: 32mm;
          /* background: #f0f0f0; uncomment to see the box before photo is added */
        }

        .d-qr {
          position: absolute;
          bottom: 18%;
          left: 12%;
          width: 20mm;
          height: 20mm;
        }
      `}</style>
      
      <div className="no-print" style={{ position: 'absolute', top: '-40px', right: '0', zIndex: 100 }}>
        <PrintButton />
      </div>

      <div className="no-print" style={{ position: 'absolute', top: '-60px', left: '0', background: '#ffebee', color: '#c62828', padding: '10px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>
        INSTRUCTION: Save a completely blank version of the certificate PDF as an image and place it at "public/certificate-bg.jpg" for this to work perfectly.
      </div>

      <div className="cert-data-overlay">
        
        {/* Top Details */}
        <div className="d-reg">{certificate.student.enrollmentNumber || "-"}</div>
        <div className="d-sl">{certificate.certificateNumber}</div>
        
        {/* Date */}
        <div className="d-date">{certificate.generatedAt.toLocaleDateString('en-IN')}</div>
        
        {/* Body Fields */}
        <div className="d-name">{certificate.student.name}</div>
        <div className="d-course">{certificate.course.name}</div>
        
        <div className="d-duration">{certificate.course.duration}M</div>
        <div className="d-grade">{/* Grade placeholder */}A</div>
        <div className="d-marks">{/* Marks placeholder */}85%</div>
        
        <div className="d-course-bottom">{certificate.course.name}</div>

        {/* Photo Box */}
        <div className="d-photo">
          {certificate.student.photoStorageKey && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/api/media/${certificate.student.photoStorageKey}`} alt="Student" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          )}
        </div>

        {/* QR Box Placeholder */}
        <div className="d-qr"></div>
        
      </div>
    </div>
  );
}
