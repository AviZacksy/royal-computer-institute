import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  req: NextRequest,
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
        select: {
          id: true,
          studentId: true,
        },
      },
    },
  });

  if (!receipt) {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }

  const isAdmin = session.role === "ADMIN";
  const isOwner =
    session.role === "STUDENT" &&
    session.studentId === receipt.paymentSubmission.studentId;

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (receipt.instituteId !== session.instituteId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.redirect(
    new URL(`/documents/payment-slip/${receipt.paymentSubmission.id}?print=1`, req.url),
  );
}
