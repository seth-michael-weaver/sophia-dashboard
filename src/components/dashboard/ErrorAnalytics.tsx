import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts";
import { errorTypes as mockErrorTypes } from "@/data/mockData";
import { useErrorTypes } from "@/hooks/useErrors";
import { AlertTriangle } from "lucide-react";

const severityColors: Record<string, string> = {
  critical: "hsl(0, 65%, 48%)",
  moderate: "hsl(0, 65%, 48%)",
  minor: "hsl(0, 65%, 48%)",
};

interface ErrorAnalyticsProps {
  activeErrors?: string[];
  onErrorToggle?: (error: string) => void;
  onClearErrors?: () => void;
}

const ErrorAnalytics = ({ activeErrors = [], onErrorToggle, onClearErrors }: ErrorAnalyticsProps) => {
  const { data: apiErrorTypes } = useErrorTypes();
  const errorTypes = apiErrorTypes ?? mockErrorTypes;
  const handleClick = (name: string) => {
    if (onErrorToggle) {
      onErrorToggle(name);
    }
  };

  return (
    <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <h3 className="text-sm font-semibold text-foreground">Common Errors</h3>
      </div>
      <p className="mb-4 text-xs text-muted-foreground">Click bars to filter cases by error type (multi-select)</p>

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
            <Bar
              dataKey="count"
              radius={[0, 4, 4, 0]}
              barSize={18}
              className="cursor-pointer"
              onClick={(data) => handleClick(data.name)}
            >
              {errorTypes.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={severityColors[entry.severity]}
                  opacity={activeErrors.length > 0 && !activeErrors.includes(entry.name) ? 0.3 : 1}
                />
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

      {activeErrors.length > 0 && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Filtered:</span>
          {activeErrors.map((err) => (
            <span key={err} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
              {err}
              <button onClick={() => onErrorToggle?.(err)} className="ml-0.5 text-primary/60 hover:text-primary">×</button>
            </span>
          ))}
          <button onClick={() => onClearErrors?.()} className="text-[10px] text-destructive hover:underline ml-auto">Clear all</button>
        </div>
      )}
    </div>
  );
};

export default ErrorAnalytics;
