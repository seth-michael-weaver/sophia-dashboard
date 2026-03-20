import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, UserPlus } from "lucide-react";
import { useRegisterTrainee } from "@/hooks/useTrainees";
import { useActivityFeed } from "@/hooks/useDashboard";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import SummaryCards from "@/components/dashboard/SummaryCards";
import StudentTable from "@/components/dashboard/StudentTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const departments = ["Surgery", "Anesthesia", "Internal Medicine", "Emergency Medicine", "Critical Care", "Pediatrics", "Advanced Practice Providers"];

const Dashboard = () => {
  const [activeUnit, setActiveUnit] = useState("All");
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [unit, setUnit] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [modules, setModules] = useState<string[]>([]);

  const registerTrainee = useRegisterTrainee();
  const { data: activities } = useActivityFeed(4);

  const handleAddStudent = () => {
    registerTrainee.mutate(
      { first_name: firstName, last_name: lastName, email, unit, deadline: dueDate || undefined },
      { onSuccess: () => { setAddStudentOpen(false); setFirstName(""); setLastName(""); setEmail(""); setUnit(""); setDueDate(""); setModules([]); } }
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <WelcomeBanner />

      <SummaryCards activeUnit={activeUnit} onUnitChange={setActiveUnit} />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Students Needing Attention</h3>
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setAddStudentOpen(true)}>
          <UserPlus className="h-3.5 w-3.5" /> Add Student
        </Button>
      </div>

      <StudentTable activeUnit={activeUnit} dashboardMode />

      <div className="flex justify-end">
        <Link to="/students" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View all student progress <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
        <h3 className="text-sm font-semibold text-foreground mb-1">Recent Activity</h3>
        <p className="text-xs text-muted-foreground mb-4">Latest training events</p>
        <div className="space-y-3">
          {(activities || []).map((item, i) => (
            <div key={i} className="flex items-start gap-3 group cursor-pointer">
              <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${item.type === "success" ? "bg-success" : item.type === "error" ? "bg-destructive" : "bg-primary"}`} />
              <div className="min-w-0">
                <p className="text-xs text-foreground group-hover:text-primary transition-colors">{item.description}</p>
                <p className="text-[10px] text-muted-foreground">{item.trainee}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Student Modal */}
      <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /> Add Individual Student</DialogTitle>
            <DialogDescription>Add a new student to the training program.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-foreground mb-1 block">First Name</label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="text-sm" /></div>
              <div><label className="text-xs font-semibold text-foreground mb-1 block">Last Name</label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="text-sm" /></div>
            </div>
            <div><label className="text-xs font-semibold text-foreground mb-1 block">Email</label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Unit</label>
                <Select value={unit} onValueChange={setUnit}><SelectTrigger className="text-sm"><SelectValue placeholder="Select unit" /></SelectTrigger><SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
              </div>
              <div><label className="text-xs font-semibold text-foreground mb-1 block">Due Date</label><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="text-sm" /></div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">Assign Modules</label>
              <div className="space-y-2">
                {[{ id: "walkthrough", label: "Walkthrough Training" }, { id: "patient-cases", label: "Patient Cases (17)" }, { id: "verification", label: "Verification of Proficiency" }].map((mod) => (
                  <label key={mod.id} className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox checked={modules.includes(mod.id)} onCheckedChange={() => setModules((prev) => prev.includes(mod.id) ? prev.filter((m) => m !== mod.id) : [...prev, mod.id])} />
                    <span className="text-xs font-medium text-foreground">{mod.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={handleAddStudent} disabled={!firstName || !lastName || !email || !unit}><UserPlus className="h-4 w-4 mr-1" /> Add Student</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
