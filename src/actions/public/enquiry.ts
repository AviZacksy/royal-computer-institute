"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireDefaultInstitute } from "@/lib/institute";
import { publicEnquirySchema } from "@/lib/validations";
import type { ActionState } from "@/actions/admin/types";

export async function submitEnquiryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const institute = await requireDefaultInstitute();
    const courseId = (formData.get("courseId") as string) || undefined;

    let courseInterest = (formData.get("courseInterest") as string) || undefined;
    if (courseId) {
      const course = await db.course.findFirst({
        where: { id: courseId, instituteId: institute.id, isActive: true },
      });
      if (course) {
        courseInterest = course.name;
      }
    }

    const parsed = publicEnquirySchema.safeParse({
      name: formData.get("name"),
      phone: formData.get("phone"),
      courseId,
      courseInterest,
      message: formData.get("message"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
    }

    await db.enquiry.create({
      data: {
        instituteId: institute.id,
        name: parsed.data.name.trim(),
        phone: parsed.data.phone.trim(),
        courseInterest: parsed.data.courseInterest?.trim() || null,
        message: parsed.data.message.trim(),
        courseId: parsed.data.courseId || null,
        status: "NEW",
      },
    });

    revalidatePath("/admin/enquiries");
    return { success: "Your enquiry has been submitted. We will contact you soon." };
  } catch {
    return { error: "Unable to submit enquiry. Please try again later." };
  }
}
