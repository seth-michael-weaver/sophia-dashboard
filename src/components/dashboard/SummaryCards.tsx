import { Users, AlertTriangle, KeyRound } from "lucide-react";
import { summaryStats, students } from "@/data/mockData";

interface SummaryCardsProps {
  activeUnit: string;
  onUnitChange: (unit: string) => void;
  activeStatus?: string;
  onStatusChange?: (status: string) => void;
}

const units = ["All", "Anesthesia", "Surgery", "Internal Medicine", "Advanced Practice Providers"];

const progressCategories = [
  { name: "Walkthrough Complete", color: "hsl(217, 91%, 60%)" },
  { name: "Verification Done", color: "hsl(210, 78%, 46%)" },
  { name: "In Progress", color: "hsl(199, 89%, 48%)" },
  { name: "Not Started", color: "hsl(214, 32%, 78%)" },
];

const SummaryCards = ({ activeUnit, onUnitChange, activeStatus, onStatusChange }: SummaryCardsProps) => {
  const { totalStudents, activeToday, completedPercent, licensesUsed, licensesTotal } = summaryStats;

  const needsPracticeCount = students.filter((s) => s.needsPractice).length;
  const overdueOrCloseCount = students.filter((s) => s.daysRemaining <= 3).length;
  const needAttentionTotal = new Set([
    ...students.filter((s) => s.needsPractice).map((s) => s.id),
    ...students.filter((s) => s.daysRemaining <= 3).map((s) => s.id),
  ]).size;

  // Count overdue students per category
  const getOverdueCount = (categoryName: string) => {
    let categoryStudents = students;
    if (categoryName === "Walkthrough Complete") {
      categoryStudents = students.filter((s) => s.walkthroughComplete === 100);
    } else if (categoryName === "Verification Done") {
      categoryStudents = students.filter((s) => s.verificationStatus === "Verified");
    } else if (categoryName === "In Progress") {
      categoryStudents = students.filter((s) => s.verificationStatus === "In Progress" && s.walkthroughComplete < 100);
    } else if (categoryName === "Not Started") {
      categoryStudents = students.filter((s) => s.verificationStatus === "Not Started");
    }
    return categoryStudents.filter((s) => s.daysRemaining <= 3).length;
  };

  const progressData = [
    { name: "Walkthrough Complete", value: 45 },
    { name: "Verification Done", value: 18 },
    { name: "In Progress", value: 25 },
    { name: "Not Started", value: 12 },
  ];

  const handleStatusClick = (name: string) => {
    if (onStatusChange) {
      onStatusChange(activeStatus === name ? "" : name);
    }
  };

  const handleOverdueClick = (e: React.MouseEvent, name: string) => {
    e.stopPropagation();
    if (onStatusChange) {
      const overdueFilter = `${name}:overdue`;
      onStatusChange(activeStatus === overdueFilter ? "" : overdueFilter);
    }
  };

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

      {/* Cards - 3 column layout with larger cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Total Students Card */}
        <div className="rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-info/10 text-info">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold leading-tight text-foreground">{totalStudents}</p>
            </div>
          </div>
          <div className="space-y-1.5 border-t pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Active today</span>
              <span className="font-semibold text-foreground">{activeToday}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Course completed</span>
              <span className="font-semibold text-success">{completedPercent}% ({summaryStats.completedCourse})</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg. score</span>
              <span className="font-semibold text-foreground">74 <span className="text-success text-[10px]">↑ 3pts</span></span>
            </div>
          </div>
        </div>

        {/* Training Progress Card - replaces Course Completed */}
        <div className="rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Training Progress</p>
            {activeStatus && onStatusChange && (
              <button onClick={() => onStatusChange("")} className="text-[10px] text-destructive hover:underline font-medium">
                Clear filter
              </button>
            )}
          </div>
          <div className="space-y-3">
            {progressData.map((item, idx) => {
              const cat = progressCategories[idx];
              const overdueCount = getOverdueCount(item.name);
              const isActive = activeStatus === item.name || activeStatus === `${item.name}:overdue`;
              const isDimmed = activeStatus && !isActive;

              return (
                <div
                  key={item.name}
                  className={`cursor-pointer transition-opacity rounded-lg px-2 py-1.5 -mx-2 hover:bg-muted/50 ${isDimmed ? "opacity-30" : ""}`}
                  onClick={() => handleStatusClick(item.name)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-foreground">{item.name}</span>
                    <span className="text-[11px] font-bold text-foreground">{item.value}%</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {/* Progress bar */}
                    <div className="relative h-3 flex-1 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.value}%`, backgroundColor: cat.color }}
                      />
                      <div
                        className="absolute top-0 h-full rounded-r-full"
                        style={{
                          left: `${item.value}%`,
                          width: `${100 - item.value}%`,
                          backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 3px, hsl(214, 20%, 85%) 3px, hsl(214, 20%, 85%) 4px)`,
                        }}
                      />
                    </div>
                    {/* Overdue indicator */}
                    {overdueCount > 0 && (
                      <button
                        onClick={(e) => handleOverdueClick(e, item.name)}
                        className={`flex items-center gap-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold transition-all ${
                          activeStatus === `${item.name}:overdue`
                            ? "bg-destructive text-white ring-2 ring-destructive/30"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }`}
                        title={`${overdueCount} overdue/close to deadline — click to filter`}
                      >
                        {overdueCount} ⚠
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Need Attention + Licenses Combined */}
        <div className="rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Need Attention</p>
              <p className="text-3xl font-bold leading-tight text-foreground">{needAttentionTotal}</p>
            </div>
          </div>
          <div className="space-y-1.5 border-t pt-3">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Need more practice</span>
              <span className="font-semibold text-destructive">{needsPracticeCount}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Overdue / close to due</span>
              <span className="font-semibold text-destructive">{overdueOrCloseCount}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <KeyRound className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Licenses</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-foreground">{licensesUsed}/{licensesTotal}</p>
                  <span className="text-[10px] text-muted-foreground">{licensesTotal - licensesUsed} remaining</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${(licensesUsed / licensesTotal) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
