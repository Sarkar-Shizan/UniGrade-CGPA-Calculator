import type { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Accurate GPA for any university",
  description:
    "Calculate your GPA and CGPA with university-specific grading rules. Supports 4.0, 5.0, letter and percentage systems.",
};

export default function Page() {
  return <HomePage />;
}
