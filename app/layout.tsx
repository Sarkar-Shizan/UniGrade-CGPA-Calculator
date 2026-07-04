import type { Metadata } from "next";
import "./globals.css";
import { ToasterProvider } from "@/components/ToasterProvider";

export const metadata: Metadata = {
  title: {
    default: "UniGrade- CGPA Calculator",
    template: "%s | UniGrade- CGPA Calculator",
  },
  description:
    "Calculate your GPA and CGPA with university-specific grading rules. Fast, private, and works offline in your browser.",
  authors: [{ name: "CGPA Calculator" }],
  openGraph: {
    title: "UniGrade- CGPA Calculator",
    description:
      "Accurate GPA and CGPA calculations tuned to your university's grading system.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniGrade- CGPA Calculator",
    description:
      "Accurate GPA and CGPA calculations tuned to your university's grading system.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <ToasterProvider />
      </body>
    </html>
  );
}
