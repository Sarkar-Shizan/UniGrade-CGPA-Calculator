"use client";

import { Trash2 } from "lucide-react";
import type { Course, University } from "@/types";

/* ---------------- helpers ---------------- */

function coursePoint(course: Course, university: University) {
  if (university.gradingType === "letter") {
    const grade = university.grades.find(
      (item) => item.grade === course.grade
    );

    return grade ? grade.point : 0;
  }

  if (university.gradingType === "percentage") {
    const marks = course.marks ?? 0;

    const grade = university.grades.find(
      (item) =>
        item.minPercent != null &&
        item.maxPercent != null &&
        marks >= item.minPercent &&
        marks <= item.maxPercent
    );

    return grade ? grade.point : 0;
  }

  return 0;
}

function marksToGrade(
  marks: number,
  university: University
) {
  return university.grades.find(
    (grade) =>
      grade.minPercent != null &&
      grade.maxPercent != null &&
      marks >= grade.minPercent &&
      marks <= grade.maxPercent
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
  onChange: (course: Course) => void;
  onRemove: () => void;
}) {
  const point = coursePoint(course, university);

  const derivedGrade =
    university.gradingType === "percentage" &&
    course.marks != null
      ? marksToGrade(
          course.marks,
          university
        )?.grade
      : null;

  const fieldClassName = `
    min-w-0
    rounded-xl
    border border-border
    bg-transparent
    px-3 py-2
    text-sm
    outline-none
    transition-colors
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-500/30
  `;

  return (
    <div className="glass grid grid-cols-1 items-center gap-2 rounded-none p-3 md:grid-cols-[1.4fr_0.8fr_0.6fr_1fr_0.6fr_auto] md:gap-3 md:p-4">
      {/* COURSE NAME */}
      <input
        type="text"
        placeholder="Course name"
        value={course.name}
        onChange={(event) =>
          onChange({
            ...course,
            name: event.target.value,
          })
        }
        className={fieldClassName}
      />

      {/* COURSE CODE */}
      <input
        type="text"
        placeholder="Code"
        value={course.code}
        onChange={(event) =>
          onChange({
            ...course,
            code: event.target.value,
          })
        }
        className={fieldClassName}
      />

      {/* COURSE CREDITS */}
      <input
        type="number"
        min={0}
        step={0.5}
        placeholder="Credits"
        value={course.credits || ""}
        onChange={(event) =>
          onChange({
            ...course,
            credits:
              event.target.value === ""
                ? 0
                : Number(event.target.value),
          })
        }
        className={fieldClassName}
      />

      {/* GRADE OR MARKS */}
      {university.gradingType === "letter" ? (
        <select
          value={course.grade ?? ""}
          onChange={(event) =>
            onChange({
              ...course,
              grade:
                event.target.value ||
                undefined,
            })
          }
          className={`${fieldClassName} bg-background`}
        >
          <option value="">Grade</option>

          {university.grades.map((grade) => (
            <option
              key={grade.grade}
              value={grade.grade}
            >
              {grade.grade} (
              {grade.point.toFixed(2)})
            </option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          min={0}
          max={100}
          step={0.01}
          placeholder="Marks %"
          value={course.marks ?? ""}
          onChange={(event) =>
            onChange({
              ...course,
              marks:
                event.target.value === ""
                  ? undefined
                  : Number(
                      event.target.value
                    ),
            })
          }
          className={fieldClassName}
        />
      )}

      {/* GRADE POINT */}
      <div className="text-center text-sm tabular-nums">
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
          <span className="text-muted-foreground">
            —
          </span>
        )}
      </div>

      {/* REMOVE BUTTON */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove course"
        title="Remove course"
        className="
          grid h-9 w-9 place-items-center
          justify-self-end rounded-xl
          border border-transparent
          text-destructive
          transition
          hover:border-red-500
          hover:bg-destructive/10
          focus:border-red-500
          focus:outline-none
          focus:ring-2
          focus:ring-red-500/30
        "
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}