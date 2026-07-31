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
    fatherName: formData.get("fatherName"),
    motherName: formData.get("motherName"),
    gender: formData.get("gender"),
    dateOfBirth: formData.get("dateOfBirth"),
    aadhaarNumber: formData.get("aadhaarNumber"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    parentsMobile: formData.get("parentsMobile"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    courseId: formData.get("courseId"),
    qualification: formData.get("qualification"),
    qualificationSchool: formData.get("qualificationSchool"),
    qualificationBoard: formData.get("qualificationBoard"),
    qualificationMarks: formData.get("qualificationMarks"),
    qualificationYear: formData.get("qualificationYear"),
    permVillage: formData.get("permVillage"),
    permPost: formData.get("permPost"),
    permPS: formData.get("permPS"),
    permDistrict: formData.get("permDistrict"),
    permState: formData.get("permState"),
    permPinCode: formData.get("permPinCode"),
    currVillage: formData.get("currVillage"),
    currPost: formData.get("currPost"),
    currPS: formData.get("currPS"),
    currDistrict: formData.get("currDistrict"),
    currState: formData.get("currState"),
    currPinCode: formData.get("currPinCode"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  }

  const files = {
    photo: formData.get("studentPhoto"),
    marksheet: formData.get("marksheet"),
    aadhaarCard: formData.get("aadhaarCard"),
    signature: formData.get("signature"),
  };
  for (const [label, file] of Object.entries(files)) {
    const error = validateAdmissionFile(label, file);
    if (error) return { error };
  }

  const { 
    confirmPassword: _confirmPassword, 
    permVillage, permPost, permPS, permDistrict, permState, permPinCode,
    currVillage, currPost, currPS, currDistrict, currState, currPinCode,
    ...data 
  } = parsed.data;

  const permanentAddress = `Village: ${permVillage}, Post: ${permPost}, P.S: ${permPS}, District: ${permDistrict}, State: ${permState}, Pin Code: ${permPinCode}`;
  const currentAddress = `Village: ${currVillage}, Post: ${currPost}, P.S: ${currPS}, District: ${currDistrict}, State: ${currState}, Pin Code: ${currPinCode}`;

  const result = await registerStudent({
    ...data,
    permanentAddress,
    currentAddress,
    files: files as {
      photo: File;
      marksheet: File;
      aadhaarCard: File;
      signature: File;
    },
  });
  if (!result.ok) {
    return { error: result.error };
  }

  return {
    success: "Registration submitted successfully. Your admission form has been generated.",
    admissionNumber: result.admissionNumber,
  };
}

export async function logoutAction() {
  await logoutUser();
  redirect("/");
}

function validateAdmissionFile(label: string, value: FormDataEntryValue | null) {
  const names: Record<string, string> = {
    photo: "Student photo",
    marksheet: "Marksheet",
    aadhaarCard: "Aadhaar card",
    signature: "Signature",
  };
  const display = names[label] ?? "File";
  if (!(value instanceof File) || value.size === 0) {
    return `${display} is required`;
  }
  if (value.size > 5 * 1024 * 1024) {
    return `${display} must be 5MB or smaller`;
  }
  const allowed =
    value.type.startsWith("image/") ||
    value.type === "application/pdf";
  if (!allowed) {
    return `${display} must be an image or PDF`;
  }
  return null;
}
