import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList } from "recharts";

const data = [
  { name: "Walkthrough Complete", value: 45, color: "hsl(217, 91%, 60%)" },
  { name: "Verification Done", value: 18, color: "hsl(210, 78%, 46%)" },
  { name: "In Progress", value: 25, color: "hsl(199, 89%, 48%)" },
  { name: "Not Started", value: 12, color: "hsl(214, 32%, 78%)" },
];

interface ProgressChartProps {
  activeStatus?: string;
  onStatusChange?: (status: string) => void;
}

const ProgressChart = ({ activeStatus, onStatusChange }: ProgressChartProps) => {
  const handleClick = (name: string) => {
    if (onStatusChange) {
      onStatusChange(activeStatus === name ? "" : name);
    }
  };

  return (
    <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-semibold text-foreground">Training Progress</h3>
        {activeStatus && onStatusChange && (
          <button onClick={() => onStatusChange("")} className="text-[10px] text-destructive hover:underline">Clear filter</button>
        )}
      </div>
      <p className="mb-4 text-xs text-muted-foreground">Click a bar to filter students</p>

      <div className="space-y-4">
        {data.map((item) => (
          <div
            key={item.name}
            className={`cursor-pointer transition-opacity ${activeStatus && activeStatus !== item.name ? "opacity-30" : ""}`}
            onClick={() => handleClick(item.name)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground">{item.name}</span>
              <span className="text-xs font-bold text-foreground">{item.value}%</span>
            </div>
            <div className="relative h-3 w-full rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: item.color,
                }}
              />
              {/* Hatched pattern for remaining */}
              <div
                className="absolute top-0 h-full rounded-r-full"
                style={{
                  left: `${item.value}%`,
                  width: `${100 - item.value}%`,
                  backgroundImage: `repeating-linear-gradient(
                    -45deg,
                    transparent,
                    transparent 3px,
                    hsl(214, 20%, 85%) 3px,
                    hsl(214, 20%, 85%) 4px
                  )`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
