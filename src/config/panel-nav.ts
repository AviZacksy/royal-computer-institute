import type { PanelNavItem } from "@/components/panels/PanelShell";

export const ADMIN_NAV: PanelNavItem[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/students", label: "Students", icon: "👥" },
  { href: "/admin/students/approval", label: "Approvals", icon: "✅" },
  { href: "/admin/courses", label: "Courses", icon: "💻" },
  { href: "/admin/fees", label: "Fee Management", icon: "💰" },
  { href: "/admin/payments", label: "Payments", icon: "🧾" },
  { href: "/admin/enquiries", label: "Enquiries", icon: "✉️" },
  { href: "/admin/gallery", label: "Gallery", icon: "🖼️" },
  { href: "/admin/questions", label: "Questions", icon: "❓" },
  { href: "/admin/exams", label: "Exams", icon: "📝" },
  { href: "/admin/documents", label: "Documents", icon: "📁" },
  { href: "/admin/notes", label: "Notes", icon: "📓" },
];

export const STUDENT_NAV: PanelNavItem[] = [
  { href: "/student/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/student/fees", label: "My Fees", icon: "💰" },
  { href: "/student/exams", label: "My Exams", icon: "📝" },
  { href: "/student/documents", label: "My Documents", icon: "📁" },
  { href: "/student/notes", label: "My Notes", icon: "📓" },
];
