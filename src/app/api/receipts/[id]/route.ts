import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateReceiptPdf } from "@/lib/pdf/receipt";

function safePdfName(receiptNumber: string) {
  const safeReceiptNumber = receiptNumber.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `receipt-${safeReceiptNumber}.pdf`;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const receipt = await db.receipt.findUnique({
    where: { id },
    include: {
      paymentSubmission: {
        include: {
          student: {
            include: {
              course: true,
              feeRecord: true,
              institute: true,
            },
          },
        },
      },
    },
  });

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }

  // Authorization: admin or the student who owns this payment
  const isAdmin = session.role === "ADMIN";
  const isOwner =
    session.role === "STUDENT" &&
    session.studentId === receipt.paymentSubmission.studentId;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Same-institute check
  if (receipt.instituteId !== session.instituteId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { paymentSubmission: payment } = receipt;
    const pdf = await generateReceiptPdf({
      receiptNumber: receipt.receiptNumber,
      studentName: payment.student.name,
      enrollmentNumber: payment.student.enrollmentNumber ?? "",
      courseName: payment.student.course?.name ?? "N/A",
      amount: payment.amount,
      totalFee: payment.student.feeRecord?.totalFee ?? payment.amount,
      paidAmount: payment.student.feeRecord?.receivedAmount ?? payment.amount,
      dueAmount: payment.student.feeRecord?.dueAmount ?? 0,
      transactionId: payment.transactionId,
      paymentDate: payment.createdAt,
      verifiedAt: payment.verifiedAt ?? receipt.generatedAt,
      instituteName: payment.student.institute.name,
    });
    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safePdfName(receipt.receiptNumber)}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Could not retrieve receipt" }, { status: 500 });
  }
}
