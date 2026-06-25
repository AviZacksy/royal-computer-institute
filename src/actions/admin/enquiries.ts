"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { enquiryStatusSchema } from "@/lib/validations";
import type { ActionState } from "./types";

export async function updateEnquiryStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = enquiryStatusSchema.safeParse({
      enquiryId: formData.get("enquiryId"),
      status: formData.get("status"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    const enquiry = await db.enquiry.findFirst({
      where: { id: parsed.data.enquiryId, instituteId: session.instituteId },
    });
    if (!enquiry) {
      return { error: "Enquiry not found" };
    }

    await db.enquiry.update({
      where: { id: enquiry.id },
      data: { status: parsed.data.status },
    });

    revalidatePath("/admin/enquiries");
    return { success: "Status updated" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
