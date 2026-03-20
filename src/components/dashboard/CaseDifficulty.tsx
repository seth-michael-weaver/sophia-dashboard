import { useState } from "react";
import { patientCases as mockPatientCases } from "@/data/mockData";
import { usePatientCases } from "@/hooks/useCases";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Target } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AxisKey = "errorRate" | "avgScore" | "attempts" | "successRate" | "completions";

const axisOptions: { value: AxisKey; label: string }[] = [
  { value: "errorRate", label: "Error Rate %" },
  { value: "avgScore", label: "Avg Score" },
  { value: "attempts", label: "Attempts" },
  { value: "successRate", label: "Success Rate %" },
  { value: "completions", label: "Completions" },
];

const difficultyColors: Record<string, string> = {
  Easy: "hsl(142, 71%, 45%)",
  Moderate: "hsl(38, 92%, 50%)",
  Hard: "hsl(0, 65%, 48%)",
};

// Moved inside component to use API data

interface CaseDifficultyProps {
  onCaseClick?: (difficulty: string) => void;
  activeDifficulty?: string;
  onSingleCaseClick?: (caseId: number) => void;
  activeCaseId?: number | null;
}

const CaseDifficulty = ({ onCaseClick, activeDifficulty, onSingleCaseClick, activeCaseId }: CaseDifficultyProps) => {
  const { data: apiCases } = usePatientCases();
  const patientCases = apiCases ?? mockPatientCases;
  const enrichedCases = patientCases.map((c) => ({ ...c, successRate: 100 - c.errorRate }));

  const [xAxis, setXAxis] = useState<AxisKey>("errorRate");
  const [yAxis, setYAxis] = useState<AxisKey>("avgScore");

  const xLabel = axisOptions.find((o) => o.value === xAxis)?.label ?? "";
  const yLabel = axisOptions.find((o) => o.value === yAxis)?.label ?? "";

  const handleScatterClick = (data: any) => {
    if (onSingleCaseClick && data?.id) {
      onSingleCaseClick(data.id);
    }
  };

  return (
    <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Case Difficulty</h3>
      </div>
      <p className="mb-3 text-xs text-muted-foreground">Click a dot to filter that case below. Use legend to filter by difficulty.</p>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3">
        {Object.entries(difficultyColors).map(([name, color]) => (
          <button
            key={name}
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 transition-opacity ${
              activeDifficulty && activeDifficulty !== name ? "opacity-30" : ""
            } ${activeDifficulty === name ? "ring-1 ring-primary" : ""}`}
            onClick={() => onCaseClick?.(name)}
          >
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] text-muted-foreground">{name}</span>
          </button>
        ))}
        {(activeDifficulty || activeCaseId) && (
          <button onClick={() => { onCaseClick?.(""); onSingleCaseClick?.(0); }} className="text-[10px] text-destructive hover:underline ml-auto">Clear</button>
        )}
      </div>

      {/* Axis selectors */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">X:</span>
          <Select value={xAxis} onValueChange={(v) => setXAxis(v as AxisKey)}>
            <SelectTrigger className="h-7 w-[130px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{axisOptions.map((o) => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase">Y:</span>
          <Select value={yAxis} onValueChange={(v) => setYAxis(v as AxisKey)}>
            <SelectTrigger className="h-7 w-[130px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>{axisOptions.map((o) => <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 92%)" />
            <XAxis
              type="number" dataKey={xAxis} name={xLabel}
              tick={{ fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
              axisLine={false} tickLine={false}
              label={{ value: xLabel, position: "insideBottom", offset: -2, fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
            />
            <YAxis
              type="number" dataKey={yAxis} name={yLabel}
              tick={{ fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
              axisLine={false} tickLine={false}
              label={{ value: yLabel, angle: -90, position: "insideLeft", offset: 24, fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
            />
            <ZAxis type="number" dataKey="attempts" range={[40, 200]} name="Attempts" />
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 100%)", border: "1px solid hsl(214 20% 90%)",
                borderRadius: "8px", fontSize: "12px", boxShadow: "0 4px 12px -2px rgba(0,0,0,0.1)",
              }}
              labelFormatter={(_, payload) => payload?.[0] ? payload[0].payload.caseName : ""}
              formatter={(value: number, name: string) => [value, name]}
            />
            {["Easy", "Moderate", "Hard"].map((diff) => (
              <Scatter
                key={diff}
                data={enrichedCases.filter((c) => c.difficulty === diff)}
                fill={difficultyColors[diff]}
                fillOpacity={
                  activeCaseId
                    ? 0.15
                    : activeDifficulty && activeDifficulty !== diff
                    ? 0.15
                    : 0.7
                }
                stroke={difficultyColors[diff]}
                strokeWidth={1}
                name={diff}
                className="cursor-pointer"
                onClick={handleScatterClick}
                shape={(props: any) => {
                  const isActive = activeCaseId === props.payload?.id;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={isActive ? 8 : props.r || 5}
                      fill={difficultyColors[props.payload?.difficulty]}
                      fillOpacity={
                        activeCaseId
                          ? isActive ? 1 : 0.15
                          : activeDifficulty && activeDifficulty !== diff
                          ? 0.15
                          : 0.7
                      }
                      stroke={isActive ? "hsl(222, 47%, 11%)" : difficultyColors[props.payload?.difficulty]}
                      strokeWidth={isActive ? 2 : 1}
                      className="cursor-pointer"
                    />
                  );
                }}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {activeCaseId ? (
        <p className="mt-2 text-[10px] text-primary font-medium">
          Showing: {patientCases.find(c => c.id === activeCaseId)?.caseName}
        </p>
      ) : null}
    </div>
  );
};

export default CaseDifficulty;
