"use client";

import { Trash2 } from "lucide-react";
import type { Course, University } from "@/types";

/* ---------------- helpers (replacing utils) ---------------- */

function coursePoint(course: Course, university: University) {
  if (university.gradingType === "letter") {
    const g = university.grades.find((x) => x.grade === course.grade);
    return g ? g.point : 0;
  }

  if (university.gradingType === "percentage") {
    const marks = course.marks ?? 0;
    const g = university.grades.find(
      (x) =>
        x.minPercent != null &&
        x.maxPercent != null &&
        marks >= x.minPercent &&
        marks <= x.maxPercent
    );
    return g ? g.point : 0;
  }

  return 0;
}

function marksToGrade(marks: number, university: University) {
  return university.grades.find(
    (g) =>
      g.minPercent != null &&
      g.maxPercent != null &&
      marks >= g.minPercent &&
      marks <= g.maxPercent
  );
}

/* ---------------- component ---------------- */

export function CourseRow({
  course,
  university,
  onChange,
  onRemove,
}: {
  course: Course;
  university: University;
  onChange: (c: Course) => void;
  onRemove: () => void;
}) {
  const point = coursePoint(course, university);

  const derivedGrade =
    university.gradingType === "percentage" && course.marks != null
      ? marksToGrade(course.marks, university)?.grade
      : null;

  return (
    <div className="glass rounded-2xl p-3 md:p-4 grid grid-cols-1 md:grid-cols-[1.4fr_0.8fr_0.6fr_1fr_0.6fr_auto] gap-2 md:gap-3 items-center">
      <input
        placeholder="Course name"
        value={course.name}
        onChange={(e) =>
          onChange({ ...course, name: e.target.value })
        }
        className="bg-transparent border border-border rounded-xl px-3 py-2 text-sm min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <input
        placeholder="Code"
        value={course.code}
        onChange={(e) =>
          onChange({ ...course, code: e.target.value })
        }
        className="bg-transparent border border-border rounded-xl px-3 py-2 text-sm min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      <input
        type="number"
        min={0}
        step={0.5}
        placeholder="Credits"
        value={course.credits || ""}
        onChange={(e) =>
          onChange({
            ...course,
            credits: parseFloat(e.target.value) || 0,
          })
        }
        className="bg-transparent border border-border rounded-xl px-3 py-2 text-sm min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
      />

      {university.gradingType === "letter" ? (
        <select
          value={course.grade ?? ""}
          onChange={(e) =>
            onChange({
              ...course,
              grade: e.target.value || undefined,
            })
          }
          className="bg-background border border-border rounded-xl px-3 py-2 text-sm min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Grade</option>
          {university.grades.map((g) => (
            <option key={g.grade} value={g.grade}>
              {g.grade} ({g.point.toFixed(2)})
            </option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          min={0}
          max={100}
          placeholder="Marks %"
          value={course.marks ?? ""}
          onChange={(e) =>
            onChange({
              ...course,
              marks:
                e.target.value === ""
                  ? undefined
                  : parseFloat(e.target.value),
            })
          }
          className="bg-transparent border border-border rounded-xl px-3 py-2 text-sm min-w-0 focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}

      <div className="text-sm tabular-nums text-center">
        {point > 0 ? (
          <span className="font-semibold">
            {point.toFixed(2)}
            {derivedGrade && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({derivedGrade})
              </span>
            )}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </div>

      <button
        onClick={onRemove}
        aria-label="Remove"
        className="h-9 w-9 rounded-xl grid place-items-center hover:bg-destructive/10 text-destructive transition justify-self-end"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}