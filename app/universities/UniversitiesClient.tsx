"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { universities } from "@/data/universities";

export default function UniversitiesPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState<string>("All");

  const countries = useMemo(
    () => ["All", ...Array.from(new Set(universities.map((u) => u.country)))],
    [],
  );

  const filtered = universities.filter(
    (u) =>
      (country === "All" || u.country === country) &&
      (q === "" ||
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.country.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <AppLayout>
      <div className="glass rounded-3xl p-6 mb-4">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">University database</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Grading systems auto-detected per university. Add more in{" "}
          <code className="text-xs">data/universities.ts</code>.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_200px] gap-2">
          <div className="flex items-center gap-2 glass rounded-xl px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent outline-none py-2 text-sm"
            />
          </div>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="glass rounded-xl px-3 py-2 text-sm bg-background"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((u) => (
          <div key={u.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold truncate">{u.name}</div>
                <div className="text-xs text-muted-foreground">{u.country}</div>
              </div>
              <div className="shrink-0 rounded-lg gradient-brand px-2 py-1 text-xs">
                {u.scale.toFixed(1)} · {u.gradingType}
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1 text-xs">
              {u.grades.map((g) => (
                <div
                  key={g.grade}
                  className="flex items-center justify-between rounded-md bg-accent/40 px-2 py-1"
                >
                  <span className="font-medium">{g.grade}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {g.point.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            {u.notes && (
              <div className="mt-3 text-xs text-muted-foreground">{u.notes}</div>
            )}
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
