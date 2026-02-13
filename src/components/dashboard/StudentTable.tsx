import { useState } from "react";
import { students, type Student, errorTypes } from "@/data/mockData";
import { MoreHorizontal, Flag, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentDetailModal from "./StudentDetailModal";

const getDeadlineBadge = (days: number) => {
  if (days < 0) return { text: "Overdue", className: "bg-destructive/10 text-destructive" };
  if (days <= 3) return { text: `${days}d left`, className: "bg-destructive/10 text-destructive" };
  if (days <= 7) return { text: `${days}d left`, className: "bg-warning/10 text-warning" };
  return { text: `${days}d left`, className: "bg-success/10 text-success" };
};

const getVerificationBadge = (status: Student["verificationStatus"]) => {
  switch (status) {
    case "Verified":
      return "bg-success/10 text-success";
    case "In Progress":
      return "bg-info/10 text-info";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// Mock mapping of students to errors for filtering
const studentErrors: Record<string, string[]> = {
  "2": ["Arterial Puncture", "Through-and-Through", "Excessive Cannulation Attempts"],
  "3": ["Guidewire Misplacement", "Prolonged Arrhythmia"],
  "6": ["Arterial Puncture", "Failed Cannulation Attempts", "Through-and-Through"],
  "8": ["Excessive Cannulation Attempts", "Guidewire Misplacement"],
  "10": ["Arterial Puncture", "Prolonged Arrhythmia", "Failed Cannulation Attempts"],
  "12": ["Through-and-Through", "Guidewire Misplacement"],
};

interface StudentTableProps {
  activeUnit: string;
  activeStatus?: string;
  activeError?: string;
  dashboardMode?: boolean;
}

const StudentTable = ({ activeUnit, activeStatus, activeError, dashboardMode }: StudentTableProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  let filtered = activeUnit === "All"
    ? students
    : students.filter((s) => s.unit === activeUnit);

  // Filter by progress chart status
  if (activeStatus) {
    if (activeStatus === "Walkthrough Complete") {
      filtered = filtered.filter((s) => s.walkthroughComplete === 100);
    } else if (activeStatus === "Verification Done") {
      filtered = filtered.filter((s) => s.verificationStatus === "Verified");
    } else if (activeStatus === "In Progress") {
      filtered = filtered.filter((s) => s.verificationStatus === "In Progress" && s.walkthroughComplete < 100);
    } else if (activeStatus === "Not Started") {
      filtered = filtered.filter((s) => s.verificationStatus === "Not Started");
    }
  }

  // Filter by error type
  if (activeError) {
    filtered = filtered.filter((s) => studentErrors[s.id]?.includes(activeError));
  }

  // Dashboard mode: only show students who need attention
  if (dashboardMode) {
    filtered = filtered.filter((s) => s.needsPractice || s.daysRemaining <= 3);
  }

  return (
    <>
      <div className="rounded-xl bg-card shadow-card animate-fade-in overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {dashboardMode ? "Students Needing Attention" : "Student Progress"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {filtered.length} students
              {activeStatus && <span className="ml-1 text-primary font-medium">· Status: {activeStatus}</span>}
              {activeError && <span className="ml-1 text-destructive font-medium">· Error: {activeError}</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <ArrowUpDown className="h-3 w-3" /> Sort
            </Button>
            <Button size="sm" className="text-xs">
              Assign Practice
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b bg-muted/50">
                <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Unit</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Walkthrough</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Verification</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Score</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Deadline</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Errors</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => {
                const deadline = getDeadlineBadge(student.daysRemaining);
                const errors = studentErrors[student.id] || [];
                return (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className={`border-b transition-colors hover:bg-muted/30 cursor-pointer ${
                      student.needsPractice ? "bg-destructive/[0.02]" : ""
                    }`}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {student.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-foreground text-[13px] hover:text-primary transition-colors">{student.name}</p>
                          <p className="text-[11px] text-muted-foreground">{student.lastActivity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs text-muted-foreground">{student.unit}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${student.walkthroughComplete}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground">{student.walkthroughComplete}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getVerificationBadge(student.verificationStatus)}`}>
                        {student.verificationStatus}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-sm font-semibold ${
                        student.latestScore >= 80
                          ? "text-success"
                          : student.latestScore >= 60
                          ? "text-warning"
                          : "text-destructive"
                      }`}>
                        {student.latestScore}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${deadline.className}`}>
                        {deadline.text}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {errors.length > 0 ? (
                        <span className="text-[10px] font-semibold text-destructive">{errors.length} errors</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {student.needsPractice && (
                        <div className="flex items-center gap-1 text-destructive">
                          <Flag className="h-3 w-3 fill-current" />
                          <span className="text-[10px] font-semibold">Needs Practice</span>
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No students match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <StudentDetailModal
        student={selectedStudent}
        open={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </>
  );
};

export default StudentTable;
