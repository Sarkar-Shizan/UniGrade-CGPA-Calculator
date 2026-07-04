"use client";

import { Moon, Sun, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";

type Theme = "dark" | "light";

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("dark");

  /* load theme */
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) setTheme(saved);
  }, []);

  /* apply theme */
  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <AppLayout>
      <div className="glass rounded-3xl p-6 mb-4">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Preferences are stored on this device only.
        </p>
      </div>

      <div className="space-y-3">
        {/* Theme */}
        <div className="glass rounded-2xl p-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <div className="font-semibold">Appearance</div>
            <div className="text-sm text-muted-foreground">
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </div>
          </div>

          <button
            onClick={toggle}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            Toggle
          </button>
        </div>

        {/* Reset data */}
        <div className="glass rounded-2xl p-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <div className="min-w-0">
            <div className="font-semibold">Reset all data</div>
            <div className="text-sm text-muted-foreground">
              Clears calculator state and history.
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("cgpa:state");
              localStorage.removeItem("cgpa:history");
              localStorage.removeItem("theme");

              alert("Local data cleared. Reloading…");
              setTimeout(() => window.location.reload(), 500);
            }}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm text-destructive hover-scale"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>
    </AppLayout>
  );
}