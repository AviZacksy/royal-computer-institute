"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdminContext } from "@/lib/admin-context";
import { createSession } from "@/lib/auth";
import { adminAccountSettingsSchema } from "@/lib/validations";
import type { ActionState } from "./types";

export async function updateAdminAccountAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const session = await requireAdminContext();
    const parsed = adminAccountSettingsSchema.safeParse({
      currentPassword: formData.get("currentPassword"),
      newEmail: formData.get("newEmail"),
      newPassword: formData.get("newPassword"),
      confirmNewPassword: formData.get("confirmNewPassword"),
    });

    if (!parsed.success) {
      return { error: parsed.error.errors[0]?.message ?? "Invalid account details" };
    }

    const newEmail = parsed.data.newEmail.toLowerCase().trim();
    const admin = await db.user.findFirst({
      where: {
        id: session.userId,
        instituteId: session.instituteId,
        role: "ADMIN",
      },
      select: {
        id: true,
        instituteId: true,
        email: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!admin) {
      return { error: "Admin account not found" };
    }

    const validPassword = await bcrypt.compare(
      parsed.data.currentPassword,
      admin.passwordHash,
    );
    if (!validPassword) {
      return { error: "Current password is incorrect" };
    }

    const duplicate = await db.user.findFirst({
      where: {
        instituteId: session.instituteId,
        email: { equals: newEmail, mode: "insensitive" },
        NOT: { id: admin.id },
      },
      select: { id: true },
    });
    if (duplicate) {
      return { error: "An account with this email already exists" };
    }

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    const updated = await db.user.update({
      where: { id: admin.id },
      data: {
        email: newEmail,
        passwordHash,
      },
      select: {
        id: true,
        instituteId: true,
        email: true,
        role: true,
      },
    });

    await createSession({
      userId: updated.id,
      instituteId: updated.instituteId,
      email: updated.email,
      role: updated.role,
    });

    revalidatePath("/admin/settings");
    revalidatePath("/admin/dashboard");
    return { success: "Admin account updated successfully" };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
