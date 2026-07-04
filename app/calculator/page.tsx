"use client";

import jsPDF from "jspdf";
import {
  Award,
  BookOpen,
  Download,
  Plus,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { CourseRow } from "@/components/CourseRow";
import { StatCard } from "@/components/StatCard";
import { UniversityPicker } from "@/components/UniversityPicker";
import { universities } from "@/data/universities";
import type { Course, Semester, University } from "@/types";

/* ---------------- helpers ---------------- */

function newId() {
  return Math.random().toString(36).substring(2, 10);
}

function makeSemester(name: string): Semester {
  return {
    id: newId(),
    name,
    courses: [
      {
        id: newId(),
        name: "",
        code: "",
        credits: 3,
      },
    ],
  };
}

/* GPA */
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

/* ---------------- component ---------------- */

export default function CalculatorPage() {
  const [state, setState] = useState({
    universityId: "du",
    semesters: [makeSemester("Semester 1")],
  });

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const university =
    universities.find((u) => u.id === state.universityId) ??
    universities[0];

  /* ---------------- calculate ---------------- */

  function handleCalculate() {
    const hasMissing = state.semesters.some((sem) =>
      sem.courses.some((c) =>
        university.gradingType === "letter" ? !c.grade : false
      )
    );

    if (hasMissing) {
      setError("Please select grades for all courses before calculating your CGPA.");
      setResult(null);
      return;
    }

    const summary = calcCGPA(state.semesters, university);
    setResult(summary);
    setError(null);
  }

  /* ---------------- UPDATE COURSE ---------------- */

  function updateCourse(
    si: number,
    ci: number,
    field: keyof Course,
    value: any
  ) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === si
          ? {
              ...sem,
              courses: sem.courses.map((c, j) =>
                j === ci ? { ...c, [field]: value } : c
              ),
            }
          : sem
      ),
    }));
  }

  /* ---------------- ADD COURSE (FIXED) ---------------- */

  function addCourse(si: number) {
    setState((s) => ({
      ...s,
      semesters: s.semesters.map((sem, i) =>
        i === si
          ? {
              ...sem,
              courses: [
                ...sem.courses,
                {
                  id: newId(),
                  name: "",
                  code: "",
                  credits: 3,
                },
              ],
            }
          : sem
      ),
    }));
  }

  /* ---------------- REMOVE COURSE ---------------- */

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

  function reset() {
    setState({
      universityId: university.id,
      semesters: [makeSemester("Semester 1")],
    });
    setResult(null);
    setError(null);
  }

  /* ---------------- PDF ---------------- */

  function downloadPDF() {
    const doc = new jsPDF();
    let y = 15;

    doc.text("CGPA Report", 14, y);
    y += 10;

    doc.text(university.name, 14, y);
    y += 10;

    state.semesters.forEach((sem) => {
      doc.text(sem.name, 14, y);
      y += 6;

      sem.courses.forEach((c) => {
        doc.text(
          `${c.name || "Course"} - ${c.credits} credits`,
          18,
          y
        );
        y += 5;
      });

      y += 5;
    });

    doc.text(
      `CGPA: ${result?.cgpa?.toFixed(2) ?? "0"}`,
      14,
      y + 10
    );

    doc.save("cgpa.pdf");
  }

  /* ---------------- UI ---------------- */

  return (
    <AppLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        {/* LEFT */}
        <div className="space-y-4">

          <UniversityPicker
            value={university.id}
            onChange={(u: University) =>
              setState((s) => ({ ...s, universityId: u.id }))
            }
          />

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="CGPA"
              value={result ? result.cgpa.toFixed(2) : "—"}
              icon={Award}
            />
            <StatCard
              label="Credits"
              value={result ? String(result.totalCredits) : "—"}
              icon={BookOpen}
            />
            <StatCard
              label="Points"
              value={result ? result.totalQualityPoints.toFixed(1) : "—"}
              icon={TrendingUp}
            />
            <StatCard
              label="Semesters"
              value={String(state.semesters.length)}
              icon={BookOpen}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="glass rounded-2xl p-3 text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* SEMESTERS */}
          {state.semesters.map((sem, si) => (
            <div key={sem.id} className="glass rounded-3xl p-5">

              <div className="flex justify-between mb-3">
                <input
                  value={sem.name}
                  onChange={(e) =>
                    setState((s) => ({
                      ...s,
                      semesters: s.semesters.map((x, i) =>
                        i === si ? { ...x, name: e.target.value } : x
                      ),
                    }))
                  }
                  className="bg-transparent font-semibold"
                />

                <span className="text-xs px-3 py-1 rounded-full bg-accent/50">
                  {sem.courses.length} Courses
                </span>
              </div>

              {/* COURSES */}
              {sem.courses.map((c, ci) => (
                <CourseRow
                  key={c.id}
                  course={c}
                  university={university}
                  onChange={(nc) =>
                    updateCourse(si, ci, "name", nc.name)
                  }
                  onRemove={() => removeCourse(si, ci)}
                />
              ))}

              {/* ADD COURSE BUTTON */}
              <button
                onClick={() => addCourse(si)}
                className="mt-3 inline-flex items-center gap-2 text-sm gradient-brand px-4 py-2 rounded-xl font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Course
              </button>
            </div>
          ))}

          {/* ACTIONS */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCalculate}
              className="gradient-brand px-4 py-2 rounded-xl font-semibold"
            >
              Calculate GPA
            </button>

            <button
              onClick={addSemester}
              className="gradient-brand px-4 py-2 rounded-xl font-semibold"
            >
              Add Semester
            </button>

            <button
              onClick={downloadPDF}
              className="gradient-brand px-4 py-2 rounded-xl font-semibold"
            >
              Download PDF
            </button>

            <button
              onClick={reset}
              className="gradient-brand px-4 py-2 rounded-xl font-semibold"
            >
              Reset
            </button>
          </div>

        </div>

        {/* RIGHT - GRADING SYSTEM */}
        <div className="glass rounded-3xl p-4">
          <h2 className="text-sm font-semibold mb-3">
            Grading System
          </h2>

          <div className="space-y-2">
            {university.grades.map((g) => (
              <div key={g.grade} className="flex justify-between text-sm">
                <span>{g.grade}</span>
                <span className="font-semibold">
                  {g.point.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}