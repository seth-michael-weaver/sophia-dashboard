import { useState } from "react";
import { students, summaryStats } from "@/data/mockData";
import { KeyRound, ShoppingCart, Upload, Plus, Trash2, Shield, UserCog, ArrowUpDown, UserPlus, Settings2, Users, Edit2, Save, CheckCircle, X, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PurchaseLicensesModal from "@/components/dashboard/PurchaseLicensesModal";

const licensePurchased: Record<string, string> = {
  "1": "2025-06-15", "2": "2025-05-20", "3": "2025-04-10", "4": "2025-08-01",
  "5": "2025-07-22", "6": "2025-03-15", "7": "2025-09-30", "8": "2025-04-05",
  "9": "2025-06-28", "10": "2025-03-01", "11": "2025-07-14", "12": "2025-05-18",
};

const getAnnualExpiry = (purchaseDate: string) => {
  const d = new Date(purchaseDate);
  d.setFullYear(d.getFullYear() + 1);
  return d.toISOString().split("T")[0];
};

const getExpiryBadge = (date: string) => {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 30) return { text: `${days}d`, className: "bg-destructive/10 text-destructive" };
  if (days < 90) return { text: `${days}d`, className: "bg-warning/10 text-warning" };
  return { text: `${days}d`, className: "bg-success/10 text-success" };
};

const defaultDepartments = [
  "Surgery", "Anesthesia", "Internal Medicine", "Emergency Medicine",
  "Critical Care", "Pediatrics", "Advanced Practice Providers",
];

interface Coordinator {
  id: string;
  name: string;
  email: string;
  assignedAreas: string[];
}

const initialCoordinators: Coordinator[] = [
  { id: "1", name: "Dr. Sarah Miller", email: "s.miller@mercygeneral.edu", assignedAreas: ["Anesthesia", "Surgery"] },
  { id: "2", name: "Dr. John Adams", email: "j.adams@mercygeneral.edu", assignedAreas: ["Surgery", "Emergency Medicine"] },
  { id: "3", name: "Nancy Drew, RN", email: "n.drew@mercygeneral.edu", assignedAreas: ["Internal Medicine", "Critical Care"] },
];

// Coordinator edit state type
interface CoordEditState {
  id: string;
  name: string;
  email: string;
}

type LicenseSortKey = "name" | "unit" | "purchased" | "expires" | "timeLeft" | "email" | "dueDate";
type SortDir = "asc" | "desc";

const LicensesAccessPage = () => {
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [manageDepts, setManageDepts] = useState(false);
  const [departments, setDepartments] = useState(defaultDepartments);
  const [newDept, setNewDept] = useState("");
  const [coordinators, setCoordinators] = useState<Coordinator[]>(initialCoordinators);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAreas, setNewAreas] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const { licensesUsed, licensesTotal } = summaryStats;
  const usagePercent = Math.round((licensesUsed / licensesTotal) * 100);

  // New Training Cohort
  const [cohortOpen, setCohortOpen] = useState(false);
  const [cohortName, setCohortName] = useState("");
  const [cohortDueDate, setCohortDueDate] = useState("");
  const [cohortTab, setCohortTab] = useState<"batch" | "individual">("batch");

  // Individual student
  const [indFirstName, setIndFirstName] = useState("");
  const [indLastName, setIndLastName] = useState("");
  const [indEmail, setIndEmail] = useState("");
  const [indUnit, setIndUnit] = useState("");
  const [indDueDate, setIndDueDate] = useState("");
  const [indModules, setIndModules] = useState<string[]>([]);

  // Student edit modal
  const [editStudent, setEditStudent] = useState<typeof students[0] | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editModules, setEditModules] = useState<string[]>(["walkthrough", "patient-cases", "verification"]);
  const [editSaved, setEditSaved] = useState(false);

  // Coordinator edit modal
  const [editCoord, setEditCoord] = useState<CoordEditState | null>(null);
  const [editCoordSaved, setEditCoordSaved] = useState(false);

  // Bulk actions
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [bulkActionOpen, setBulkActionOpen] = useState(false);
  const [bulkDueDate, setBulkDueDate] = useState("");
  const [bulkUnit, setBulkUnit] = useState("");
  const [bulkSaved, setBulkSaved] = useState(false);

  // CSV upload
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const [licSortKey, setLicSortKey] = useState<LicenseSortKey>("name");
  const [licSortDir, setLicSortDir] = useState<SortDir>("asc");
  const [filterUnit, setFilterUnit] = useState("All");

  const handleLicSort = (key: LicenseSortKey) => {
    if (licSortKey === key) setLicSortDir(licSortDir === "asc" ? "desc" : "asc");
    else { setLicSortKey(key); setLicSortDir("asc"); }
  };

  const toggleArea = (area: string) => setNewAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);

  const toggleCoordArea = (coordId: string, area: string) => {
    setCoordinators((prev) => prev.map((c) => {
      if (c.id !== coordId) return c;
      const areas = c.assignedAreas.includes(area) ? c.assignedAreas.filter((a) => a !== area) : [...c.assignedAreas, area];
      return { ...c, assignedAreas: areas };
    }));
  };

  const handleAdd = () => {
    if (newName && newEmail && newAreas.length > 0) {
      setCoordinators((prev) => [...prev, { id: Date.now().toString(), name: newName, email: newEmail, assignedAreas: [...newAreas] }]);
      setNewName(""); setNewEmail(""); setNewAreas([]); setShowAdd(false);
    }
  };

  const handleAddDept = () => {
    if (newDept.trim() && !departments.includes(newDept.trim())) {
      setDepartments((prev) => [...prev, newDept.trim()]);
      setNewDept("");
    }
  };

  const handleAddIndividualStudent = () => {
    setAddStudentOpen(false);
    setIndFirstName(""); setIndLastName(""); setIndEmail(""); setIndUnit(""); setIndDueDate(""); setIndModules([]);
  };

  const openStudentEdit = (student: typeof students[0]) => {
    const nameParts = student.name.split(" ");
    setEditStudent(student);
    setEditFirstName(nameParts[0] || "");
    setEditLastName(nameParts.slice(1).join(" ") || "");
    setEditEmail(`${student.name.toLowerCase().replace(" ", ".")}@mercygeneral.edu`);
    setEditUnit(student.unit);
    setEditDueDate(student.deadline);
    setEditModules(["walkthrough", "patient-cases", "verification"]);
  };

  const openCoordEdit = (coord: Coordinator) => {
    setEditCoord({ id: coord.id, name: coord.name, email: coord.email });
  };

  const handleSaveCoordEdit = () => {
    if (editCoord) {
      setCoordinators((prev) => prev.map((c) => c.id === editCoord.id ? { ...c, name: editCoord.name, email: editCoord.email } : c));
      setEditCoordSaved(true);
      setTimeout(() => { setEditCoordSaved(false); setEditCoord(null); }, 1500);
    }
  };

  const handleSaveStudentEdit = () => {
    setEditSaved(true);
    setTimeout(() => { setEditSaved(false); setEditStudent(null); }, 1500);
  };

  const toggleStudentSelection = (id: string) => {
    setSelectedStudents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkSave = () => {
    setBulkSaved(true);
    setTimeout(() => { setBulkSaved(false); setBulkActionOpen(false); setSelectedStudents(new Set()); }, 1500);
  };

  const downloadTemplate = () => {
    const headers = `First Name,Last Name,Email,Unit (${departments.join("/")}),Training Due Date,Walkthrough (Y/N),Patient Cases (Y/N),Verification of Proficiency (Y/N)`;
    const ex1 = "John,Doe,john.doe@hospital.edu,Surgery,2026-06-01,Y,Y,Y";
    const ex2 = "Jane,Smith,jane.smith@hospital.edu,Anesthesia,2026-07-15,Y,Y,N";
    const notes = `\n# INSTRUCTIONS:\n# - Unit must be one of: ${departments.join(", ")}\n# - Training Due Date format: YYYY-MM-DD\n# - Use Y or N for module assignments`;
    const csv = `${headers}\n${ex1}\n${ex2}\n${notes}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "student_upload_template.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    setUploaded(true);
    setTimeout(() => { setUploaded(false); setFile(null); setCohortOpen(false); }, 2000);
  };

  let sortedStudents = filterUnit === "All" ? [...students] : students.filter((s) => s.unit === filterUnit);
  sortedStudents.sort((a, b) => {
    let cmp = 0;
    const aPurchased = licensePurchased[a.id] || "2025-06-01";
    const bPurchased = licensePurchased[b.id] || "2025-06-01";
    switch (licSortKey) {
      case "name": cmp = a.name.localeCompare(b.name); break;
      case "unit": cmp = a.unit.localeCompare(b.unit); break;
      case "email": cmp = 0; break;
      case "dueDate": cmp = a.deadline.localeCompare(b.deadline); break;
      case "purchased": cmp = aPurchased.localeCompare(bPurchased); break;
      case "expires": cmp = getAnnualExpiry(aPurchased).localeCompare(getAnnualExpiry(bPurchased)); break;
      case "timeLeft": {
        const aDays = Math.ceil((new Date(getAnnualExpiry(aPurchased)).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const bDays = Math.ceil((new Date(getAnnualExpiry(bPurchased)).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        cmp = aDays - bDays; break;
      }
    }
    return licSortDir === "asc" ? cmp : -cmp;
  });

  const LicSortHeader = ({ label, field }: { label: string; field: LicenseSortKey }) => (
    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => handleLicSort(field)}>
      <div className="flex items-center gap-1">{label}<ArrowUpDown className={`h-3 w-3 ${licSortKey === field ? "text-primary" : "text-muted-foreground/40"}`} /></div>
    </th>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Trainees & Assignments</h2>
        <p className="text-sm text-muted-foreground">Manage training cohorts, student assignments, coordinators, and departments</p>
      </div>

      {/* License overview + actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning/10"><KeyRound className="h-5 w-5 text-warning" /></div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">License Usage</p>
              <p className="text-3xl font-bold text-foreground">{licensesUsed}<span className="text-lg text-muted-foreground font-normal">/{licensesTotal}</span></p>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-1">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${usagePercent}%`, background: usagePercent > 85 ? "hsl(0, 65%, 48%)" : "hsl(217, 91%, 60%)" }} />
          </div>
          <p className="text-[10px] text-muted-foreground">{licensesTotal - licensesUsed} licenses available · Annual renewal from purchase</p>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-card lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none" variant="outline" size="sm" onClick={() => setPurchaseOpen(true)}>
              <ShoppingCart className="h-3.5 w-3.5" /> Purchase Licenses
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setCohortOpen(true)}>
              <Users className="h-3.5 w-3.5" /> Start New Training Cohort
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setAddStudentOpen(true)}>
              <UserPlus className="h-3.5 w-3.5" /> Add Individual Student
            </Button>
            {selectedStudents.size > 0 && (
              <Button variant="outline" size="sm" className="gap-2 border-primary text-primary" onClick={() => setBulkActionOpen(true)}>
                <Edit2 className="h-3.5 w-3.5" /> Edit {selectedStudents.size} Selected
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setManageDepts(!manageDepts)}>
              <Settings2 className="h-3.5 w-3.5" /> Manage Departments
            </Button>
          </div>
        </div>
      </div>

      {/* Department Management */}
      {manageDepts && (
        <div className="rounded-xl bg-card p-5 shadow-card space-y-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><Settings2 className="h-4 w-4 text-primary" /> Departments / Specialties</h3>
          <p className="text-xs text-muted-foreground">These departments are used for unit assignment, coordinator areas, and batch upload templates.</p>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <div key={dept} className="flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-xs">
                <span className="text-foreground">{dept}</span>
                <button onClick={() => setDepartments((prev) => prev.filter((d) => d !== dept))} className="text-destructive/60 hover:text-destructive ml-1">×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input placeholder="New department name…" value={newDept} onChange={(e) => setNewDept(e.target.value)} className="text-sm max-w-xs" />
            <Button size="sm" onClick={handleAddDept} disabled={!newDept.trim()}>Add</Button>
          </div>
        </div>
      )}

      {/* Unit filter for license table */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-muted-foreground mr-1">Filter:</span>
        {["All", ...departments].map((unit) => (
          <button key={unit} onClick={() => setFilterUnit(unit)} className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${filterUnit === unit ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
            {unit}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="trainees">
        <TabsList>
          <TabsTrigger value="trainees">Trainees & Assignments</TabsTrigger>
          <TabsTrigger value="coordinators">Education Coordinators</TabsTrigger>
        </TabsList>

        <TabsContent value="trainees" className="mt-4">
          <div className="rounded-xl bg-card shadow-card overflow-hidden">
            <div className="p-5 pb-3">
              <h3 className="text-sm font-semibold text-foreground">Enrolled Students</h3>
              <p className="text-xs text-muted-foreground">{sortedStudents.length} students · Click a student to edit their details</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-b bg-muted/50">
                    <th className="px-3 py-2.5 w-8"><Checkbox checked={selectedStudents.size === sortedStudents.length && sortedStudents.length > 0} onCheckedChange={() => { if (selectedStudents.size === sortedStudents.length) setSelectedStudents(new Set()); else setSelectedStudents(new Set(sortedStudents.map((s) => s.id))); }} className="h-3.5 w-3.5" /></th>
                    <LicSortHeader label="Student" field="name" />
                    <LicSortHeader label="Unit" field="unit" />
                    <LicSortHeader label="Due Date" field="dueDate" />
                    <LicSortHeader label="Purchased" field="purchased" />
                    <LicSortHeader label="Expires" field="expires" />
                    <LicSortHeader label="Time Left" field="timeLeft" />
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student) => {
                    const purchased = licensePurchased[student.id] || "2025-06-01";
                    const expiry = getAnnualExpiry(purchased);
                    const badge = getExpiryBadge(expiry);
                    return (
                      <tr key={student.id} className={`border-b transition-colors hover:bg-muted/30 cursor-pointer ${selectedStudents.has(student.id) ? "bg-primary/5" : ""}`} onClick={() => openStudentEdit(student)}>
                        <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={selectedStudents.has(student.id)} onCheckedChange={() => toggleStudentSelection(student.id)} className="h-3.5 w-3.5" />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{student.avatar}</div>
                            <p className="font-medium text-foreground text-[13px]">{student.name}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3"><span className="text-xs text-muted-foreground">{student.unit}</span></td>
                        <td className="px-3 py-3"><span className="text-xs text-foreground">{student.deadline}</span></td>
                        <td className="px-3 py-3"><span className="text-xs text-foreground">{new Date(purchased).toLocaleDateString()}</span></td>
                        <td className="px-3 py-3"><span className="text-xs text-foreground">{new Date(expiry).toLocaleDateString()}</span></td>
                        <td className="px-3 py-3"><span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}>{badge.text}</span></td>
                        <td className="px-3 py-3"><span className="text-[10px] text-success font-medium">Active</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="coordinators" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Assign coordinators to clinical specialties</p>
            <Button onClick={() => setShowAdd(!showAdd)} className="gap-2" size="sm"><Plus className="h-4 w-4" /> Add Coordinator</Button>
          </div>

          {showAdd && (
            <div className="rounded-xl bg-card p-5 shadow-card space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><UserCog className="h-4 w-4 text-primary" /> New Coordinator</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="text-sm" />
                <Input placeholder="Email Address" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-2 block">Assigned Areas (select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map((area) => (
                    <label key={area} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs cursor-pointer transition-colors ${newAreas.includes(area) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/50"}`}>
                      <Checkbox checked={newAreas.includes(area)} onCheckedChange={() => toggleArea(area)} className="h-3 w-3" />
                      {area}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => { setShowAdd(false); setNewAreas([]); }}>Cancel</Button>
                <Button size="sm" onClick={handleAdd} disabled={!newName || !newEmail || newAreas.length === 0}>Save</Button>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-card shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coordinator</th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                    {departments.map((dept) => (
                      <th key={dept} className="px-2 py-3 text-center text-[9px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">{dept}</th>
                    ))}
                    <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"></th>
                  </tr>
                </thead>
                <tbody>
                  {coordinators.map((coord) => (
                    <tr key={coord.id} className="border-b transition-colors hover:bg-muted/30 cursor-pointer" onClick={() => openCoordEdit(coord)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"><Shield className="h-4 w-4" /></div>
                          <span className="font-medium text-foreground text-[13px] hover:text-primary transition-colors">{coord.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground text-xs">{coord.email}</td>
                      {departments.map((dept) => (
                        <td key={dept} className="px-2 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={coord.assignedAreas.includes(dept)} onCheckedChange={() => toggleCoordArea(coord.id, dept)} className="h-4 w-4" />
                        </td>
                      ))}
                      <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setCoordinators((prev) => prev.filter((c) => c.id !== coord.id))}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Student Edit Modal */}
      <Dialog open={!!editStudent} onOpenChange={() => setEditStudent(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit2 className="h-5 w-5 text-primary" /> Edit Student: {editStudent?.name}</DialogTitle>
            <DialogDescription>Update name, email, due date, unit assignment, and modules.</DialogDescription>
          </DialogHeader>
          {editSaved ? (
            <div className="flex flex-col items-center py-6 gap-2"><CheckCircle className="h-10 w-10 text-success" /><p className="text-sm font-semibold">Changes saved!</p></div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">First Name</label>
                  <Input value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Last Name</label>
                  <Input value={editLastName} onChange={(e) => setEditLastName(e.target.value)} className="text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Email</label>
                <Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Unit / Department</label>
                  <Select value={editUnit} onValueChange={setEditUnit}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Training Due Date</label>
                  <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-2 block">Assigned Modules</label>
                <div className="space-y-2">
                  {[{ id: "walkthrough", label: "Walkthrough Training" }, { id: "patient-cases", label: "Patient Cases (17)" }, { id: "verification", label: "Verification of Proficiency" }].map((mod) => (
                    <label key={mod.id} className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors">
                      <Checkbox checked={editModules.includes(mod.id)} onCheckedChange={() => setEditModules((prev) => prev.includes(mod.id) ? prev.filter((m) => m !== mod.id) : [...prev, mod.id])} />
                      <span className="text-xs font-medium text-foreground">{mod.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={handleSaveStudentEdit}><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Edit Modal */}
      <Dialog open={bulkActionOpen} onOpenChange={setBulkActionOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Edit {selectedStudents.size} Students</DialogTitle>
            <DialogDescription>Change due dates or unit assignments for selected students.</DialogDescription>
          </DialogHeader>
          {bulkSaved ? (
            <div className="flex flex-col items-center py-6 gap-2"><CheckCircle className="h-10 w-10 text-success" /><p className="text-sm font-semibold">Changes saved!</p></div>
          ) : (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">New Due Date (optional)</label>
                <Input type="date" value={bulkDueDate} onChange={(e) => setBulkDueDate(e.target.value)} className="text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Change Unit (optional)</label>
                <Select value={bulkUnit} onValueChange={setBulkUnit}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Keep current" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="keep">Keep current</SelectItem>
                    {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleBulkSave}><Save className="h-4 w-4 mr-1" /> Apply to {selectedStudents.size} Students</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Training Cohort Modal */}
      <Dialog open={cohortOpen} onOpenChange={setCohortOpen}>
        <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Start New Training Cohort</DialogTitle>
            <DialogDescription>Set up a new cohort with batch upload or individual students.</DialogDescription>
          </DialogHeader>
          {uploaded ? (
            <div className="flex flex-col items-center py-8 gap-3"><CheckCircle className="h-12 w-12 text-success" /><p className="text-sm font-semibold">Cohort created successfully!</p></div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block">Cohort Name</label>
                  <Input placeholder="e.g. Spring 2026 Surgery" value={cohortName} onChange={(e) => setCohortName(e.target.value)} className="text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1 block flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Default Due Date</label>
                  <Input type="date" value={cohortDueDate} onChange={(e) => setCohortDueDate(e.target.value)} className="text-sm" />
                </div>
              </div>

              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                <p className="text-xs font-semibold text-foreground mb-1">Batch Upload via CSV</p>
                <p className="text-[10px] text-muted-foreground mb-2">Download our CSV template with the correct columns and department dropdowns.</p>
                <div className="flex gap-2 mb-3">
                  <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={downloadTemplate}>
                    <Upload className="h-3.5 w-3.5" /> Download CSV Template
                  </Button>
                </div>
                <Input type="file" accept=".csv,.xlsx,.xls" onChange={(e) => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} className="text-xs" />
                {file && <p className="text-[10px] text-success font-medium mt-1 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> {file.name}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">Unit column will auto-assign from the file. Departments: {departments.join(", ")}</p>
              </div>

              <Button className="w-full gap-2" onClick={handleUpload} disabled={!file && !cohortName}>
                <Upload className="h-4 w-4" /> Create Cohort & Upload
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Individual Student Modal */}
      <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-primary" /> Add Individual Student</DialogTitle>
            <DialogDescription>Add a single student with their training details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-semibold text-foreground mb-1 block">First Name</label><Input value={indFirstName} onChange={(e) => setIndFirstName(e.target.value)} className="text-sm" /></div>
              <div><label className="text-xs font-semibold text-foreground mb-1 block">Last Name</label><Input value={indLastName} onChange={(e) => setIndLastName(e.target.value)} className="text-sm" /></div>
            </div>
            <div><label className="text-xs font-semibold text-foreground mb-1 block">Email</label><Input type="email" value={indEmail} onChange={(e) => setIndEmail(e.target.value)} className="text-sm" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Unit / Department</label>
                <Select value={indUnit} onValueChange={setIndUnit}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>{departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><label className="text-xs font-semibold text-foreground mb-1 block">Training Due Date</label><Input type="date" value={indDueDate} onChange={(e) => setIndDueDate(e.target.value)} className="text-sm" /></div>
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">Assign Modules</label>
              <div className="space-y-2">
                {[{ id: "walkthrough", label: "Walkthrough Training" }, { id: "patient-cases", label: "Patient Cases (17)" }, { id: "verification", label: "Verification of Proficiency" }].map((mod) => (
                  <label key={mod.id} className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox checked={indModules.includes(mod.id)} onCheckedChange={() => setIndModules((prev) => prev.includes(mod.id) ? prev.filter((m) => m !== mod.id) : [...prev, mod.id])} />
                    <span className="text-xs font-medium text-foreground">{mod.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button className="w-full" onClick={handleAddIndividualStudent} disabled={!indFirstName || !indLastName || !indEmail || !indUnit}><Plus className="h-4 w-4 mr-1" /> Add Student</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Coordinator Edit Modal */}
      <Dialog open={!!editCoord} onOpenChange={() => setEditCoord(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Edit2 className="h-5 w-5 text-primary" /> Edit Coordinator</DialogTitle>
            <DialogDescription>Update coordinator name and email address.</DialogDescription>
          </DialogHeader>
          {editCoordSaved ? (
            <div className="flex flex-col items-center py-6 gap-2"><CheckCircle className="h-10 w-10 text-success" /><p className="text-sm font-semibold">Changes saved!</p></div>
          ) : (
            <div className="space-y-4 mt-2">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Name</label>
                <Input value={editCoord?.name || ""} onChange={(e) => setEditCoord((prev) => prev ? { ...prev, name: e.target.value } : null)} className="text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Email</label>
                <Input type="email" value={editCoord?.email || ""} onChange={(e) => setEditCoord((prev) => prev ? { ...prev, email: e.target.value } : null)} className="text-sm" />
              </div>
              <Button className="w-full" onClick={handleSaveCoordEdit}><Save className="h-4 w-4 mr-1" /> Save Changes</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <PurchaseLicensesModal open={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
    </div>
  );
};

export default LicensesAccessPage;
