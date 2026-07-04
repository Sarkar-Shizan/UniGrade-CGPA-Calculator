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
import { useEffect, useMemo, useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { CourseRow } from "@/components/CourseRow";
import { GpaTrend } from "@/components/GpaTrend";
import { StatCard } from "@/components/StatCard";
import { UniversityPicker } from "@/components/UniversityPicker";
import { universities } from "@/data/universities";
import type { CalculationRecord, Course, Semester, University } from "@/types";

/* ---------------- types ---------------- */

interface CalcState {
  universityId: string;
  semesters: Semester[];
}

/* ---------------- helpers (replaced utils) ---------------- */

function newId() {
  return Math.random().toString(36).substring(2, 10);
}

function makeCourse(): Course {
  return { id: newId(), name: "", code: "", credits: 3 };
}

function makeSemester(name: string): Semester {
  return {
    id: newId(),
    name,
    courses: [makeCourse(), makeCourse(), makeCourse()],
  };
}

/* GPA logic (replaces utils/gpa) */
function calcCGPA(semesters: Semester[], uni: University) {
  let totalCredits = 0;
  let totalPoints = 0;

  const perSemester = semesters.map((sem) => {
    let semCredits = 0;
    let semPoints = 0;

    sem.courses.forEach((c) => {
      const grade = uni.grades.find((g) => g.grade === c.grade);
      const point = grade ? grade.point : 0;

      semCredits += c.credits;
      semPoints += point * c.credits;
    });

    const gpa = semCredits ? semPoints / semCredits : 0;

    totalCredits += semCredits;
    totalPoints += semPoints;

    return {
      name: sem.name,
      gpa,
      credits: semCredits,
    };
  });

  return {
    cgpa: totalCredits ? totalPoints / totalCredits : 0,
    totalCredits,
    totalQualityPoints: totalPoints,
    perSemester,
  };
}

function semesterGPA(sem: Semester, uni: University) {
  let credits = 0;
  let points = 0;

  sem.courses.forEach((c) => {
    const grade = uni.grades.find((g) => g.grade === c.grade);
    const point = grade ? grade.point : 0;

    credits += c.credits;
    points += point * c.credits;
  });

  return {
    gpa: credits ? points / credits : 0,
    credits,
  };
}

/* ---------------- component ---------------- */

export default function CalculatorPage() {
  const [state, setState] = useState<CalcState>({
    universityId: "du",
    semesters: [makeSemester("Semester 1")],
  });

  const [history, setHistory] = useState<CalculationRecord[]>([]);

  /* load from localStorage */
  useEffect(() => {
    const saved = localStorage.getItem("cgpa:state");
    const savedHistory = localStorage.getItem("cgpa:history");

    if (saved) setState(JSON.parse(saved));
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  /* persist */
  useEffect(() => {
    localStorage.setItem("cgpa:state", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    localStorage.setItem("cgpa:history", JSON.stringify(history));
  }, [history]);

  const university =
    universities.find((u) => u.id === state.universityId) ??
    universities[0];

  const summary = useMemo(
    () => calcCGPA(state.semesters, university),
    [state.semesters, university]
  );

  const trendData = summary.perSemester.map((s) => ({
    name: s.name,
    gpa: parseFloat(s.gpa.toFixed(2)),
  }));

  function updateSemester(idx: number, patch: Partial<Semester>) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === idx ? { ...sem, ...patch } : sem
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
              courses: sem.courses.map((c, j) =>
                j === ci ? course : c
              ),
            }
          : sem
      ),
    }));
  }

  function addCourse(si: number) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === si
          ? { ...sem, courses: [...sem.courses, makeCourse()] }
          : sem
      ),
    }));
  }

  function removeCourse(si: number, ci: number) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === si
          ? {
              ...sem,
              courses: sem.courses.filter((_, j) => j !== ci),
            }
          : sem
      ),
    }));
  }

  function addSemester() {
    setState((s) => ({
      ...s,
      semesters: [
        ...s.semesters,
        makeSemester(`Semester ${s.semesters.length + 1}`),
      ],
    }));
  }

  function removeSemester(idx: number) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.filter((_, i) => i !== idx),
    }));
  }

  function reset() {
    setState({
      universityId: university.id,
      semesters: [makeSemester("Semester 1")],
    });
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
  }

  function exportPDF() {
    const doc = new jsPDF();
    let y = 18;

    doc.setFontSize(18);
    doc.text("CGPA Report", 14, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(university.name, 14, y);
    y += 10;

    state.semesters.forEach((sem) => {
      const r = semesterGPA(sem, university);

      doc.text(`${sem.name} GPA: ${r.gpa.toFixed(2)}`, 14, y);
      y += 6;

      sem.courses.forEach((c) => {
        doc.text(
          `${c.code || "-"} ${c.name} (${c.credits})`,
          18,
          y
        );
        y += 5;
      });

      y += 5;
    });

    doc.text(
      `CGPA: ${summary.cgpa.toFixed(2)}`,
      14,
      y + 10
    );

    doc.save("cgpa.pdf");
  }

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
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
              icon={Award}
            />
            <StatCard
              label="Credits"
              value={String(summary.totalCredits)}
              icon={BookOpen}
            />
            <StatCard
              label="Points"
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
              <div key={sem.id} className="glass p-4 rounded-xl">
                <div className="flex justify-between">
                  <input
                    value={sem.name}
                    onChange={(e) =>
                      updateSemester(si, { name: e.target.value })
                    }
                    className="bg-transparent font-semibold"
                  />

                  <span>
                    GPA {r.gpa.toFixed(2)}
                  </span>
                </div>

                {sem.courses.map((c, ci) => (
                  <CourseRow
                    key={c.id}
                    course={c}
                    university={university}
                    onChange={(nc) =>
                      updateCourse(si, ci, nc)
                    }
                    onRemove={() =>
                      removeCourse(si, ci)
                    }
                  />
                ))}

                <button onClick={() => addCourse(si)}>
                  <Plus /> Add course
                </button>
              </div>
            );
          })}

          <div className="flex gap-2">
            <button onClick={addSemester}>Add semester</button>
            <button onClick={saveToHistory}>Save</button>
            <button onClick={exportPDF}>Export</button>
            <button onClick={reset}>Reset</button>
          </div>
        </div>

        <div>
          <GpaTrend data={trendData} scale={university.scale} />
        </div>
      </div>
    </AppLayout>
  );
}