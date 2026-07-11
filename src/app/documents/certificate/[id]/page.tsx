import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getFileUrl } from "@/lib/storage";
import { PrintButton } from "@/components/documents/PrintButton";
import QRCode from "react-qr-code";

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

  const photoUrl = certificate.student.photoStorageKey ? await getFileUrl("documents", certificate.student.photoStorageKey) : null;
  const formattedDate = certificate.generatedAt.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
  const durationText = /month/i.test(certificate.course.duration)
    ? certificate.course.duration
    : `${certificate.course.duration} MONTHS`;

  const verificationUrl = `https://royalcomputer.in/verify/${certificate.id}`;

  return (
    <div className="print-wrapper" style={{
      width: '297mm',
      height: '210mm',
      position: 'relative',
      margin: '40px auto',
      boxSizing: 'border-box',
      color: 'black',
      fontFamily: '"Times New Roman", Times, serif',
      backgroundColor: 'white',
      overflow: 'hidden',
    }}>
      <style>{`
        @page {
          size: A4 landscape;
          margin: 0;
        }
        @media print {
          html, body {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            overflow: hidden !important;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { display: none !important; }
          .print-wrapper {
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            width: 297mm !important;
            height: 210mm !important;
            transform: none !important;
            transform-origin: top left !important;
            rotate: 0deg !important;
            writing-mode: horizontal-tb !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
        }

        .certificate-sheet {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          z-index: 0;
        }

        .cert-field {
          position: absolute;
          z-index: 2;
          text-align: center;
          font-weight: 700;
          font-style: normal;
          color: #000;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .reg-no {
          left: 102mm;
          top: 17.4mm;
          width: 34mm;
          font-size: 7.8mm;
          text-align: left;
        }

        .sl-no {
          left: 221mm;
          top: 21.4mm;
          width: 99mm;
          font-size: 3.8mm;
          text-align: left;
        }

        .issue-date-value {
          left: 60mm;
          top: 80.2mm;
          width: 34mm;
          font-size: 3mm;
          text-align: left;
        }

        .student-name {
          left: 154mm;
          top: 96.8mm;
          width: 73mm;
          font-size: 6.8mm;
        }

        .course-name {
          left: 163mm;
          top: 107.8mm;
          width: 101mm;
          font-size: 7.8mm;
        }

        .course-duration {
          left: 58mm;
          top: 126.2mm;
          width: 27mm;
          font-size: 3mm;
        }

        .grade {
          left: 120mm;
          top: 120.2mm;
          width: 8mm;
          font-size: 10mm;
        }

        .marks {
          left: 171mm;
          top: 123.2mm;
          width: 16mm;
          font-size: 6mm;
        }

        .photo-box {
          position: absolute;
          z-index: 2;
          right: 24.4mm;
          top: 59.8mm;
          width: 32.5mm;
          height: 42.5mm;
          overflow: hidden;
          background: transparent;
        }

        .photo-box img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .signature-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .signature-box {
          position: absolute;
          z-index: 2;
          right: 20mm;
          bottom: 26mm;
          width: 61mm;
          height: 42mm;
        }

        .qr-box {
          position: absolute;
          z-index: 2;
          left: 24mm;
          bottom: 37mm;
          width: 32mm;
          height: 32mm;
          background: white;
        }

      `}</style>
      
      <div className="no-print" style={{ position: 'absolute', top: '-40px', right: '0', zIndex: 100 }}>
        <PrintButton />
      </div>

      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="certificate-sheet" src="/certificate-design.jpg" alt="Certificate design" />

        <div className="cert-field reg-no">{certificate.student.enrollmentNumber || ""}</div>
        <div className="cert-field sl-no">{certificate.certificateNumber || ""}</div>
        <div className="cert-field issue-date-value">{formattedDate}</div>
        <div className="cert-field student-name">{certificate.student.name}</div>
        <div className="cert-field course-name">{certificate.course.name}</div>
        <div className="cert-field course-duration">{durationText}</div>
        <div className="cert-field grade">A</div>
        <div className="cert-field marks">85%</div>

        {photoUrl ? (
          <div className="photo-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photoUrl} alt="Student Photo" />
          </div>
        ) : null}

        <div className="signature-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/signature.png" alt="Signature" style={{ objectFit: 'contain' }} />
        </div>

        <div className="qr-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <QRCode
            value={verificationUrl}
            size={256}
            style={{ display: "block", width: "100%", height: "100%" }}
            viewBox={`0 0 256 256`}
            level="M"
          />
        </div>
      </div>
    </div>
  );
}
