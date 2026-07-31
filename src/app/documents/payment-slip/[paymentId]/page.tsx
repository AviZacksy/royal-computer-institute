import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { AutoPrint } from "@/components/documents/AutoPrint";
import { PrintButton } from "@/components/documents/PrintButton";

export default async function PaymentSlipDocument({
  params,
  searchParams,
}: {
  params: Promise<{ paymentId: string }>;
  searchParams: Promise<{ print?: string }>;
}) {
  const { paymentId } = await params;
  const { print } = await searchParams;
  
  const payment = await db.paymentSubmission.findUnique({
    where: { id: paymentId },
    include: {
      student: {
        include: { course: true }
      },
      receipt: true,
    }
  });

  if (!payment) return notFound();
  
  const feeRecord = await db.feeRecord.findUnique({
    where: { studentId: payment.studentId }
  });

  // Calculate historical balance
  const allPayments = await db.paymentSubmission.findMany({
    where: { studentId: payment.studentId },
    orderBy: { createdAt: "asc" }
  });

  let runningPaid = 0;
  let targetPaidSoFar = 0;
  for (const p of allPayments) {
    if (p.status === "VERIFIED") {
      runningPaid += p.amount;
    }
    if (p.id === paymentId) {
      if (p.status !== "VERIFIED") {
        targetPaidSoFar = runningPaid + p.amount;
      } else {
        targetPaidSoFar = runningPaid;
      }
      break;
    }
  }

  const totalFee = feeRecord?.totalFee || 0;
  const paidFee = payment.amount;
  const dueAmount = Math.max(0, totalFee - targetPaidSoFar);
  const fatherName = payment.student.fatherName || payment.student.motherName || "";
  const paymentDate = payment.createdAt.toLocaleDateString('en-IN');
  const paymentMode = payment.transactionId ? "ONLINE" : "CASH";
  const receiptNumber = payment.receipt?.receiptNumber || "";

  return (
    <div className="print-wrapper" style={{
      width: '210mm',
      height: '140mm', // 21cm x 14cm
      position: 'relative',
      margin: '40px auto',
      boxSizing: 'border-box',
      color: 'black',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: 'white',
      overflow: 'hidden',
    }}>
      <AutoPrint enabled={print === "1"} />
      <style>{`
        @page {
          size: A4 portrait;
          margin: 0;
        }
        @media print {
          html, body {
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
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
            width: 210mm !important;
            height: 140mm !important;
            transform: none !important;
            rotate: 0deg !important;
            writing-mode: horizontal-tb !important;
            page-break-after: avoid;
            page-break-inside: avoid;
          }
        }

        .receipt-sheet {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: fill;
          z-index: 0;
        }

        .receipt-field {
          position: absolute;
          z-index: 2;
          font-weight: 600;
          font-size: 4mm;
          color: #000;
          white-space: nowrap;
        }

        /* POSITIONS FROM DEV TOOLS */
        .field-student-name {
          left: 97mm;
          top: 54mm;
          width: 80mm;
        }

        .field-father-name {
          left: 54mm;
          top: 65mm;
          width: 60mm;
        }

        .field-batch-time {
          left: 148mm;
          top: 64mm;
          width: 40mm;
        }

        .field-total-fee {
          left: 49mm;
          top: 77mm;
        }

        .field-paid-fee {
          left: 108mm;
          top: 77mm;
        }

        .field-due-amount {
          left: 170mm;
          top: 77mm;
        }

        .field-date {
          left: 35mm;
          top: 88mm;
        }

        .field-payment-mode {
          left: 120mm;
          top: 88mm;
        }

        .field-receipt-number {
          left: 165mm;
          top: 42mm;
          font-weight: 700;
          font-size: 3.5mm;
          color: #000;
        }

        .signature-box {
          position: absolute;
          z-index: 2;
          right: 31mm;
          bottom: 17mm;
          width: 40mm;
          height: 31mm;
        }
        .signature-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .stamp-box {
          position: absolute;
          z-index: 1;
          right: 14mm;
          bottom: 26mm;
          width: 35mm;
          height: 20mm;
          opacity: 0.85;
        }
        .stamp-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      `}</style>
      
      <div className="no-print" style={{ position: 'absolute', top: '-40px', right: '0', zIndex: 100 }}>
        <PrintButton />
      </div>

      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="receipt-sheet" src="/fee-reciept.jpg" alt="Receipt design" />

        <div className="receipt-field field-student-name">{payment.student.name}</div>
        <div className="receipt-field field-father-name">{fatherName}</div>
        <div className="receipt-field field-batch-time"></div>
        <div className="receipt-field field-total-fee">Rs. {totalFee}</div>
        <div className="receipt-field field-paid-fee">Rs. {paidFee}</div>
        <div className="receipt-field field-due-amount">Rs. {dueAmount}</div>
        <div className="receipt-field field-date">{paymentDate}</div>
        <div className="receipt-field field-payment-mode">{paymentMode}</div>
        <div className="receipt-field field-receipt-number">{receiptNumber}</div>

        <div className="stamp-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stamp.png" alt="Stamp" />
        </div>

        <div className="signature-box">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/signature.png" alt="Signature" />
        </div>
      </div>
    </div>
  );
}
