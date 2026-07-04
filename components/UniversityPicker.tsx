"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { universities } from "@/data/universities";
import type { University } from "@/types";
import { cn } from "@/lib/utils";

export function UniversityPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (uni: University) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return universities;
    return universities.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q),
    );
  }, [query]);

  const selected = universities.find((u) => u.id === value);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full glass rounded-2xl px-4 py-3 flex items-center justify-between text-left hover:bg-accent/40 transition"
      >
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            University
          </div>
          <div className="font-medium truncate">
            {selected ? selected.name : "Select your university"}
          </div>
          {selected && (
            <div className="text-xs text-muted-foreground">
              {selected.country} · {selected.scale.toFixed(1)} scale ·{" "}
              {selected.gradingType}
            </div>
          )}
        </div>
        <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full glass rounded-2xl p-2 animate-scale-in origin-top">
          <div className="flex items-center gap-2 px-2 py-2 border-b border-border/60">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search universities or countries..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
          <ul className="max-h-72 overflow-auto mt-1">
            {filtered.length === 0 && (
              <li className="text-sm text-muted-foreground px-3 py-6 text-center">
                No matches
              </li>
            )}
            {filtered.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(u);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm hover:bg-accent/60 transition",
                    value === u.id && "bg-accent/50",
                  )}
                >
                  <div className="min-w-0 text-left">
                    <div className="font-medium truncate">{u.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.country} · {u.scale.toFixed(1)} · {u.gradingType}
                    </div>
                  </div>
                  {value === u.id && (
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
