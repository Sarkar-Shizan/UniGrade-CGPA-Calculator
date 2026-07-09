import Link from "next/link";
import {
  Calculator,
  GraduationCap,
  History,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { universities } from "@/data/universities";

export default function HomePage() {
  return (
    <AppLayout>
      <section className="glass rounded-none p-6 md:p-10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5" /> University-wise grading
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-bold tracking-tight">
            <span className="gradient-text">University CGPA</span> Calculator
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Pick your university and we automatically apply the correct GPA
            scale, grade points, and calculation rules. Track progress
            semester by semester, export a PDF report, and keep history — all
            in your browser.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-xl gradient-brand px-5 py-3 text-sm font-semibold shadow-md hover-scale"
            >
              <Calculator className="h-4 w-4" /> Open calculator
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-xl glass px-5 py-3 text-sm font-semibold hover-scale"
            >
              <GraduationCap className="h-4 w-4" /> Browse universities
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Feature
          icon={GraduationCap}
          title={`${universities.length} universities`}
          text="Bangladesh & international grading systems included, easily extensible."
        />
        <Feature
          icon={TrendingUp}
          title="Semester tracking"
          text="Track GPA trends with a live chart and running CGPA."
        />
        <Feature
          icon={History}
          title="History & PDF"
          text="Save calculations locally and export a shareable PDF report."
        />
      </section>
    </AppLayout>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof GraduationCap;
  title: string;
  text: string;
}) {
  return (
    <div className="glass rounded-none p-5">
      <div className="h-10 w-10 rounded-xl gradient-brand grid place-items-center">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 font-semibold">{title}</div>
      <div className="text-sm text-muted-foreground mt-1">{text}</div>
    </div>
  );
}
