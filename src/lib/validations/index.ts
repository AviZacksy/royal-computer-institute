import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const adminAccountSettingsSchema = z.object({
  currentPassword: z.string().min(1, "Enter your current password"),
  newEmail: z.string().email("Enter a valid new email"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmNewPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmNewPassword, {
  message: "New passwords do not match",
  path: ["confirmNewPassword"],
});

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  courseId: z.string().optional(),
  address: z.string().optional(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const publicEnquirySchema = z.object({
  name: z.string().min(2, "Enter your name"),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  courseId: z.string().optional(),
  courseInterest: z.string().max(120).optional(),
  message: z.string().min(3, "Enter your message").max(2000),
});

export const enquiryStatusSchema = z.object({
  enquiryId: z.string().min(1),
  status: z.enum(["NEW", "CONTACTED"]),
});

export const galleryItemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(2, "Enter a title").max(120),
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  mediaUrl: z.string().max(2048).optional(),
  category: z.string().max(64).optional(),
  isActive: z.enum(["true", "false"]).optional(),
});

export const enquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional().or(z.literal("")),
  courseInterest: z.string().optional(),
  message: z.string().optional(),
  courseId: z.string().optional(),
});

export const studentApprovalSchema = z.object({
  studentId: z.string().min(1),
  action: z.enum(["approve", "reject"]),
  rejectionReason: z.string().max(500).optional(),
  enrollmentNumber: z.string().max(32).optional(),
  courseId: z.string().optional(),
});

export const assignCourseSchema = z.object({
  studentId: z.string().min(1),
  courseId: z.string().min(1, "Select a course"),
});

export const courseFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Title must be at least 2 characters").max(120),
  description: z.string().min(5, "Description must be at least 5 characters").max(2000),
  duration: z.string().min(2, "Enter duration").max(64),
  totalFee: z.coerce.number().min(0, "Fee cannot be negative").optional(),
  actualFee: z.coerce.number().min(0, "Actual fee cannot be negative"),
  installmentFee: z.coerce.number().min(0, "Installment fee cannot be negative"),
  oneTimeFee: z.coerce.number().min(0, "One-time fee cannot be negative"),
  imagePath: z.string().max(2048).optional(),
  isActive: z.enum(["true", "false"]).optional(),
});

export const feeSchema = z.object({
  studentId: z.string(),
  totalFee: z.coerce.number().min(0),
  receivedAmount: z.coerce.number().min(0),
});

export const feeRecordSchema = z.object({
  studentId: z.string().min(1),
  totalFee: z.coerce.number().min(0, "Total fee cannot be negative"),
});

export const manualPaymentSchema = z.object({
  studentId: z.string().min(1),
  amount: z.coerce.number().min(1, "Amount must be at least ₹1"),
  notes: z.string().max(500).optional(),
  paymentDate: z.string().min(1, "Payment date is required"),
});

export const paymentSubmitSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be at least ₹1"),
  transactionId: z.string().max(100).optional(),
  paymentDate: z.string().min(1, "Payment date is required"),
});

export const paymentVerifySchema = z.object({
  paymentId: z.string(),
  action: z.enum(["verify", "reject"]),
  adminNotes: z.string().optional(),
});

export const examSchema = z.object({
  courseId: z.string(),
  title: z.string().min(2),
  type: z.enum(["MOCK", "FINAL"]),
  durationMinutes: z.coerce.number().min(5).max(300),
});

export const questionSchema = z.object({
  courseId: z.string(),
  questionText: z.string().min(3),
  optionA: z.string().min(1),
  optionB: z.string().min(1),
  optionC: z.string().min(1),
  optionD: z.string().min(1),
  correctOption: z.enum(["A", "B", "C", "D"]),
  marks: z.coerce.number().min(1).default(1),
  isActive: z.boolean().default(true).optional(),
});

export const examQuestionSchema = z.object({
  examId: z.string(),
  questionId: z.string(),
  sortOrder: z.number().default(0).optional(),
});
