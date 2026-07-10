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
        grade: "",
      },
    ],
  };
}

function getCoursePoint(course: Course, university: University) {
  if (university.gradingType === "letter") {
    return (
      university.grades.find(
        (grade) => grade.grade === course.grade
      )?.point ?? 0
    );
  }

  const marks = course.marks;

  if (marks == null) {
    return 0;
  }

  return (
    university.grades.find(
      (grade) =>
        grade.minPercent != null &&
        grade.maxPercent != null &&
        marks >= grade.minPercent &&
        marks <= grade.maxPercent
    )?.point ?? 0
  );
}

function getCourseGrade(course: Course, university: University) {
  if (university.gradingType === "letter") {
    return course.grade || "N/A";
  }

  const marks = course.marks;

  if (marks == null) {
    return "N/A";
  }

  return (
    university.grades.find(
      (grade) =>
        grade.minPercent != null &&
        grade.maxPercent != null &&
        marks >= grade.minPercent &&
        marks <= grade.maxPercent
    )?.grade ?? "N/A"
  );
}

/* ---------------- GPA ---------------- */

function calcCGPA(
  semesters: Semester[],
  university: University,
  previousCGPA = 0,
  previousCredits = 0
) {
  let currentCredits = 0;
  let currentPoints = 0;

  const perSemester = semesters.map((semester) => {
    let semesterCredits = 0;
    let semesterPoints = 0;

    semester.courses.forEach((course) => {
      const point = getCoursePoint(course, university);
      const credit = Number(course.credits) || 0;

      semesterCredits += credit;
      semesterPoints += point * credit;
    });

    const gpa =
      semesterCredits > 0
        ? semesterPoints / semesterCredits
        : 0;

    currentCredits += semesterCredits;
    currentPoints += semesterPoints;

    return {
      name: semester.name,
      gpa,
      credits: semesterCredits,
      qualityPoints: semesterPoints,
    };
  });

  const previousQualityPoints =
    previousCGPA * previousCredits;

  const totalCredits =
    previousCredits + currentCredits;

  const totalPoints =
    previousQualityPoints + currentPoints;

  return {
    cgpa:
      totalCredits > 0
        ? totalPoints / totalCredits
        : 0,
    totalCredits,
    totalQualityPoints: totalPoints,
    currentCredits,
    currentQualityPoints: currentPoints,
    previousCGPA,
    previousCredits,
    previousQualityPoints,
    perSemester,
  };
}

/* ---------------- component ---------------- */

export default function CalculatorPage() {
  const [state, setState] = useState({
    universityId: "",
    previousCGPA: "",
    completedCredits: "",
    semesters: [makeSemester("Semester 1")],
  });

  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const university =
    universities.find(
      (item) => item.id === state.universityId
    ) ?? null;

  /* ---------------- calculate ---------------- */

  function handleCalculate() {
    if (!university) {
      setError(
        "Please select a university before calculating your CGPA."
      );
      setResult(null);
      return;
    }

    const previousCGPA =
      state.previousCGPA.trim() === ""
        ? 0
        : Number(state.previousCGPA);

    const previousCredits =
      state.completedCredits.trim() === ""
        ? 0
        : Number(state.completedCredits);

    const hasPreviousCGPA =
      state.previousCGPA.trim() !== "";

    const hasPreviousCredits =
      state.completedCredits.trim() !== "";

    if (hasPreviousCGPA !== hasPreviousCredits) {
      setError(
        "Please enter both current CGPA and completed credits, or leave both fields empty."
      );
      setResult(null);
      return;
    }

    if (
      hasPreviousCGPA &&
      (
        Number.isNaN(previousCGPA) ||
        previousCGPA < 0 ||
        previousCGPA > university.scale
      )
    ) {
      setError(
        `Current CGPA must be between 0 and ${university.scale}.`
      );
      setResult(null);
      return;
    }

    if (
      hasPreviousCredits &&
      (
        Number.isNaN(previousCredits) ||
        previousCredits <= 0
      )
    ) {
      setError(
        "Completed credits must be greater than zero."
      );
      setResult(null);
      return;
    }

    const hasInvalidCredits =
      state.semesters.some((semester) =>
        semester.courses.some(
          (course) =>
            Number(course.credits) <= 0 ||
            Number.isNaN(Number(course.credits))
        )
      );

    if (hasInvalidCredits) {
      setError(
        "Please enter valid credits greater than zero for all courses."
      );
      setResult(null);
      return;
    }

    const hasMissingResult =
      state.semesters.some((semester) =>
        semester.courses.some((course) => {
          if (university.gradingType === "letter") {
            return !course.grade;
          }

          return (
            course.marks == null ||
            Number.isNaN(Number(course.marks)) ||
            course.marks < 0 ||
            course.marks > 100
          );
        })
      );

    if (hasMissingResult) {
      setError(
        university.gradingType === "letter"
          ? "Please select grades for all courses before calculating your CGPA."
          : "Please enter valid marks between 0 and 100 for all courses."
      );
      setResult(null);
      return;
    }

    const summary = calcCGPA(
      state.semesters,
      university,
      previousCGPA,
      previousCredits
    );

    setResult(summary);
    setError(null);
  }

  /* ---------------- update complete course ---------------- */

  function updateCompleteCourse(
    semesterIndex: number,
    courseIndex: number,
    updatedCourse: Course
  ) {
    setState((current) => ({
      ...current,
      semesters: current.semesters.map(
        (semester, currentSemesterIndex) =>
          currentSemesterIndex === semesterIndex
            ? {
                ...semester,
                courses: semester.courses.map(
                  (course, currentCourseIndex) =>
                    currentCourseIndex === courseIndex
                      ? updatedCourse
                      : course
                ),
              }
            : semester
      ),
    }));

    setResult(null);
    setError(null);
  }

  /* ---------------- add course ---------------- */

  function addCourse(semesterIndex: number) {
    setState((current) => ({
      ...current,
      semesters: current.semesters.map(
        (semester, currentSemesterIndex) =>
          currentSemesterIndex === semesterIndex
            ? {
                ...semester,
                courses: [
                  ...semester.courses,
                  {
                    id: newId(),
                    name: "",
                    code: "",
                    credits: 3,
                    grade: "",
                  },
                ],
              }
            : semester
      ),
    }));

    setResult(null);
    setError(null);
  }

  /* ---------------- remove course ---------------- */

  function removeCourse(
    semesterIndex: number,
    courseIndex: number
  ) {
    setState((current) => ({
      ...current,
      semesters: current.semesters.map(
        (semester, currentSemesterIndex) => {
          if (currentSemesterIndex !== semesterIndex) {
            return semester;
          }

          const remainingCourses =
            semester.courses.filter(
              (_, currentCourseIndex) =>
                currentCourseIndex !== courseIndex
            );

          return {
            ...semester,
            courses:
              remainingCourses.length > 0
                ? remainingCourses
                : [
                    {
                      id: newId(),
                      name: "",
                      code: "",
                      credits: 3,
                      grade: "",
                    },
                  ],
          };
        }
      ),
    }));

    setResult(null);
    setError(null);
  }

  /* ---------------- add semester ---------------- */

  function addSemester() {
    setState((current) => ({
      ...current,
      semesters: [
        ...current.semesters,
        makeSemester(
          `Semester ${current.semesters.length + 1}`
        ),
      ],
    }));

    setResult(null);
    setError(null);
  }

  /* ---------------- reset ---------------- */

  function reset() {
    setState({
      universityId: "",
      previousCGPA: "",
      completedCredits: "",
      semesters: [makeSemester("Semester 1")],
    });

    setResult(null);
    setError(null);
  }

  /* ---------------- PDF ---------------- */

  function downloadPDF() {
    if (!university) {
      setError(
        "Please select a university before downloading the PDF."
      );
      return;
    }

    if (!result) {
      setError(
        "Please calculate your CGPA before downloading the PDF."
      );
      return;
    }

    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("CGPA Report", 14, y);
    y += 10;

    doc.setFontSize(11);
    doc.text(
      `University: ${university.name}`,
      14,
      y
    );
    y += 8;

    if (result.previousCredits > 0) {
      doc.text(
        `Previous CGPA: ${result.previousCGPA.toFixed(2)}`,
        14,
        y
      );
      y += 6;

      doc.text(
        `Previously Completed Credits: ${result.previousCredits}`,
        14,
        y
      );
      y += 10;
    }

    state.semesters.forEach(
      (semester, semesterIndex) => {
        const semesterResult =
          result.perSemester[semesterIndex];

        if (y > 270) {
          doc.addPage();
          y = 15;
        }

        doc.setFontSize(13);
        doc.text(semester.name, 14, y);
        y += 7;

        doc.setFontSize(10);

        semester.courses.forEach(
          (course, courseIndex) => {
            if (y > 275) {
              doc.addPage();
              y = 15;
            }

            const gradePoint =
              getCoursePoint(course, university);

            const displayGrade =
              getCourseGrade(course, university);

            const courseName =
              course.name ||
              course.code ||
              `Course ${courseIndex + 1}`;

            doc.text(
              `${courseName} | Credits: ${course.credits} | Grade: ${displayGrade} | Point: ${gradePoint.toFixed(2)}`,
              18,
              y
            );

            y += 6;
          }
        );

        doc.text(
          `Semester GPA: ${
            semesterResult?.gpa.toFixed(2) ??
            "0.00"
          }`,
          18,
          y
        );

        y += 10;
      }
    );

    if (y > 250) {
      doc.addPage();
      y = 15;
    }

    doc.setFontSize(11);

    doc.text(
      `Newly Completed Credits: ${result.currentCredits}`,
      14,
      y
    );
    y += 7;

    doc.text(
      `Total Completed Credits: ${result.totalCredits}`,
      14,
      y
    );
    y += 7;

    doc.text(
      `Total Quality Points: ${result.totalQualityPoints.toFixed(2)}`,
      14,
      y
    );
    y += 8;

    doc.setFontSize(15);
    doc.text(
      `Final CGPA: ${result.cgpa.toFixed(2)}`,
      14,
      y
    );

    doc.save("cgpa.pdf");
  }

  /* ---------------- UI ---------------- */

  return (
    <AppLayout>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        {/* LEFT */}

        <div className="space-y-4">
          <UniversityPicker
            value={state.universityId}
            onChange={(selectedUniversity: University) => {
              setState((current) => ({
                ...current,
                universityId: selectedUniversity.id,
                semesters: current.semesters.map(
                  (semester) => ({
                    ...semester,
                    courses: semester.courses.map(
                      (course) => ({
                        ...course,
                        grade: "",
                        marks: undefined,
                      })
                    ),
                  })
                ),
              }));

              setResult(null);
              setError(null);
            }}
          />

          {/* PREVIOUS SEMESTER RECORDS */}

          <div className="glass rounded-none p-5">
            <h2 className="mb-4 text-base font-semibold">
              Previous Semester&apos;s Records
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold">
                  Current CGPA:
                </span>

                <input
                  type="number"
                  min="0"
                  max={university?.scale}
                  step="0.01"
                  value={state.previousCGPA}
                  placeholder="Enter current CGPA"
                  onChange={(event) => {
                    setState((current) => ({
                      ...current,
                      previousCGPA:
                        event.target.value,
                    }));

                    setResult(null);
                    setError(null);
                  }}
                  className="
                    w-full rounded-xl border border-border
                    bg-background px-3 py-2.5 text-sm
                    outline-none transition-colors
                    focus:border-blue-500 focus:ring-2
                    focus:ring-blue-500/30
                  "
                />
              </label>

              <label>
                <span className="mb-2 block text-sm font-semibold">
                  Completed Credits:
                </span>

                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={state.completedCredits}
                  placeholder="Enter completed credits"
                  onChange={(event) => {
                    setState((current) => ({
                      ...current,
                      completedCredits:
                        event.target.value,
                    }));

                    setResult(null);
                    setError(null);
                  }}
                  className="
                    w-full rounded-xl border border-border
                    bg-background px-3 py-2.5 text-sm
                    outline-none transition-colors
                    focus:border-blue-500 focus:ring-2
                    focus:ring-blue-500/30
                  "
                />
              </label>
            </div>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard
              label="CGPA"
              value={
                result
                  ? result.cgpa.toFixed(2)
                  : "—"
              }
              icon={Award}
            />

            <StatCard
              label="Credits"
              value={
                result
                  ? String(result.totalCredits)
                  : "—"
              }
              icon={BookOpen}
            />

            <StatCard
              label="Points"
              value={
                result
                  ? result.totalQualityPoints.toFixed(1)
                  : "—"
              }
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
            <div className="glass rounded-none p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {/* SEMESTERS */}

          {state.semesters.map(
            (semester, semesterIndex) => (
              <div
                key={semester.id}
                className="glass rounded-none p-5"
              >
                <div className="mb-3 flex justify-between">
                  <input
                    value={semester.name}
                    onChange={(event) => {
                      setState((current) => ({
                        ...current,
                        semesters:
                          current.semesters.map(
                            (
                              currentSemester,
                              currentIndex
                            ) =>
                              currentIndex ===
                              semesterIndex
                                ? {
                                    ...currentSemester,
                                    name:
                                      event.target
                                        .value,
                                  }
                                : currentSemester
                          ),
                      }));

                      setResult(null);
                    }}
                    className="bg-transparent font-semibold outline-none"
                  />

                  <span className="rounded-full bg-accent/50 px-3 py-1 text-xs">
                    {semester.courses.length} Courses
                  </span>
                </div>

               {/* COURSES */}

                {university ? (
                  <div className="space-y-3 sm:space-y-2">
                    {semester.courses.map(
                      (course, courseIndex) => (
                        <CourseRow
                          key={course.id}
                          course={course}
                          university={university}
                          onChange={(updatedCourse) =>
                            updateCompleteCourse(
                              semesterIndex,
                              courseIndex,
                              updatedCourse
                            )
                          }
                          onRemove={() =>
                            removeCourse(
                              semesterIndex,
                              courseIndex
                            )
                          }
                        />
                      )
                    )}
                  </div>
                ) : (
                  <div className="border border-blue-500/40 bg-blue-500/5 p-4 text-sm text-muted-foreground">
                    Select a university to enter course grades.
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    addCourse(semesterIndex)
                  }
                  disabled={!university}
                  className="
                    gradient-brand mt-3 inline-flex
                    items-center gap-2 rounded-xl
                    px-4 py-2 text-sm font-semibold
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Plus className="h-4 w-4" />
                  Add Course
                </button>
              </div>
            )
          )}

          {/* ACTIONS */}

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCalculate}
              className="gradient-brand rounded-xl px-4 py-2 font-semibold"
            >
              Calculate
            </button>

            <button
              type="button"
              onClick={addSemester}
              disabled={!university}
              className="
                gradient-brand rounded-xl px-4 py-2
                font-semibold disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Add Semester
            </button>

            <button
              type="button"
              onClick={downloadPDF}
              className="
                gradient-brand inline-flex items-center
                gap-2 rounded-xl px-4 py-2 font-semibold
              "
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>

            <button
              type="button"
              onClick={reset}
              className="gradient-brand rounded-xl px-4 py-2 font-semibold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* RIGHT - GRADING SYSTEM */}

        <div className="glass h-fit rounded-none p-4">
          <h2 className="mb-3 text-sm font-semibold">
            Grading System
          </h2>

          <div className="space-y-2">
            {university ? (
              university.grades.map((grade) => (
                <div
                  key={grade.grade}
                  className="flex justify-between text-sm"
                >
                  <span>{grade.grade}</span>

                  <span className="font-semibold">
                    {grade.point.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Select a university to view its grading system.
              </p>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
