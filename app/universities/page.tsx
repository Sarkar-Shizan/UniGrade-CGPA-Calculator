import type { Metadata } from "next";
import UniversitiesPage from "./UniversitiesClient";

export const metadata: Metadata = {
  title: "University Grading Database",
  description:
    "Browse supported universities and their GPA scales, grading systems, and grade point tables.",
};

export default function Page() {
  return <UniversitiesPage />;
}
