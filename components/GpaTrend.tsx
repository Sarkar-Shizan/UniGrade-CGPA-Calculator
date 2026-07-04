"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function GpaTrend({
  data,
  scale,
}: {
  data: { name: string; gpa: number }[];
  scale: number;
}) {
  return (
    <div className="glass rounded-2xl p-4 h-72">
      <div className="text-sm font-semibold mb-2">GPA trend by semester</div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
          <XAxis dataKey="name" stroke="currentColor" opacity={0.6} fontSize={12} />
          <YAxis
            domain={[0, scale]}
            stroke="currentColor"
            opacity={0.6}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--popover-foreground)",
            }}
          />
          <Line
            type="monotone"
            dataKey="gpa"
            stroke="var(--brand)"
            strokeWidth={3}
            dot={{ r: 4, fill: "var(--brand-2)" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
