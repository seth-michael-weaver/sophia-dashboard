import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Walkthrough Complete", value: 45, color: "hsl(217, 91%, 60%)" },
  { name: "Verification Done", value: 18, color: "hsl(152, 69%, 41%)" },
  { name: "In Progress", value: 25, color: "hsl(38, 92%, 50%)" },
  { name: "Not Started", value: 12, color: "hsl(214, 20%, 90%)" },
];

const ProgressChart = () => {
  return (
    <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
      <h3 className="mb-1 text-sm font-semibold text-foreground">Training Progress</h3>
      <p className="mb-4 text-xs text-muted-foreground">Distribution across all students</p>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
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
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value: string) => (
                <span style={{ fontSize: "11px", color: "hsl(215, 14%, 46%)" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
