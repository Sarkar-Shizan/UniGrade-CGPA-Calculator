import type { Metadata } from "next";
import HistoryPage from "./HistoryClient";

export const metadata: Metadata = {
  title: "Calculation History",
  description: "Review your saved CGPA calculations, per semester and per university.",
};

export default function Page() {
  return <HistoryPage />;
}
