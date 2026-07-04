"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { CalculationRecord } from "@/types";

export default function HistoryPage() {
  const [history, setHistory] = useLocalStorage<CalculationRecord[]>(
    "cgpa:history",
    [],
  );

  return (
    <AppLayout>
      <div className="glass rounded-3xl p-6 mb-4">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">History</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Saved calculations are kept in your browser. Nothing is uploaded.
        </p>
      </div>

      {history.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No saved calculations yet. Save one from the calculator page.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {history.map((h) => (
            <div key={h.id} className="glass rounded-2xl p-4">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0">
                  <div className="font-semibold truncate">{h.universityName}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(h.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHistory(history.filter((x) => x.id !== h.id));
                    toast.success("Removed");
                  }}
                  className="h-8 w-8 shrink-0 rounded-lg grid place-items-center text-destructive hover:bg-destructive/10"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl gradient-brand py-2">
                  <div className="text-[10px] uppercase opacity-80">CGPA</div>
                  <div className="text-lg font-bold tabular-nums">
                    {h.cgpa.toFixed(2)}
                  </div>
                </div>
                <div className="rounded-xl bg-accent/50 py-2">
                  <div className="text-[10px] uppercase opacity-80">Scale</div>
                  <div className="text-lg font-bold tabular-nums">
                    {h.scale.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-xl bg-accent/50 py-2">
                  <div className="text-[10px] uppercase opacity-80">Credits</div>
                  <div className="text-lg font-bold tabular-nums">
                    {h.totalCredits}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-xs text-muted-foreground">
                {h.semesters.length} semester{h.semesters.length !== 1 && "s"} ·{" "}
                {h.semesters.reduce((n, s) => n + s.courses.length, 0)} courses
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}
