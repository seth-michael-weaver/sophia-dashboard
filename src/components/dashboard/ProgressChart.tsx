import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

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
      <h3 className="mb-1 text-sm font-semibold text-foreground">Training Progress</h3>
      <p className="mb-4 text-xs text-muted-foreground">Click a segment to filter students</p>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              style={{ cursor: "pointer" }}
              onClick={(_, index) => handleClick(data[index].name)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  opacity={activeStatus && activeStatus !== entry.name ? 0.3 : 1}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "hsl(0 0% 100%)",
                border: "1px solid hsl(214 20% 90%)",
                borderRadius: "8px",
                fontSize: "12px",
                boxShadow: "0 4px 12px -2px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {/* Legend as clickable buttons */}
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        {data.map((item) => (
          <button
            key={item.name}
            onClick={() => handleClick(item.name)}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer ${
              activeStatus === item.name
                ? "ring-2 ring-primary ring-offset-1"
                : activeStatus
                ? "opacity-40"
                : ""
            }`}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.name} ({item.value}%)
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgressChart;
