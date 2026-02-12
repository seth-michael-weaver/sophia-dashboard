import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts";
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

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={errorTypes} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
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
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={18} className="cursor-pointer">
              {errorTypes.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={severityColors[entry.severity]} />
              ))}
              <LabelList
                dataKey="count"
                position="right"
                style={{ fontSize: "11px", fontWeight: 600, fill: "hsl(215, 25%, 27%)" }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ErrorAnalytics;
