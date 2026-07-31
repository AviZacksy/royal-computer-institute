import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  fatherName: z.string().min(2, "Enter father's name").max(120),
  motherName: z.string().min(2, "Enter mother's name").max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { required_error: "Select gender" }),
  dateOfBirth: z.string().min(1, "Enter date of birth"),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Enter a valid 12 digit Aadhaar number"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  parentsMobile: z.string().min(10, "Enter a valid parents mobile number").max(15),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  courseId: z.string().min(1, "Select a course"),
  qualification: z.enum(["10TH", "12TH", "GRADUATION", "POST_GRADUATION"], { required_error: "Select qualification" }),
  qualificationSchool: z.string().min(2, "Enter school/college name").max(120),
  qualificationBoard: z.string().min(2, "Enter board name").max(120),
  qualificationMarks: z.string().min(1, "Enter marks percentage").max(10),
  qualificationYear: z.string().regex(/^\d{4}$/, "Enter a valid 4-digit passing year"),
  permanentAddress: z.string().min(5, "Enter permanent address").max(1000),
  currentAddress: z.string().min(5, "Enter current address").max(1000),
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
  sortOrder: z.coerce.number().int().min(0).optional(),
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
  syllabus: z.string().max(8000).optional(),
  eligibility: z.string().max(2000).optional(),
  careerScope: z.string().max(4000).optional(),
  duration: z.string().min(2, "Enter duration").max(64),
  totalFee: z.coerce.number().min(0, "Fee cannot be negative").optional(),
  actualFee: z.coerce.number().min(0, "Actual fee cannot be negative"),
  installmentFee: z.coerce.number().min(0, "Installment fee cannot be negative"),
  oneTimeFee: z.coerce.number().min(0, "One-time fee cannot be negative"),
  imagePath: z.string().max(2048).optional(),
  isActive: z.enum(["true", "false"]).optional(),
  isEnquiryEnabled: z.enum(["true", "false"]).optional(),
});

export const aboutContentSchema = z.object({
  title: z.string().min(2, "Enter the About title").max(160),
  description: z.string().min(5, "Enter the About description").max(1000),
  introduction: z.string().min(10, "Enter institute introduction").max(4000),
  mission: z.string().min(10, "Enter mission text").max(4000),
  vision: z.string().min(10, "Enter vision text").max(4000),
  imagePath: z.string().max(2048).optional(),
  sectionTitle: z.array(z.string().max(120)).optional(),
  sectionDescription: z.array(z.string().max(500)).optional(),
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
  topic: z.enum([
    "FUNDAMENTAL",
    "WINDOWS",
    "MS_WORD",
    "MS_EXCEL",
    "MS_POWERPOINT",
    "TALLY",
    "PHOTOSHOP",
    "CORELDRAW",
    "PAGEMAKER",
  ]).optional().or(z.literal("")),
  durationMinutes: z.coerce.number().min(5).max(300),
});

export const questionSchema = z.object({
  courseId: z.string(),
  topic: z.enum([
    "FUNDAMENTAL",
    "WINDOWS",
    "MS_WORD",
    "MS_EXCEL",
    "MS_POWERPOINT",
    "TALLY",
    "PHOTOSHOP",
    "CORELDRAW",
    "PAGEMAKER",
  ]),
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
