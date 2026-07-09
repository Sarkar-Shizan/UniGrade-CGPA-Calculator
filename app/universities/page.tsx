"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AppLayout } from "@/components/AppLayout";
import { universities } from "@/data/universities";

export default function UniversitiesClient() {
  const [q, setQ] = useState("");
  const [division, setDivision] = useState("All");

  const divisions = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          universities
            .map((university) => university.division)
            .filter(
              (value): value is string =>
                Boolean(value)
            )
        )
      ).sort(),
    ],
    []
  );

  const filtered = useMemo(() => {
    const searchQuery = q
      .trim()
      .toLowerCase();

    return universities.filter(
      (university) => {
        const matchesDivision =
          division === "All" ||
          university.division === division;

        const matchesSearch =
          searchQuery === "" ||
          university.name
            .toLowerCase()
            .includes(searchQuery) ||
          university.country
            .toLowerCase()
            .includes(searchQuery) ||
          university.division
            ?.toLowerCase()
            .includes(searchQuery);

        return (
          matchesDivision &&
          matchesSearch
        );
      }
    );
  }, [q, division]);

  return (
    <AppLayout>
      {/* HEADER */}

      <div className="glass mb-4 rounded-none p-4 sm:p-6">
        <h1 className="text-xl font-bold sm:text-2xl">
          <span className="gradient-text">
            University database
          </span>
        </h1>

        <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          Browse Bangladeshi universities by
          name, short name, or division.
        </p>

        {/* SEARCH AND DIVISION FILTER */}

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
          <div
            className="
              glass
              flex min-w-0 items-center gap-2
              rounded-xl
              border border-border
              px-3
              transition-colors
              focus-within:border-blue-500
              focus-within:ring-2
              focus-within:ring-blue-500/30
            "
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

            <input
              value={q}
              onChange={(event) =>
                setQ(event.target.value)
              }
              placeholder="Search university or short name..."
              className="
                min-w-0 flex-1
                bg-transparent
                py-2.5
                text-sm
                outline-none
                placeholder:text-xs
                sm:placeholder:text-sm
              "
            />
          </div>

          <select
            value={division}
            onChange={(event) =>
              setDivision(event.target.value)
            }
            aria-label="Filter universities by division"
            className="
              w-full min-w-0
              rounded-xl
              border border-border
              bg-background
              px-3 py-2.5
              text-sm
              outline-none
              transition-colors
              focus:border-blue-500
              focus:ring-2
              focus:ring-blue-500/30
            "
          >
            {divisions.map(
              (divisionName) => (
                <option
                  key={divisionName}
                  value={divisionName}
                >
                  {divisionName === "All"
                    ? "All Divisions"
                    : `${divisionName} Division`}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {/* RESULT COUNT */}

      <div className="mb-3 px-1 text-xs text-muted-foreground sm:text-sm">
        Showing {filtered.length}{" "}
        {filtered.length === 1
          ? "university"
          : "universities"}
      </div>

      {/* UNIVERSITY CARDS */}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {filtered.map((university) => (
          <article
            key={university.id}
            className="glass min-w-0 rounded-none p-3 sm:p-4"
          >
            {/* UNIVERSITY INFORMATION */}

            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="break-words text-sm font-semibold leading-snug sm:text-base">
                  {university.name}
                </h2>

                <div className="mt-1 text-xs text-muted-foreground">
                  {university.division
                    ? `${university.division} Division`
                    : "Division not specified"}
                </div>
              </div>

              <div
                className="
                  gradient-brand
                  w-fit shrink-0
                  rounded-lg
                  px-2 py-1
                  text-[11px]
                  sm:text-xs
                "
              >
                {university.scale.toFixed(1)} ·{" "}
                {university.gradingType}
              </div>
            </div>

            {/* GRADING TABLE */}

            <div className="mt-3 min-w-0">
              <div
                className="
                  grid
                  grid-cols-[0.75fr_0.75fr_1.2fr]
                  gap-1
                  border-b border-border/60
                  px-2 pb-1.5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide
                  text-muted-foreground
                  sm:grid-cols-[1fr_1fr_1.5fr]
                  sm:text-[11px]
                "
              >
                <span>Grade</span>
                <span>Point</span>
                <span>Marks</span>
              </div>

              <div className="mt-1 space-y-1">
                {university.grades.map(
                  (grade) => (
                    <div
                      key={grade.grade}
                      className="
                        grid
                        grid-cols-[0.75fr_0.75fr_1.2fr]
                        items-center
                        gap-1
                        rounded-md
                        bg-accent/40
                        px-2 py-1.5
                        text-[11px]
                        sm:grid-cols-[1fr_1fr_1.5fr]
                        sm:text-xs
                      "
                    >
                      <span className="min-w-0 break-words font-medium">
                        {grade.grade}
                      </span>

                      <span className="tabular-nums">
                        {grade.point.toFixed(2)}
                      </span>

                      <span className="min-w-0 break-words tabular-nums text-muted-foreground">
                        {grade.minPercent != null &&
                        grade.maxPercent != null
                          ? `${grade.minPercent}–${grade.maxPercent}`
                          : "Not specified"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* NOTES */}

            {university.notes && (
              <p className="mt-3 break-words text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                {university.notes}
              </p>
            )}
          </article>
        ))}
      </div>

      {/* EMPTY RESULT */}

      {filtered.length === 0 && (
        <div className="glass mt-3 rounded-none p-6 text-center sm:p-8">
          <p className="text-sm font-medium">
            No university found
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Try a different name, short name,
            or division.
          </p>
        </div>
      )}
    </AppLayout>
  );
}