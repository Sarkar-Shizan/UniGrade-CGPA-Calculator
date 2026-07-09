import type { Metadata } from "next";
import Link from "next/link";
import { Calculator, GraduationCap, History, Settings } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Quick access to the calculator, history, university database, and settings.",
};

const cards = [
  {
    href: "/calculator",
    title: "Calculator",
    text: "Add semesters and courses, then calculate GPA and CGPA instantly.",
    icon: Calculator,
  },
  {
    href: "/history",
    title: "History",
    text: "Review calculations saved locally in this browser.",
    icon: History,
  },
  {
    href: "/universities",
    title: "Universities",
    text: "Browse grading scales and grade-point tables.",
    icon: GraduationCap,
  },
  {
    href: "/settings",
    title: "Settings",
    text: "Manage appearance and clear local data.",
    icon: Settings,
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="glass rounded-none p-6 mb-4">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Route overview for the converted Next.js App Router project.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="glass rounded-none p-5 hover-scale">
            <div className="h-10 w-10 rounded-xl gradient-brand grid place-items-center">
              <card.icon className="h-5 w-5" />
            </div>
            <div className="mt-3 font-semibold">{card.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{card.text}</div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
