import { Users, AlertTriangle, GraduationCap, KeyRound } from "lucide-react";
import { summaryStats, students } from "@/data/mockData";

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: "default" | "success" | "warning" | "info";
}

const accentMap = {
  default: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

const SummaryCard = ({ icon, label, value, subtitle, accent = "default" }: SummaryCardProps) => (
  <div className="flex items-center gap-4 rounded-xl bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover animate-fade-in">
    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${accentMap[accent]}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold leading-tight text-foreground">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground truncate">{subtitle}</p>}
    </div>
  </div>
);

interface SummaryCardsProps {
  activeUnit: string;
  onUnitChange: (unit: string) => void;
}

const units = ["All", "Anesthesia", "Surgery", "Internal Medicine", "Advanced Practice Providers"];

const SummaryCards = ({ activeUnit, onUnitChange }: SummaryCardsProps) => {
  const { totalStudents, activeToday, completedPercent, licensesUsed, licensesTotal } = summaryStats;

  const needsPracticeCount = students.filter((s) => s.needsPractice).length;
  const overdueOrCloseCount = students.filter((s) => s.daysRemaining <= 3).length;
  const needAttentionTotal = new Set([
    ...students.filter((s) => s.needsPractice).map((s) => s.id),
    ...students.filter((s) => s.daysRemaining <= 3).map((s) => s.id),
  ]).size;

  return (
    <div className="space-y-4">
      {/* Unit filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground mr-1">Unit:</span>
        {units.map((unit) => (
          <button
            key={unit}
            onClick={() => onUnitChange(unit)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeUnit === unit
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
          >
            {unit}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          icon={<Users className="h-5 w-5" />}
          label="Total Students"
          value={totalStudents}
          subtitle={`${activeToday} active today`}
          accent="info"
        />
        <SummaryCard
          icon={<GraduationCap className="h-5 w-5" />}
          label="Course Completed"
          value={`${completedPercent}%`}
          subtitle={`${summaryStats.completedCourse} students`}
          accent="success"
        />
        <SummaryCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Need Attention"
          value={needAttentionTotal}
          subtitle={`${needsPracticeCount} need practice · ${overdueOrCloseCount} overdue/close`}
          accent="warning"
        />
        <SummaryCard
          icon={<KeyRound className="h-5 w-5" />}
          label="Licenses"
          value={`${licensesUsed}/${licensesTotal}`}
          subtitle={`${licensesTotal - licensesUsed} remaining`}
          accent="warning"
        />
      </div>
    </div>
  );
};

export default SummaryCards;
