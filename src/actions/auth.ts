"use server";

import { redirect } from "next/navigation";
import { loginUser, logoutUser, registerStudent } from "@/lib/auth";
import { loginSchema, registerSchema } from "@/lib/validations";
import type { Role } from "@prisma/client";

export async function loginAction(formData: FormData, role: Role) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const result = await loginUser(parsed.data.email, parsed.data.password, role);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect(result.redirect);
}

export async function adminLoginAction(formData: FormData) {
  return loginAction(formData, "ADMIN");
}

export async function studentLoginAction(formData: FormData) {
  return loginAction(formData, "STUDENT");
}

export async function registerAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    courseId: formData.get("courseId") || undefined,
    address: formData.get("address") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const { confirmPassword: _confirmPassword, ...data } = parsed.data;
  const result = await registerStudent(data);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect(result.redirect);
}

export async function logoutAction() {
  await logoutUser();
  redirect("/");
}
