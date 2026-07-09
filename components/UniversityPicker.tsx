"use client";

import {
  Check,
  ChevronsUpDown,
  Search,
  X,
} from "lucide-react";
import {
  useMemo,
  useRef,
  useState,
} from "react";

import { universities } from "@/data/universities";
import type { University } from "@/types";

/* Local cn helper */
function cn(
  ...classes: (
    | string
    | false
    | null
    | undefined
  )[]
) {
  return classes.filter(Boolean).join(" ");
}

interface UniversityPickerProps {
  value: string;
  onChange: (university: University) => void;
  onClear?: () => void;
}

export function UniversityPicker({
  value,
  onChange,
  onClear,
}: UniversityPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const searchInputRef =
    useRef<HTMLInputElement>(null);

  const selected =
    universities.find(
      (university) =>
        university.id === value
    ) ?? null;

  const filtered = useMemo(() => {
    const searchValue =
      query.trim().toLowerCase();

    if (!searchValue) {
      return universities;
    }

    return universities.filter(
      (university) => {
        const searchableText = [
          university.name,
          university.country,
          university.notes,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          searchValue
        );
      }
    );
  }, [query]);

  function togglePicker() {
    setOpen((current) => !current);

    window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  }

  function selectUniversity(
    university: University
  ) {
    onChange(university);
    setOpen(false);
    setQuery("");
  }

  function clearSelection() {
    onClear?.();
    setOpen(false);
    setQuery("");
  }

  return (
    <div className="relative">
      {/* SELECTED UNIVERSITY BUTTON */}

      <button
        type="button"
        onClick={togglePicker}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "glass flex w-full items-center justify-between",
          "rounded-none border border-border px-4 py-3",
          "text-left outline-none transition-colors",
          "hover:bg-accent/40",
          "focus:border-blue-500",
          "focus:ring-2",
          "focus:ring-blue-500/30"
        )}
      >
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            University
          </div>

          <div
            className={cn(
              "truncate font-medium",
              !selected &&
                "text-muted-foreground"
            )}
          >
            {selected
              ? selected.name
              : "Select your university"}
          </div>

          {selected ? (
            <div className="text-xs text-muted-foreground">
              {selected.country} ·{" "}
              {selected.scale.toFixed(1)} scale
              · {selected.gradingType}
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">
              No university selected
            </div>
          )}
        </div>

        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {/* DROPDOWN */}

      {open && (
        <div
          className={cn(
            "glass absolute z-30 mt-2 w-full",
            "rounded-none border border-border p-2",
            "animate-scale-in origin-top"
          )}
        >
          {/* SEARCH FIELD */}

          <div
            className={cn(
              "flex items-center gap-2",
              "border border-border px-3",
              "transition-colors",
              "focus-within:border-blue-500",
              "focus-within:ring-2",
              "focus-within:ring-blue-500/30"
            )}
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />

            <input
              ref={searchInputRef}
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search universities..."
              className="min-w-0 w-full bg-transparent py-2 text-sm outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="grid h-7 w-7 shrink-0 place-items-center text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <ul
            role="listbox"
            className="mt-2 max-h-72 overflow-auto"
          >
            {/* CLEAR CURRENT SELECTION */}

            {selected && onClear && (
              <li className="border-b border-border/60 pb-1">
                <button
                  type="button"
                  onClick={clearSelection}
                  className={cn(
                    "flex w-full items-center gap-2",
                    "rounded-none px-3 py-2",
                    "text-left text-sm text-muted-foreground",
                    "transition hover:bg-accent/60",
                    "hover:text-foreground"
                  )}
                >
                  <X className="h-4 w-4" />
                  Clear university selection
                </button>
              </li>
            )}

            {/* NO RESULTS */}

            {filtered.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                No matching university found
              </li>
            )}

            {/* UNIVERSITY OPTIONS */}

            {filtered.map((university) => {
              const isSelected =
                university.id === value;

              return (
                <li key={university.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() =>
                      selectUniversity(
                        university
                      )
                    }
                    className={cn(
                      "flex w-full items-center justify-between gap-3",
                      "rounded-none px-3 py-2",
                      "text-sm transition",
                      "hover:bg-accent/60",
                      isSelected &&
                        "bg-accent/50"
                    )}
                  >
                    <div className="min-w-0 text-left">
                      <div className="truncate font-medium">
                        {university.name}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {university.country} ·{" "}
                        {university.scale.toFixed(
                          1
                        )}{" "}
                        ·{" "}
                        {
                          university.gradingType
                        }
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}