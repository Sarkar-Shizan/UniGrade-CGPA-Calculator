"use client";

import jsPDF from "jspdf";
import {
  Award,
  BookOpen,
  Download,
  Plus,
  RefreshCcw,
  Save,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { AppLayout } from "@/components/AppLayout";
import { CourseRow } from "@/components/CourseRow";
import { GpaTrend } from "@/components/GpaTrend";
import { StatCard } from "@/components/StatCard";
import { UniversityPicker } from "@/components/UniversityPicker";
import { universities } from "@/data/universities";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { CalculationRecord, Course, Semester, University } from "@/types";
import { calcCGPA, newId, semesterGPA } from "@/utils/gpa";

interface CalcState {
  universityId: string;
  semesters: Semester[];
}

function makeCourse(): Course {
  return { id: newId(), name: "", code: "", credits: 3 };
}

function makeSemester(name: string): Semester {
  return { id: newId(), name, courses: [makeCourse(), makeCourse(), makeCourse()] };
}

export default function CalculatorPage() {
  const [state, setState] = useLocalStorage<CalcState>("cgpa:state", {
    universityId: "du",
    semesters: [makeSemester("Semester 1")],
  });
  const [history, setHistory] = useLocalStorage<CalculationRecord[]>(
    "cgpa:history",
    [],
  );

  const university =
    universities.find((u) => u.id === state.universityId) ?? universities[0];

  // Reset courses when switching to incompatible grading type
  useEffect(() => {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem) => ({
        ...sem,
        courses: sem.courses.map((c) => ({
          ...c,
          grade: university.gradingType === "letter" ? c.grade : undefined,
          marks: university.gradingType === "percentage" ? c.marks : undefined,
        })),
      })),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [university.id]);

  const summary = useMemo(
    () => calcCGPA(state.semesters, university),
    [state.semesters, university],
  );

  const trendData = summary.perSemester.map((s) => ({
    name: s.name,
    gpa: parseFloat(s.gpa.toFixed(2)),
  }));

  function updateSemester(idx: number, patch: Partial<Semester>) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === idx ? { ...sem, ...patch } : sem,
      ),
    }));
  }
  function updateCourse(si: number, ci: number, course: Course) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === si
          ? {
              ...sem,
              courses: sem.courses.map((c, j) => (j === ci ? course : c)),
            }
          : sem,
      ),
    }));
  }
  function addCourse(si: number) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === si ? { ...sem, courses: [...sem.courses, makeCourse()] } : sem,
      ),
    }));
  }
  function removeCourse(si: number, ci: number) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === si
          ? { ...sem, courses: sem.courses.filter((_, j) => j !== ci) }
          : sem,
      ),
    }));
  }
  function addSemester() {
    setState((s) => ({
      ...s,
      semesters: [...s.semesters, makeSemester(`Semester ${s.semesters.length + 1}`)],
    }));
  }
  function removeSemester(idx: number) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.filter((_, i) => i !== idx),
    }));
  }
  function reset() {
    setState({ universityId: university.id, semesters: [makeSemester("Semester 1")] });
    toast.success("Calculator reset");
  }

  function saveToHistory() {
    const record: CalculationRecord = {
      id: newId(),
      universityId: university.id,
      universityName: university.name,
      scale: university.scale,
      cgpa: parseFloat(summary.cgpa.toFixed(2)),
      totalCredits: summary.totalCredits,
      semesters: state.semesters,
      createdAt: Date.now(),
    };
    setHistory([record, ...history].slice(0, 50));
    toast.success("Saved to history");
  }

  function exportPDF() {
    const doc = new jsPDF();
    const marginX = 14;
    let y = 18;
    doc.setFontSize(18);
    doc.text("CGPA Report", marginX, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`${university.name} — ${university.country}`, marginX, y);
    y += 6;
    doc.text(
      `Scale: ${university.scale.toFixed(1)} · Type: ${university.gradingType}`,
      marginX,
      y,
    );
    y += 10;

    state.semesters.forEach((sem, si) => {
      const r = semesterGPA(sem, university);
      doc.setFontSize(13);
      doc.text(
        `${sem.name} — GPA ${r.gpa.toFixed(2)} (${r.credits} cr)`,
        marginX,
        y,
      );
      y += 6;
      doc.setFontSize(10);
      sem.courses.forEach((c) => {
        const line = `• ${c.code || "—"} ${c.name || ""} · ${c.credits} cr · ${
          university.gradingType === "letter" ? c.grade ?? "—" : `${c.marks ?? "—"}%`
        }`;
        doc.text(line, marginX + 3, y);
        y += 5;
        if (y > 280) {
          doc.addPage();
          y = 18;
        }
      });
      y += 4;
      if (si < state.semesters.length - 1 && y > 260) {
        doc.addPage();
        y = 18;
      }
    });

    doc.setFontSize(14);
    doc.text(
      `CGPA: ${summary.cgpa.toFixed(2)} / ${university.scale.toFixed(1)}`,
      marginX,
      y + 6,
    );
    doc.text(`Total credits: ${summary.totalCredits}`, marginX, y + 13);

    doc.save(`cgpa-${university.id}-${Date.now()}.pdf`);
    toast.success("PDF exported");
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="min-w-0 space-y-4">
          <UniversityPicker
            value={university.id}
            onChange={(u: University) =>
              setState((s) => ({ ...s, universityId: u.id }))
            }
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="CGPA"
              value={summary.cgpa.toFixed(2)}
              hint={`out of ${university.scale.toFixed(1)}`}
              icon={Award}
              accent
            />
            <StatCard
              label="Credits"
              value={String(summary.totalCredits)}
              icon={BookOpen}
            />
            <StatCard
              label="Quality points"
              value={summary.totalQualityPoints.toFixed(1)}
              icon={TrendingUp}
            />
            <StatCard
              label="Semesters"
              value={String(state.semesters.length)}
              icon={BookOpen}
            />
          </div>

          {state.semesters.map((sem, si) => {
            const r = semesterGPA(sem, university);
            return (
              <div key={sem.id} className="glass rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <input
                    value={sem.name}
                    onChange={(e) => updateSemester(si, { name: e.target.value })}
                    className="min-w-0 bg-transparent text-lg font-semibold outline-none focus:ring-2 focus:ring-ring rounded-md px-1"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-sm text-muted-foreground tabular-nums">
                      GPA {r.gpa.toFixed(2)} · {r.credits} cr
                    </div>
                    {state.semesters.length > 1 && (
                      <button
                        onClick={() => removeSemester(si)}
                        className="h-9 w-9 rounded-xl grid place-items-center hover:bg-destructive/10 text-destructive"
                        aria-label="Remove semester"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="hidden md:grid grid-cols-[1.4fr_0.8fr_0.6fr_1fr_0.6fr_auto] gap-3 text-[11px] uppercase tracking-wide text-muted-foreground px-1">
                  <div>Course</div>
                  <div>Code</div>
                  <div>Credits</div>
                  <div>
                    {university.gradingType === "letter" ? "Grade" : "Marks %"}
                  </div>
                  <div className="text-center">Point</div>
                  <div />
                </div>
                <div className="space-y-2">
                  {sem.courses.map((c, ci) => (
                    <CourseRow
                      key={c.id}
                      course={c}
                      university={university}
                      onChange={(nc) => updateCourse(si, ci, nc)}
                      onRemove={() => removeCourse(si, ci)}
                    />
                  ))}
                </div>
                <button
                  onClick={() => addCourse(si)}
                  className="inline-flex items-center gap-2 rounded-xl glass px-3 py-2 text-sm hover-scale"
                >
                  <Plus className="h-4 w-4" /> Add course
                </button>
              </div>
            );
          })}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={addSemester}
              className="inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold hover-scale"
            >
              <Plus className="h-4 w-4" /> Add semester
            </button>
            <button
              onClick={saveToHistory}
              className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm hover-scale"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={exportPDF}
              className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm hover-scale"
            >
              <Download className="h-4 w-4" /> Export PDF
            </button>
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm hover-scale text-destructive"
            >
              <RefreshCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <GpaTrend data={trendData} scale={university.scale} />
          <div className="glass rounded-2xl p-4">
            <div className="text-sm font-semibold mb-2">Grading scale</div>
            <div className="text-xs text-muted-foreground mb-3">
              {university.notes ?? "Auto-detected from selected university"}
            </div>
            <ul className="space-y-1 max-h-72 overflow-auto pr-1">
              {university.grades.map((g) => (
                <li
                  key={g.grade}
                  className="flex items-center justify-between text-sm rounded-lg px-2 py-1 hover:bg-accent/40"
                >
                  <span className="font-medium">{g.grade}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {g.point.toFixed(2)}
                    {g.minPercent != null && g.maxPercent != null && (
                      <span className="ml-2">
                        ({g.minPercent}–{g.maxPercent}%)
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
