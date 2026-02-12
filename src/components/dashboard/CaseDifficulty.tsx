import { useState } from "react";
import { patientCases } from "@/data/mockData";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AxisKey = "errorRate" | "avgScore" | "attempts" | "successRate" | "insertions";

const axisOptions: { value: AxisKey; label: string }[] = [
  { value: "errorRate", label: "Error Rate %" },
  { value: "avgScore", label: "Avg Score" },
  { value: "attempts", label: "Attempts" },
  { value: "successRate", label: "Success Rate %" },
  { value: "insertions", label: "Insertions" },
];

const enrichedCases = patientCases.map((c) => ({
  ...c,
  successRate: 100 - c.errorRate,
  insertions: Math.round(c.attempts * (1 - c.errorRate / 100)),
}));

const CaseDifficulty = () => {
  const [xAxis, setXAxis] = useState<AxisKey>("errorRate");
  const [yAxis, setYAxis] = useState<AxisKey>("avgScore");

  const xLabel = axisOptions.find((o) => o.value === xAxis)?.label ?? "";
  const yLabel = axisOptions.find((o) => o.value === yAxis)?.label ?? "";

  return (
    <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Case Difficulty</h3>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">Actionable priority by patient case</p>

      {/* Axis selectors */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">X:</span>
          <Select value={xAxis} onValueChange={(v) => setXAxis(v as AxisKey)}>
            <SelectTrigger className="h-7 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {axisOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Y:</span>
          <Select value={yAxis} onValueChange={(v) => setYAxis(v as AxisKey)}>
            <SelectTrigger className="h-7 w-[130px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {axisOptions.map((o) => (
                <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
            <XAxis
              type="number"
              dataKey={xAxis}
              name={xLabel}
              tick={{ fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
              axisLine={false}
              tickLine={false}
              label={{ value: xLabel, position: "insideBottom", offset: -2, fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
            />
            <YAxis
              type="number"
              dataKey={yAxis}
              name={yLabel}
              tick={{ fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
              axisLine={false}
              tickLine={false}
              label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 24, fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
            />
            <ZAxis type="number" dataKey="attempts" range={[40, 200]} name="Attempts" />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(214 20% 90%)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px -2px rgba(0,0,0,0.1)",
              }}
              labelFormatter={(_, payload) => {
                if (payload?.[0]) return payload[0].payload.caseName;
                return "";
              }}
            />
            <Scatter data={enrichedCases} fill="hsl(217, 91%, 60%)" fillOpacity={0.7} stroke="hsl(217, 91%, 50%)" strokeWidth={1} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Case list */}
      <div className="mt-3 space-y-1.5">
        {patientCases.slice(0, 4).map((c) => (
          <div key={c.caseName} className="flex items-center justify-between rounded-md px-2.5 py-1.5 hover:bg-muted/50 cursor-pointer transition-colors">
            <span className="text-xs font-medium text-foreground">{c.caseName}</span>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-semibold ${c.errorRate > 30 ? "text-destructive" : "text-warning"}`}>
                {c.errorRate}% err
              </span>
              <span className="text-[10px] text-muted-foreground">{c.attempts} attempts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CaseDifficulty;
