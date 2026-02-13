import { useState } from "react";
import { students, summaryStats } from "@/data/mockData";
import { KeyRound, ShoppingCart, Upload, Sparkles, Plus, Trash2, Shield, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BatchUploadModal from "@/components/dashboard/BatchUploadModal";

// Annual licenses - purchased date + 1 year
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

interface Coordinator {
  id: string;
  name: string;
  email: string;
  assignedArea: string;
}

const areaOptions = [
  "All Areas", "Student Progress", "Common Errors", "Case Difficulty",
  "Training Progress", "Anesthesia", "Surgery", "Internal Medicine", "Advanced Practice Providers",
];

const initialCoordinators: Coordinator[] = [
  { id: "1", name: "Dr. Sarah Miller", email: "s.miller@mercygeneral.edu", assignedArea: "Common Errors" },
  { id: "2", name: "Dr. John Adams", email: "j.adams@mercygeneral.edu", assignedArea: "Anesthesia" },
  { id: "3", name: "Nancy Drew, RN", email: "n.drew@mercygeneral.edu", assignedArea: "Training Progress" },
];

const LicensesAccessPage = () => {
  const [batchOpen, setBatchOpen] = useState(false);
  const [coordinators, setCoordinators] = useState<Coordinator[]>(initialCoordinators);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newArea, setNewArea] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const { licensesUsed, licensesTotal } = summaryStats;
  const usagePercent = Math.round((licensesUsed / licensesTotal) * 100);

  const handleAdd = () => {
    if (newName && newEmail && newArea) {
      setCoordinators((prev) => [...prev, { id: Date.now().toString(), name: newName, email: newEmail, assignedArea: newArea }]);
      setNewName(""); setNewEmail(""); setNewArea(""); setShowAdd(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Licenses & Access</h2>
        <p className="text-sm text-muted-foreground">Manage licenses, coordinators, and program access</p>
      </div>

      {/* License overview + actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning/10">
              <KeyRound className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">License Usage</p>
              <p className="text-3xl font-bold text-foreground">{licensesUsed}<span className="text-lg text-muted-foreground font-normal">/{licensesTotal}</span></p>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-1">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${usagePercent}%`, background: usagePercent > 85 ? "hsl(0, 65%, 48%)" : "hsl(217, 91%, 60%)" }} />
          </div>
          <p className="text-[10px] text-muted-foreground">{licensesTotal - licensesUsed} licenses available · Licenses expire annually from purchase</p>
        </div>

        <div className="rounded-xl bg-card p-5 shadow-card lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">Quick Actions</p>
          <div className="flex flex-wrap gap-2">
            <Button className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none" variant="outline" size="sm">
              <ShoppingCart className="h-3.5 w-3.5" /> Purchase Licenses
            </Button>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setBatchOpen(true)}>
              <Upload className="h-3.5 w-3.5" /> Batch Upload Trainees
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Sparkles className="h-3.5 w-3.5" /> Assign Practice
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs: Licenses / Coordinators */}
      <Tabs defaultValue="licenses">
        <TabsList>
          <TabsTrigger value="licenses">Active Licenses</TabsTrigger>
          <TabsTrigger value="coordinators">Education Coordinators</TabsTrigger>
        </TabsList>

        <TabsContent value="licenses" className="mt-4">
          <div className="rounded-xl bg-card shadow-card overflow-hidden">
            <div className="p-5 pb-3">
              <h3 className="text-sm font-semibold text-foreground">Students with Active Licenses</h3>
              <p className="text-xs text-muted-foreground">{students.length} active license holders · Annual renewal from purchase date</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-t border-b bg-muted/50">
                    <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Unit</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Purchased</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Expires</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Time Left</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const purchased = licensePurchased[student.id] || "2025-06-01";
                    const expiry = getAnnualExpiry(purchased);
                    const badge = getExpiryBadge(expiry);
                    return (
                      <tr key={student.id} className="border-b transition-colors hover:bg-muted/30">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{student.avatar}</div>
                            <p className="font-medium text-foreground text-[13px]">{student.name}</p>
                          </div>
                        </td>
                        <td className="px-3 py-3"><span className="text-xs text-muted-foreground">{student.unit}</span></td>
                        <td className="px-3 py-3"><span className="text-xs text-foreground">{new Date(purchased).toLocaleDateString()}</span></td>
                        <td className="px-3 py-3"><span className="text-xs text-foreground">{new Date(expiry).toLocaleDateString()}</span></td>
                        <td className="px-3 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${badge.className}`}>{badge.text}</span>
                        </td>
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
            <p className="text-sm text-muted-foreground">Assign coordinators to review specific areas of the training program</p>
            <Button onClick={() => setShowAdd(!showAdd)} className="gap-2" size="sm">
              <Plus className="h-4 w-4" /> Add Coordinator
            </Button>
          </div>

          {showAdd && (
            <div className="rounded-xl bg-card p-5 shadow-card space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <UserCog className="h-4 w-4 text-primary" /> New Coordinator
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Input placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="text-sm" />
                <Input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="text-sm" />
                <Select value={newArea} onValueChange={setNewArea}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="Assigned Area" /></SelectTrigger>
                  <SelectContent>{areaOptions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
                <Button size="sm" onClick={handleAdd} disabled={!newName || !newEmail || !newArea}>Save</Button>
              </div>
            </div>
          )}

          <div className="rounded-xl bg-card shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coordinator</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assigned Area</th>
                  <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {coordinators.map((coord) => (
                  <tr key={coord.id} className="border-b transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          <Shield className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-foreground">{coord.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{coord.email}</td>
                    <td className="px-3 py-3">
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">{coord.assignedArea}</span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => setCoordinators((prev) => prev.filter((c) => c.id !== coord.id))}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <BatchUploadModal open={batchOpen} onClose={() => setBatchOpen(false)} />
    </div>
  );
};

export default LicensesAccessPage;
