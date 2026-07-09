"use client";

import { Moon, Sun, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";

type Theme = "dark" | "light";

export default function SettingsPage() {
  const [theme, setTheme] = useState<Theme>("dark");

  /* INIT ONLY ONCE */
  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme) || "dark";

    setTheme(saved);
    document.documentElement.classList.toggle(
      "dark",
      saved === "dark"
    );
  }, []);

  /* TOGGLE ONLY */
  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";

      localStorage.setItem("theme", next);

      document.documentElement.classList.toggle(
        "dark",
        next === "dark"
      );

      return next;
    });
  };

  return (
    <AppLayout>
      <div className="glass rounded-none p-6 mb-4">
        <h1 className="text-2xl font-bold">
          <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Preferences are stored on this device only.
        </p>
      </div>

      <div className="space-y-3">
        {/* Theme */}
        <div className="glass rounded-none p-4 flex justify-between items-center">
          <div>
            <div className="font-semibold">Appearance</div>
            <div className="text-sm text-muted-foreground">
              {theme === "dark" ? "Dark mode" : "Light mode"}
            </div>
          </div>

          <button
            onClick={toggle}
            className="flex items-center gap-2 rounded-xl gradient-brand px-4 py-2 text-sm font-semibold"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            Toggle
          </button>
        </div>

        {/* Reset */}
        <div className="glass rounded-none p-4 flex justify-between items-center">
          <div>
            <div className="font-semibold">Reset all data</div>
            <div className="text-sm text-muted-foreground">
              Clears calculator state and history.
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="flex items-center gap-2 rounded-xl glass px-4 py-2 text-sm text-destructive"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>
    </AppLayout>
  );
}