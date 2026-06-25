export type NavItem = {
  href: string;
  label: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/courses", label: "Courses" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
  { href: "/query", label: "Enquiry" },
];

export const LEGACY_REDIRECTS: Record<string, string> = {
  "/admission-login": "/student-login",
  "/exam-login": "/student-login",
  "/exam-registration": "/student/register",
  "/fee-paid": "/student/fees",
  "/certificate": "/student/certificate",
  "/online-advertising": "/gallery",
};
