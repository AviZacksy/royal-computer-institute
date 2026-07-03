import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PrintButton } from "@/components/documents/PrintButton";
import { MapPin, Phone, Mail } from "lucide-react";

export default async function PaymentSlipDocument({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;
  
  const payment = await db.paymentSubmission.findUnique({
    where: { id: paymentId },
    include: {
      student: {
        include: { course: true }
      },
    }
  });

  if (!payment) return notFound();
  
  const feeRecord = await db.feeRecord.findUnique({
    where: { studentId: payment.studentId }
  });

  const totalFee = feeRecord?.totalFee || 0;
  const paidFee = payment.amount;
  const dueAmount = feeRecord?.dueAmount || 0;

  return (
    <div className="print-wrapper" style={{
      width: '210mm',
      height: '148mm', // A5 landscape (half A4)
      backgroundColor: 'white',
      padding: '10mm',
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',
      color: 'black',
      fontFamily: 'Arial, sans-serif'
    }}>
      <style>{`
        .slip-border {
           border: 2px solid #2e7d32; /* Green outer */
           padding: 2px;
           height: 100%;
           box-sizing: border-box;
        }
        .slip-inner-border {
           border: 2px solid #e65100; /* Orange inner */
           height: 100%;
           box-sizing: border-box;
           padding: 20px;
           position: relative;
           display: flex;
           flex-direction: column;
        }
        .line-input {
           border-bottom: 1px solid black;
           display: inline-block;
           font-weight: normal;
           padding: 0 10px;
           min-height: 1.2em;
        }
        .text-row {
           font-size: 16px;
           margin-bottom: 25px;
           line-height: 1.5;
           display: flex;
           align-items: baseline;
           white-space: nowrap;
        }
        .bottom-bar {
           position: absolute;
           bottom: 10px;
           left: 10px;
           right: 10px;
           display: flex;
           justify-content: space-between;
           border-top: 2px solid #e65100;
           padding-top: 10px;
           font-size: 12px;
           color: #1a237e;
           font-weight: bold;
        }
        .icon-text {
           display: flex;
           align-items: center;
           gap: 5px;
        }
      `}</style>
      
      <div className="no-print" style={{ position: 'absolute', top: '-50px', right: '0' }}>
        <PrintButton />
      </div>

      <div className="slip-border">
        <div className="slip-inner-border">
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {/* Logo Placeholder */}
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #e65100', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src="/logo/logo.jpeg" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <h1 style={{ margin: 0, fontSize: '36px', color: '#e65100', fontFamily: 'Impact, sans-serif', letterSpacing: '1px' }}>ROYAL COMPUTER</h1>
                <h1 style={{ margin: 0, fontSize: '36px', color: '#2e7d32', fontFamily: 'Impact, sans-serif', letterSpacing: '1px', marginTop: '-5px' }}>INSTITUTE</h1>
              </div>
            </div>
          </div>

          {/* Payment Slip Badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
             <div style={{ 
                background: 'linear-gradient(to right, #1565c0, #00838f)', 
                color: 'white', 
                padding: '5px 40px', 
                borderRadius: '20px', 
                fontSize: '20px', 
                fontWeight: 'bold',
                letterSpacing: '1px'
             }}>
                PAYMENT SLIP
             </div>
          </div>

          {/* Form Fields */}
          <div className="text-row">
            <span>Received with thanks from Mr./Mrs. :</span>
            <span className="line-input" style={{ flexGrow: 1, marginLeft: '10px' }}>{payment.student.name}</span>
          </div>

          <div className="text-row">
            <span>SO/DO/CO Mr. :</span>
            <span className="line-input" style={{ flexGrow: 1, marginLeft: '10px', marginRight: '20px' }}>{payment.student.fatherName || payment.student.motherName || ""}</span>
            <span>Batch Time :</span>
            <span className="line-input" style={{ width: '150px', marginLeft: '10px' }}></span>
          </div>

          <div className="text-row">
            <span>Total Fee :</span>
            <span className="line-input" style={{ flexGrow: 1, marginLeft: '10px', marginRight: '20px' }}>Rs. {totalFee}</span>
            <span>Paid Fee :</span>
            <span className="line-input" style={{ flexGrow: 1, marginLeft: '10px', marginRight: '20px' }}>Rs. {paidFee}</span>
            <span>Due Amount :</span>
            <span className="line-input" style={{ flexGrow: 1, marginLeft: '10px' }}>Rs. {dueAmount}</span>
          </div>

          <div className="text-row">
            <span>Date :</span>
            <span className="line-input" style={{ flexGrow: 1, marginLeft: '10px', marginRight: '20px' }}>{payment.createdAt.toLocaleDateString('en-IN')}</span>
            <span>Payment Mode :</span>
            <span className="line-input" style={{ flexGrow: 1, marginLeft: '10px' }}>{payment.paymentType}</span>
            <span>.</span>
          </div>

          {/* Footer Area */}
          <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '30px' }}>
            <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
               *Students can make next payment on their online account<br/>
               after logging in to <a href="https://royalcomputerit.in" style={{ color: '#0288d1', textDecoration: 'none', fontWeight: 'bold' }}>royalcomputerit.in</a> using their id password.
            </div>
            <div style={{ textAlign: 'center' }}>
               <div style={{ borderBottom: '1px solid black', width: '150px', marginBottom: '5px' }}></div>
               <div style={{ fontSize: '14px' }}>Accounts Sign/Stamp</div>
            </div>
          </div>

          {/* Bottom Bar Info */}
          <div className="bottom-bar">
             <div className="icon-text"><MapPin size={14} /> Bhawanipur Zirat, Infront of Stone Clinic, Motihari-845401</div>
             <div>|</div>
             <div className="icon-text"><Phone size={14} /> +91 73527 94558 &nbsp; +91 62095 52882</div>
             <div>|</div>
             <div className="icon-text"><Mail size={14} /> instituteroyalcomputer52@gmail.com</div>
          </div>

        </div>
      </div>

    </div>
  );
}
