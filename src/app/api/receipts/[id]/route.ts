import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { getFileUrl } from "@/lib/storage";
import { STORAGE_BUCKETS } from "@/lib/storage/types";

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
        include: { student: true },
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
    const url = await getFileUrl(STORAGE_BUCKETS.documents, receipt.storageKey);
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.json({ error: "Could not retrieve receipt" }, { status: 500 });
  }
}
