import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  accent?: boolean;
}) {
  return (
    <div
      className={ "glass rounded-none p-4 flex flex-col gap-2 " +
        (accent ? "gradient-brand" : "")
      }
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wide opacity-80">
          {label}
        </div>
        <Icon className="h-4 w-4 opacity-80" />
      </div>
      <div className="text-2xl md:text-3xl font-bold tabular-nums">{value}</div>
      {hint && <div className="text-xs opacity-80">{hint}</div>}
    </div>
  );
}
