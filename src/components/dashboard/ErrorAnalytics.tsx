import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { errorTypes } from "@/data/mockData";
import { AlertTriangle } from "lucide-react";

const severityColors: Record<string, string> = {
  critical: "hsl(0, 72%, 51%)",
  moderate: "hsl(38, 92%, 50%)",
  minor: "hsl(214, 20%, 75%)",
};

const ErrorAnalytics = () => {
  return (
    <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h3 className="text-sm font-semibold text-foreground">Common Errors</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">Click to filter students by error type</p>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={errorTypes} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 11, fill: "hsl(215, 14%, 46%)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(214 20% 90%)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px -2px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value} occurrences`, ""]}
              cursor={{ fill: "hsl(214, 20%, 96%)" }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={16} className="cursor-pointer">
              {errorTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={severityColors[entry.severity]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Error chips */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {errorTypes.slice(0, 5).map((error) => (
          <button
            key={error.name}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-colors cursor-pointer ${
              error.severity === "critical"
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : error.severity === "moderate"
                ? "bg-warning/10 text-warning hover:bg-warning/20"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {error.name}
            <span className="opacity-70">({error.count})</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ErrorAnalytics;
