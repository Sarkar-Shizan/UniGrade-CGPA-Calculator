import type { Metadata } from "next";
import SettingsPage from "./SettingsClient";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage appearance and local data for the CGPA calculator.",
};

export default function Page() {
  return <SettingsPage />;
}
