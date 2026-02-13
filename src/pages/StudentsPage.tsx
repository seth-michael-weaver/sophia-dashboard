import { useState } from "react";
import { students, type Student } from "@/data/mockData";
import { MoreHorizontal, Flag, Search, Send, ArrowUpDown, Plus, Users, CheckCircle, AlertTriangle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import StudentDetailModal from "@/components/dashboard/StudentDetailModal";

const units = ["All", "Anesthesia", "Surgery", "Internal Medicine", "Advanced Practice Providers"];

const studentErrors: Record<string, string[]> = {
  "2": ["Arterial Puncture", "Through-and-Through", "Excessive Cannulation Attempts"],
  "3": ["Guidewire Misplacement", "Prolonged Arrhythmia"],
  "6": ["Arterial Puncture", "Failed Cannulation Attempts", "Through-and-Through"],
  "8": ["Excessive Cannulation Attempts", "Guidewire Misplacement"],
  "10": ["Arterial Puncture", "Prolonged Arrhythmia", "Failed Cannulation Attempts"],
  "12": ["Through-and-Through", "Guidewire Misplacement"],
};

type SortKey = "name" | "unit" | "deadline" | "walkthrough" | "verification" | "errors" | "status";
type SortDir = "asc" | "desc";

const getDeadlineBadge = (days: number) => {
  if (days < 0) return { text: "Overdue", className: "bg-destructive/10 text-destructive" };
  if (days <= 3) return { text: `${days}d left`, className: "bg-destructive/10 text-destructive" };
  if (days <= 7) return { text: `${days}d left`, className: "bg-warning/10 text-warning" };
  return { text: `${days}d left`, className: "bg-success/10 text-success" };
};

const getVerificationBadge = (status: Student["verificationStatus"]) => {
  switch (status) {
    case "Verified": return "bg-success/10 text-success";
    case "In Progress": return "bg-info/10 text-info";
    default: return "bg-muted text-muted-foreground";
  }
};

const StudentsPage = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchName, setSearchName] = useState("");
  const [filterUnit, setFilterUnit] = useState("All");
  const [filterWalkthrough, setFilterWalkthrough] = useState("All");
  const [filterVerification, setFilterVerification] = useState("All");
  const [filterDeadline, setFilterDeadline] = useState("All");
  const [filterErrors, setFilterErrors] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [messageStudent, setMessageStudent] = useState<Student | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [addModuleStudent, setAddModuleStudent] = useState<Student | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  let filtered = [...students];

  if (searchName) {
    const q = searchName.toLowerCase();
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(q));
  }
  if (filterUnit !== "All") filtered = filtered.filter((s) => s.unit === filterUnit);
  if (filterWalkthrough === "Complete") filtered = filtered.filter((s) => s.walkthroughComplete === 100);
  else if (filterWalkthrough === "In Progress") filtered = filtered.filter((s) => s.walkthroughComplete > 0 && s.walkthroughComplete < 100);
  else if (filterWalkthrough === "Not Started") filtered = filtered.filter((s) => s.walkthroughComplete === 0);
  if (filterVerification !== "All") filtered = filtered.filter((s) => s.verificationStatus === filterVerification);
  if (filterDeadline === "Overdue") filtered = filtered.filter((s) => s.daysRemaining < 0);
  else if (filterDeadline === "Due Soon") filtered = filtered.filter((s) => s.daysRemaining >= 0 && s.daysRemaining <= 3);
  else if (filterDeadline === "On Track") filtered = filtered.filter((s) => s.daysRemaining > 3);
  if (filterErrors === "Has Errors") filtered = filtered.filter((s) => (studentErrors[s.id]?.length || 0) > 0);
  else if (filterErrors === "No Errors") filtered = filtered.filter((s) => !studentErrors[s.id]?.length);
  if (filterStatus === "Needs Practice") filtered = filtered.filter((s) => s.needsPractice);
  else if (filterStatus === "On Track") filtered = filtered.filter((s) => !s.needsPractice);

  // Sort
  filtered.sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "name": cmp = a.name.localeCompare(b.name); break;
      case "unit": cmp = a.unit.localeCompare(b.unit); break;
      case "deadline": cmp = a.daysRemaining - b.daysRemaining; break;
      case "walkthrough": cmp = a.walkthroughComplete - b.walkthroughComplete; break;
      case "verification": cmp = a.verificationStatus.localeCompare(b.verificationStatus); break;
      case "errors": cmp = (studentErrors[a.id]?.length || 0) - (studentErrors[b.id]?.length || 0); break;
      case "status": cmp = (a.needsPractice ? 0 : 1) - (b.needsPractice ? 0 : 1); break;
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  // Summary stats
  const totalCount = students.length;
  const completedCount = students.filter((s) => s.walkthroughComplete === 100 && s.verificationStatus === "Verified").length;
  const needsPracticeCount = students.filter((s) => s.needsPractice).length;
  const avgProgress = Math.round(students.reduce((s, st) => s + st.walkthroughComplete, 0) / students.length);

  const handleSendMessage = () => {
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
      setMessageText("");
      setMessageStudent(null);
    }, 2000);
  };

  const handleAddModule = (type: string) => {
    setAddModuleStudent(null);
  };

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? "text-primary" : "text-muted-foreground/40"}`} />
      </div>
    </th>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Students & Analytics</h2>
        <p className="text-sm text-muted-foreground">Full student list with training analytics</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-card p-4 shadow-card text-center">
          <Users className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{totalCount}</p>
          <p className="text-[10px] text-muted-foreground">Total Students</p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card text-center">
          <CheckCircle className="h-4 w-4 text-success mx-auto mb-1" />
          <p className="text-2xl font-bold text-success">{completedCount}</p>
          <p className="text-[10px] text-muted-foreground">Completed</p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card text-center">
          <AlertTriangle className="h-4 w-4 text-destructive mx-auto mb-1" />
          <p className="text-2xl font-bold text-destructive">{needsPracticeCount}</p>
          <p className="text-[10px] text-muted-foreground">Need Practice</p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card text-center">
          <BookOpen className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-2xl font-bold text-foreground">{avgProgress}%</p>
          <p className="text-[10px] text-muted-foreground">Avg Progress</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-card p-4 shadow-card space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by last name…" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>
          <Select value={filterUnit} onValueChange={setFilterUnit}>
            <SelectTrigger className="w-[160px] h-9 text-xs"><SelectValue placeholder="Unit" /></SelectTrigger>
            <SelectContent>{units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={filterDeadline} onValueChange={setFilterDeadline}>
            <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Deadline" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Deadlines</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Due Soon">Due Soon</SelectItem>
              <SelectItem value="On Track">On Track</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterWalkthrough} onValueChange={setFilterWalkthrough}>
            <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Walkthrough" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Walkthrough</SelectItem>
              <SelectItem value="Complete">Complete</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterVerification} onValueChange={setFilterVerification}>
            <SelectTrigger className="w-[150px] h-9 text-xs"><SelectValue placeholder="Verification" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Verification</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterErrors} onValueChange={setFilterErrors}>
            <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Errors" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Errors</SelectItem>
              <SelectItem value="Has Errors">Has Errors</SelectItem>
              <SelectItem value="No Errors">No Errors</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] h-9 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Needs Practice">Needs Practice</SelectItem>
              <SelectItem value="On Track">On Track</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-[11px] text-muted-foreground">{filtered.length} students</p>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <SortHeader label="Student" field="name" />
                <SortHeader label="Unit" field="unit" />
                <SortHeader label="Deadline" field="deadline" />
                <SortHeader label="Walkthrough" field="walkthrough" />
                <SortHeader label="Verification" field="verification" />
                <SortHeader label="Errors" field="errors" />
                <SortHeader label="Status" field="status" />
                <th className="px-3 py-2.5 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
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
                    className={`border-b transition-colors hover:bg-muted/30 cursor-pointer ${student.needsPractice ? "bg-destructive/[0.02]" : ""}`}
                  >
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{student.avatar}</div>
                        <div>
                          <p className="font-medium text-foreground text-[13px]">{student.name}</p>
                          <p className="text-[11px] text-muted-foreground">{student.lastActivity}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3"><span className="text-xs text-muted-foreground">{student.unit}</span></td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${deadline.className}`}>{deadline.text}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${student.walkthroughComplete}%` }} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{student.walkthroughComplete}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${getVerificationBadge(student.verificationStatus)}`}>{student.verificationStatus}</span>
                    </td>
                    <td className="px-3 py-3">
                      {errors.length > 0 ? (
                        <span className="text-[10px] font-semibold text-destructive">{errors.length} errors</span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">None</span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      {student.needsPractice ? (
                        <div className="flex items-center gap-1 text-destructive">
                          <Flag className="h-3 w-3 fill-current" />
                          <span className="text-[10px] font-semibold">Needs Practice</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-success font-medium">On Track</span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-primary hover:text-primary"
                          title="Send reminder"
                          onClick={() => setMessageStudent(student)}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setAddModuleStudent(student)}>
                              <Plus className="h-3.5 w-3.5 mr-2" /> Add Module
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setMessageStudent(student)}>
                              <Send className="h-3.5 w-3.5 mr-2" /> Send Message
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-muted-foreground">No students match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
        <h3 className="text-sm font-semibold text-foreground mb-1">Recent Activity</h3>
        <p className="text-xs text-muted-foreground mb-4">Latest training events</p>
        <div className="space-y-3">
          {[
            { text: "James Rodriguez flagged: 3+ arterial puncture errors", time: "5 hrs ago", type: "error" },
            { text: "Tom Bradley deadline overdue — Module 1 incomplete", time: "1 day ago", type: "error" },
            { text: "Emily Thompson started Module 2: Ultrasound Guidance", time: "1 day ago", type: "info" },
            { text: "Sarah Chen completed Verification of Proficiency", time: "2 hrs ago", type: "success" },
            { text: "Aisha Patel scored 76 on Subclavian Access simulation", time: "12 hrs ago", type: "info" },
            { text: "Batch upload: 12 new students added to Surgery", time: "2 days ago", type: "info" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 group cursor-pointer">
              <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${item.type === "success" ? "bg-success" : item.type === "error" ? "bg-destructive" : "bg-primary"}`} />
              <div className="min-w-0">
                <p className="text-xs text-foreground group-hover:text-primary transition-colors">{item.text}</p>
                <p className="text-[10px] text-muted-foreground">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StudentDetailModal student={selectedStudent} open={!!selectedStudent} onClose={() => setSelectedStudent(null)} />

      {/* Send Message Modal */}
      <Dialog open={!!messageStudent} onOpenChange={() => setMessageStudent(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-4 w-4 text-primary" />
              Send Reminder
            </DialogTitle>
            <DialogDescription>Send a message to {messageStudent?.name}</DialogDescription>
          </DialogHeader>
          {messageSent ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <CheckCircle className="h-10 w-10 text-success" />
              <p className="text-sm font-semibold">Message sent!</p>
            </div>
          ) : (
            <div className="space-y-3 mt-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-[10px] flex-1" onClick={() => { setMessageText("Please complete your training course before the deadline."); }}>📋 Complete Course</Button>
                <Button variant="outline" size="sm" className="text-[10px] flex-1" onClick={() => { setMessageText("You have been assigned additional practice. Please review."); }}>🔄 Additional Practice</Button>
              </div>
              <Textarea placeholder="Custom message…" value={messageText} onChange={(e) => setMessageText(e.target.value)} className="text-xs min-h-[80px]" />
              <Button className="w-full" size="sm" onClick={handleSendMessage} disabled={!messageText.trim()}>
                <Send className="h-3.5 w-3.5 mr-1.5" /> Send Message
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Module Modal */}
      <Dialog open={!!addModuleStudent} onOpenChange={() => setAddModuleStudent(null)}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              Add Module for {addModuleStudent?.name}
            </DialogTitle>
            <DialogDescription>Assign additional training if there was an error on upload.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 mt-2">
            {[
              { id: "walkthrough", label: "Walkthrough Training", icon: "📖" },
              { id: "patient-cases", label: "Patient Cases", icon: "🏥" },
              { id: "verification", label: "Verification of Proficiency", icon: "✅" },
            ].map((mod) => (
              <Button
                key={mod.id}
                variant="outline"
                className="w-full justify-start gap-2 text-sm"
                onClick={() => handleAddModule(mod.id)}
              >
                <span>{mod.icon}</span> {mod.label}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentsPage;
