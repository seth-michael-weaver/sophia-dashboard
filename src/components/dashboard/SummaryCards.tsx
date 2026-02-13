import { useState } from "react";
import { Users, AlertTriangle, KeyRound, ShoppingCart, Upload, Sparkles } from "lucide-react";
import { summaryStats, students, errorTypes } from "@/data/mockData";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import BatchUploadModal from "./BatchUploadModal";

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

const studentErrors: Record<string, string[]> = {
  "2": ["Arterial Puncture", "Through-and-Through", "Excessive Cannulation Attempts"],
  "3": ["Guidewire Misplacement", "Prolonged Arrhythmia"],
  "6": ["Arterial Puncture", "Failed Cannulation Attempts", "Through-and-Through"],
  "8": ["Excessive Cannulation Attempts", "Guidewire Misplacement"],
  "10": ["Arterial Puncture", "Prolonged Arrhythmia", "Failed Cannulation Attempts"],
  "12": ["Through-and-Through", "Guidewire Misplacement"],
};

const SummaryCards = ({ activeUnit, onUnitChange, activeStatus, onStatusChange }: SummaryCardsProps) => {
  const [batchOpen, setBatchOpen] = useState(false);
  const { licensesUsed, licensesTotal } = summaryStats;
  const usagePercent = Math.round((licensesUsed / licensesTotal) * 100);

  const unitStudents = activeUnit === "All" ? students : students.filter((s) => s.unit === activeUnit);
  const totalStudents = unitStudents.length;
  const activeToday = unitStudents.filter((s) => s.lastActivity.includes("hr")).length;
  const completedCount = unitStudents.filter((s) => s.walkthroughComplete === 100 && s.verificationStatus === "Verified").length;
  const completedPercent = totalStudents > 0 ? Math.round((completedCount / totalStudents) * 100) : 0;

  const needsPracticeCount = unitStudents.filter((s) => s.needsPractice).length;
  const overdueOrCloseCount = unitStudents.filter((s) => s.daysRemaining <= 3).length;
  const needAttentionTotal = new Set([
    ...unitStudents.filter((s) => s.needsPractice).map((s) => s.id),
    ...unitStudents.filter((s) => s.daysRemaining <= 3).map((s) => s.id),
  ]).size;

  const topErrors = Object.entries(
    unitStudents.reduce<Record<string, number>>((acc, s) => {
      (studentErrors[s.id] || []).forEach((err) => { acc[err] = (acc[err] || 0) + 1; });
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]).slice(0, 3);

  const walkthroughDone = unitStudents.filter((s) => s.walkthroughComplete === 100).length;
  const verificationDone = unitStudents.filter((s) => s.verificationStatus === "Verified").length;
  const inProgress = unitStudents.filter((s) => s.verificationStatus === "In Progress" && s.walkthroughComplete < 100).length;
  const notStarted = unitStudents.filter((s) => s.verificationStatus === "Not Started").length;

  const progressData = [
    { name: "Walkthrough Complete", value: totalStudents > 0 ? Math.round((walkthroughDone / totalStudents) * 100) : 0, count: walkthroughDone },
    { name: "Verification Done", value: totalStudents > 0 ? Math.round((verificationDone / totalStudents) * 100) : 0, count: verificationDone },
    { name: "In Progress", value: totalStudents > 0 ? Math.round((inProgress / totalStudents) * 100) : 0, count: inProgress },
    { name: "Not Started", value: totalStudents > 0 ? Math.round((notStarted / totalStudents) * 100) : 0, count: notStarted },
  ];

  const getOverdueStudents = (categoryName: string) => {
    let categoryStudents = unitStudents;
    if (categoryName === "Walkthrough Complete") categoryStudents = unitStudents.filter((s) => s.walkthroughComplete === 100);
    else if (categoryName === "Verification Done") categoryStudents = unitStudents.filter((s) => s.verificationStatus === "Verified");
    else if (categoryName === "In Progress") categoryStudents = unitStudents.filter((s) => s.verificationStatus === "In Progress" && s.walkthroughComplete < 100);
    else if (categoryName === "Not Started") categoryStudents = unitStudents.filter((s) => s.verificationStatus === "Not Started");
    return categoryStudents.filter((s) => s.daysRemaining <= 3);
  };

  const handleStatusClick = (name: string) => {
    if (onStatusChange) onStatusChange(activeStatus === name ? "" : name);
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Total Students Card + Top Errors */}
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
              <span className="font-semibold text-success">{completedPercent}% ({completedCount})</span>
            </div>
          </div>
          {topErrors.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-2">Top Errors</p>
              <div className="space-y-1.5">
                {topErrors.map(([name, count]) => {
                  const errType = errorTypes.find((e) => e.name === name);
                  return (
                    <div key={name} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground truncate mr-2">{name}</span>
                      <span className={`font-semibold ${errType?.severity === "critical" ? "text-destructive" : "text-warning"}`}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Training Progress + Need Attention */}
        <div className="rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Training Progress</p>
            {activeStatus && onStatusChange && (
              <button onClick={() => onStatusChange("")} className="text-[10px] text-destructive hover:underline font-medium">Clear filter</button>
            )}
          </div>
          <div className="space-y-3">
            {progressData.map((item, idx) => {
              const cat = progressCategories[idx];
              const overdueStudents = getOverdueStudents(item.name);
              const overdueCount = overdueStudents.length;
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
                    <span className="text-[11px] font-bold text-foreground">{item.value}% ({item.count})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="relative h-3 flex-1 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.value}%`, backgroundColor: cat.color }} />
                      <div className="absolute top-0 h-full rounded-r-full" style={{ left: `${item.value}%`, width: `${100 - item.value}%`, backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 3px, hsl(214, 20%, 85%) 3px, hsl(214, 20%, 85%) 4px)` }} />
                    </div>
                    {overdueCount > 0 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className={`flex items-center gap-0.5 shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold transition-all ${
                              activeStatus === `${item.name}:overdue` ? "bg-destructive text-white ring-2 ring-destructive/30" : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                            }`}
                          >
                            {overdueCount} ⚠
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" side="right" align="start">
                          <p className="text-xs font-semibold text-foreground mb-2">{overdueCount} overdue / close to deadline</p>
                          <div className="space-y-1.5 mb-3">
                            {overdueStudents.map((s) => (
                              <div key={s.id} className="flex items-center justify-between text-xs">
                                <span className="text-foreground">{s.name}</span>
                                <span className={`font-semibold ${s.daysRemaining < 0 ? "text-destructive" : "text-warning"}`}>{s.daysRemaining < 0 ? "Overdue" : `${s.daysRemaining}d left`}</span>
                              </div>
                            ))}
                          </div>
                          <button onClick={(e) => handleOverdueClick(e, item.name)} className="text-[11px] font-medium text-primary hover:underline">Filter table to these students →</button>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Need Attention section at bottom */}
          <div className="mt-4 pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span className="text-xs font-semibold text-foreground">Need Attention: {needAttentionTotal}</span>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Need more practice</span>
                <span className="font-semibold text-destructive">{needsPracticeCount}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Overdue / close to due</span>
                <span className="font-semibold text-destructive">{overdueOrCloseCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Licenses & Practice */}
        <div className="rounded-xl bg-card p-5 shadow-card transition-shadow hover:shadow-card-hover animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-warning/10 text-warning">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Licenses & Practice</p>
              <p className="text-3xl font-bold leading-tight text-foreground">{licensesUsed}<span className="text-lg text-muted-foreground font-normal">/{licensesTotal}</span></p>
            </div>
          </div>

          <div className="mb-3">
            <div className="h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${usagePercent}%`,
                  background: usagePercent > 85 ? "hsl(0, 65%, 48%)" : usagePercent > 65 ? "hsl(38, 92%, 50%)" : "hsl(217, 91%, 60%)",
                }}
              />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">
              {usagePercent > 85 ? "⚠ Running low on licenses" : `${licensesTotal - licensesUsed} licenses available`}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Button className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none" variant="outline" size="sm">
              <ShoppingCart className="h-3.5 w-3.5" />
              Purchase Licenses
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" size="sm" onClick={() => setBatchOpen(true)}>
              <Upload className="h-3.5 w-3.5" />
              Batch Upload Trainees
            </Button>
            <Button className="w-full justify-start gap-2" variant="outline" size="sm">
              <Sparkles className="h-3.5 w-3.5" />
              Assign Practice
            </Button>
          </div>
        </div>
      </div>

      <BatchUploadModal open={batchOpen} onClose={() => setBatchOpen(false)} />
    </div>
  );
};

export default SummaryCards;
