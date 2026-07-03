export type NavItem = {
  href: string;
  label: string;
  children?: NavItem[];
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/#courses", label: "Courses" },
  { href: "/gallery", label: "Gallery" },
  {
    href: "/student-login",
    label: "Student",
    children: [
      { href: "/student-login", label: "Student Login" },
      { href: "/admission", label: "Student Admission" },
      { href: "/student/exams", label: "Student Registration" },
    ],
  },
  { href: "/verification", label: "Verification" },
];

export const LEGACY_REDIRECTS: Record<string, string> = {
  "/admission-login": "/student-login",
  "/exam-login": "/student-login",
  "/exam-registration": "/admission",
  "/fee-paid": "/student/fees",
  "/certificate": "/student/certificate",
  "/online-advertising": "/gallery",
};
