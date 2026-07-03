import { notFound } from "next/navigation";
import { db } from "@/lib/db";
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

  // Helper for formatting dates
  const formatDate = (date?: Date | null) => {
    if (!date) return "...../...../.......";
    return date.toLocaleDateString("en-IN", { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, ' / ');
  };

  const getDay = (date?: Date | null) => date ? date.toLocaleDateString("en-IN", { day: '2-digit' }) : "....";
  const getMonth = (date?: Date | null) => date ? date.toLocaleDateString("en-IN", { month: '2-digit' }) : "....";
  const getYear = (date?: Date | null) => date ? date.toLocaleDateString("en-IN", { year: 'numeric' }) : ".........";

  const renderBoxes = (value: string | null | undefined, count: number) => {
    const chars = (value || "").padEnd(count, ' ').substring(0, count).toUpperCase().split('');
    return (
      <div style={{ display: 'inline-flex', gap: '2px' }}>
        {chars.map((char, i) => (
          <div key={i} style={{ width: '18px', height: '24px', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
            {char.trim()}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="print-wrapper" style={{ 
      width: '210mm', 
      minHeight: '297mm', 
      backgroundColor: 'white', 
      padding: '10mm', 
      position: 'relative',
      margin: '0 auto',
      boxSizing: 'border-box',
      color: 'black',
      fontFamily: 'Arial, sans-serif'
    }}>
      <style>{`
        .dotted-line {
          border-bottom: 2px dotted black;
          flex-grow: 1;
          display: inline-block;
          height: 1.2em;
          margin-left: 8px;
          min-width: 50px;
          font-weight: bold;
          text-align: center;
          text-transform: uppercase;
        }
        .field-row {
          display: flex;
          align-items: flex-end;
          margin-bottom: 15px;
          font-size: 15px;
          font-weight: bold;
        }
        .box-row {
           display: flex;
           align-items: center;
           margin-bottom: 15px;
           font-size: 15px;
           font-weight: bold;
        }
        .qual-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        .qual-table th, .qual-table td {
          border: 1px solid black;
          padding: 8px;
          text-align: left;
          font-weight: bold;
        }
        .qual-table td {
          height: 30px;
        }
        .photo-box {
          position: absolute;
          right: 0;
          top: 0;
          width: 110px;
          height: 140px;
          border: 1px solid black;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 12px;
          padding: 10px;
          box-sizing: border-box;
        }
      `}</style>

      <div className="no-print" style={{ position: 'absolute', top: '-50px', right: '0' }}>
        <PrintButton />
      </div>

      <div style={{ border: '2px solid black', padding: '10px', height: '100%', boxSizing: 'border-box' }}>
        
        {/* Header Top Bar */}
        <div style={{ backgroundColor: 'black', color: 'white', textAlign: 'center', padding: '4px', fontSize: '13px', fontWeight: 'bold' }}>
          भारत सरकार द्वारा मान्यता प्राप्त डिजिटल शिक्षा की सर्वश्रेष्ठ संस्थान &nbsp;/&nbsp; An ISO IAF 9001:2015 Certified Institute
        </div>

        {/* Institute Name */}
        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <h1 style={{ 
            color: 'red', 
            fontSize: '48px', 
            margin: 0, 
            fontFamily: 'Impact, sans-serif',
            textShadow: '2px 2px 0px #ffcc00, -1px -1px 0 #ffcc00, 1px -1px 0 #ffcc00, -1px 1px 0 #ffcc00, 1px 1px 0 #ffcc00',
            letterSpacing: '1px'
          }}>
            ROYAL COMPUTER INSTITUTE
          </h1>
        </div>

        {/* Venue Box */}
        <div style={{ border: '2px solid black', textAlign: 'center', padding: '5px', fontSize: '14px', fontWeight: 'bold', borderRadius: '5px', marginBottom: '15px' }}>
          VENUE :- BHAWANIPUR ZIRAT, IN FRONT OF STONE CLINIC , WOMEN'S COLLEGE ROAD MOTIHARI
        </div>

        {/* Admission Form Header */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
          <div style={{ backgroundColor: 'black', color: 'white', padding: '5px 40px', fontSize: '20px', fontWeight: 'bold', borderRadius: '3px' }}>
            Admission Form
          </div>
        </div>

        {/* Admission Info Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', borderBottom: '2px solid black', paddingBottom: '5px' }}>
          <div>Admission No :- {student.admissionNumber || "..........................."}</div>
          <div>Admission Date :- {formatDate(student.admissionDate)}</div>
        </div>

        {/* Instruction Bar */}
        <div style={{ backgroundColor: 'black', color: 'white', textAlign: 'center', padding: '5px', fontSize: '15px', fontWeight: 'bold', marginBottom: '20px' }}>
          To Fill all statement is CAPITAL Letter , And attached required documents with Form
        </div>

        {/* Form Body - Relative for Photo positioning */}
        <div style={{ position: 'relative', paddingRight: '120px' }}>
          
          <div className="photo-box">
             {student.photoStorageKey ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img src={`/api/media/${student.photoStorageKey}`} alt="Student" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px'}} />
             ) : (
               <>
                 <div style={{marginBottom: '10px'}}>Attached</div>
                 <div>Passport<br/>Size Photo</div>
               </>
             )}
          </div>

          <div className="field-row">
            <span>Student's Name :-</span>
            <span className="dotted-line">{student.name}</span>
          </div>

          <div className="field-row">
            <span>Father's Name :-</span>
            <span className="dotted-line">{student.fatherName || ""}</span>
          </div>

          <div className="field-row">
            <span>Mother's Name :-</span>
            <span className="dotted-line">{student.motherName || ""}</span>
          </div>

          <div className="box-row" style={{ marginTop: '20px' }}>
            <span style={{ marginRight: '10px' }}>Date Of Birth :-</span>
            <div style={{ border: '1px solid black', padding: '2px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center' }}>
              <span>{getDay(student.dateOfBirth)}</span>
              <span style={{ margin: '0 5px' }}>/</span>
              <span>{getMonth(student.dateOfBirth)}</span>
              <span style={{ margin: '0 5px' }}>/</span>
              <span>{getYear(student.dateOfBirth)}</span>
            </div>
            <span style={{ marginLeft: '40px', marginRight: '10px' }}>Gender :-</span>
            <div style={{ border: '1px solid black', padding: '2px 10px', borderRadius: '5px', minWidth: '80px', textAlign: 'center' }}>
              {student.gender ? student.gender.toUpperCase() : ""}
            </div>
          </div>

        </div>

        {/* Full width box rows */}
        <div className="box-row" style={{ marginTop: '20px' }}>
          <span style={{ marginRight: '10px', minWidth: '190px' }}>Students Mobile Number :-</span>
          {renderBoxes(student.phone, 10)}
        </div>

        <div className="box-row">
          <span style={{ marginRight: '10px', minWidth: '190px' }}>Parents Mobile Number :-</span>
          {renderBoxes("", 10)}
        </div>

        <div className="box-row">
          <span style={{ marginRight: '10px', minWidth: '140px' }}>Aadhar Number :-</span>
          {renderBoxes("", 12)}
          <span style={{ marginLeft: '10px', marginRight: '5px' }}>E-Mail Id :-</span>
          <div style={{ border: '1px solid black', flexGrow: 1, height: '26px', padding: '0 5px', fontSize: '13px', display: 'flex', alignItems: 'center' }}>
            {student.email ? student.email.toUpperCase() : ""}
          </div>
        </div>

        {/* Address section */}
        <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '16px', textDecoration: 'underline', marginBottom: '10px' }}>Full Address :-</div>
        
        <div className="box-row">
          <span style={{ marginRight: '10px' }}>Village :-</span>
          <div style={{ border: '1px solid black', flexGrow: 1, height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
          </div>
          <span style={{ marginRight: '10px' }}>Post :-</span>
          <div style={{ border: '1px solid black', flexGrow: 1, height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center', marginRight: '10px' }}></div>
          <span style={{ marginRight: '10px' }}>P.S :-</span>
          <div style={{ border: '1px solid black', flexGrow: 1, height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center' }}></div>
        </div>

        <div className="box-row">
          <span style={{ marginRight: '10px' }}>District :-</span>
          <div style={{ border: '1px solid black', flexGrow: 1, height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center', marginRight: '10px' }}></div>
          <span style={{ marginRight: '10px' }}>State :-</span>
          <div style={{ border: '1px solid black', flexGrow: 1, height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center', marginRight: '10px' }}></div>
          <span style={{ marginRight: '10px' }}>Pin Code :-</span>
          <div style={{ border: '1px solid black', width: '100px', height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center' }}></div>
        </div>
        <div style={{ fontSize: '11px', fontWeight: 'normal', fontStyle: 'italic', marginBottom: '15px' }}>(Recorded Address: {student.address || student.currentAddress || ""})</div>

        <div className="box-row">
          <span style={{ marginRight: '10px' }}>Course Name :-</span>
          <div style={{ border: '1px solid black', flexGrow: 1, height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
            {student.course?.name || ""}
          </div>
          <span style={{ marginRight: '10px' }}>Duration :-</span>
          <div style={{ border: '1px solid black', width: '100px', height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center', marginRight: '10px' }}>
            {student.course?.duration || ""}
          </div>
          <span style={{ marginRight: '10px' }}>Batch Time :-</span>
          <div style={{ border: '1px solid black', width: '100px', height: '26px', padding: '0 5px', display: 'flex', alignItems: 'center' }}></div>
        </div>

        {/* Qualification */}
        <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '16px', textDecoration: 'underline', marginBottom: '10px' }}>Qualification :-</div>
        
        <table className="qual-table">
          <thead>
            <tr>
              <th style={{ width: '15%' }}>Class</th>
              <th style={{ width: '45%' }}>School/College Name</th>
              <th style={{ width: '15%' }}>Board</th>
              <th style={{ width: '10%' }}>Marks %</th>
              <th style={{ width: '15%' }}>Passing Year</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>{student.qualification}</td><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td><td></td></tr>
            <tr><td></td><td></td><td></td><td></td><td></td></tr>
          </tbody>
        </table>

        {/* Declaration */}
        <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '15px', lineHeight: '1.5' }}>
          <div style={{ marginBottom: '5px' }}>➢ Declamation by the Students</div>
          <div style={{ fontWeight: 'normal', fontSize: '14px' }}>
            I declare that the above information is true to the best of my knowledge and brief . I agree to abide the rules and regulation is Royal Computer Institute .
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Student's Signature</div>
             <div style={{ letterSpacing: '3px', fontWeight: 'bold' }}>. . . . . . . . . . . . . . . . . . . . . . .</div>
          </div>
          <div style={{ textAlign: 'center' }}>
             <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Director's Sign</div>
             <div style={{ letterSpacing: '3px', fontWeight: 'bold' }}>. . . . . . . . . . . . . . . . . . . . . . .</div>
          </div>
        </div>

      </div>
    </div>
  );
}
