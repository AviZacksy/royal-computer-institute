import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Poppins } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

import { buildMetadata } from "@/lib/seo/metadata-builder";

export const metadata = buildMetadata({
  title: "Royal Computer Institute | Best Computer Coaching in Motihari",
  description: "Royal Computer Institute in Motihari, East Champaran, Bihar, is an ISO 9001:2015 certified center. We offer DCA, ADCA, Tally Prime with GST, Python, and Web Development courses.",
  path: "",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${poppins.variable} ${bebas.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
