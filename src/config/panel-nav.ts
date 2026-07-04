import type { PanelNavItem } from "@/components/panels/PanelShell";

export const ADMIN_NAV: PanelNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/students", label: "Students", icon: "students" },
  { href: "/admin/students/approval", label: "Approvals", icon: "approvals" },
  { href: "/admin/fees", label: "Fee Management", icon: "fees" },
  { href: "/admin/payments", label: "Payments", icon: "payments" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "enquiries" },
  { href: "/admin/questions", label: "Questions", icon: "questions" },
  { href: "/admin/exams", label: "Exams", icon: "exams" },
  { href: "/admin/documents", label: "Documents", icon: "documents" },
  { href: "/admin/notes", label: "Notes", icon: "notes" },
  { href: "/admin/about", label: "About", icon: "about", section: "Website Management" },
  { href: "/admin/gallery", label: "Gallery", icon: "gallery", section: "Website Management" },
  { href: "/admin/courses", label: "Courses", icon: "courses", section: "Website Management" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export const STUDENT_NAV: PanelNavItem[] = [
  { href: "/student/dashboard", label: "Home", icon: "dashboard" },
  { href: "/student/course", label: "My Courses", icon: "courses" },
  { href: "/student/fees", label: "Fees & Receipts", icon: "fees" },
  { href: "/student/exams", label: "Exams", icon: "exams" },
  { href: "/student/documents", label: "My Documents", icon: "documents" },
  { href: "/student/queries", label: "Support/Queries", icon: "enquiries" },
];
