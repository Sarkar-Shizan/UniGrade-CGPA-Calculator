"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  GraduationCap,
  Home,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const nav = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/calculator", label: "Calculator", icon: Calculator },
  { href: "/universities", label: "Universities", icon: GraduationCap },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  /* load + apply theme once */
  useEffect(() => {
    const saved =
      (localStorage.getItem("theme") as "dark" | "light") || "dark";

    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  /* toggle theme */
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
    <div className="min-h-screen flex w-full">
      <aside className="hidden md:flex md:w-64 shrink-0 flex-col gap-2 p-4 sticky top-0 h-screen">
        <div className="glass rounded-none p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-brand grid place-items-center">
            <Calculator className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">
              UniGrade
            </div>
            <div className="text-xs text-muted-foreground truncate">
              CGPA Calculator
            </div>
          </div>
        </div>

        <nav className="glass rounded-none p-2 flex-1">
          <ul className="flex flex-col gap-1">
            {nav.map((n) => {
              const active =
                pathname === n.href ||
                pathname.startsWith(`${n.href}/`);

              return (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
                      active
                        ? "gradient-brand shadow-md"
                        : "hover:bg-accent/60 text-foreground/80"
                    )}
                  >
                    <n.icon className="h-4 w-4" />
                    <span>{n.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          onClick={toggle}
          className="glass rounded-none p-3 flex items-center gap-3 text-sm hover:bg-accent/50 transition"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </span>
        </button>
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8 pb-24 md:pb-8">
        <div className="md:hidden flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl gradient-brand grid place-items-center">
              <Calculator className="h-4 w-4" />
            </div>
            <div className="font-semibold">UniGrade</div>
          </div>

          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-9 w-9 rounded-xl glass grid place-items-center"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="animate-fade-in">{children}</div>
      </main>

      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 glass rounded-2xl px-2 py-2">
        <ul className="flex items-center justify-between">
          {nav.map((n) => {
            const active =
              pathname === n.href ||
              pathname.startsWith(`${n.href}/`);

            return (
              <li key={n.href} className="flex-1">
                <Link
                  href={n.href}
                  className={cn(
                    "flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] transition",
                    active
                      ? "gradient-brand"
                      : "text-foreground/70 hover:bg-accent/50"
                  )}
                >
                  <n.icon className="h-4 w-4" />
                  <span>{n.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}