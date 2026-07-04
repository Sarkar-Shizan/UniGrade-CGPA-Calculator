import type { Metadata } from "next";
import CalculatorPage from "./CalculatorClient";

export const metadata: Metadata = {
  title: "CGPA Calculator",
  description:
    "Add courses, get instant GPA and CGPA per your university's grading rules.",
};

export default function Page() {
  return <CalculatorPage />;
}
