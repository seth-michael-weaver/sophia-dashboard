import { useState } from "react";
import { students, summaryStats } from "@/data/mockData";
import { KeyRound, ShoppingCart, Upload, Sparkles, Plus, Trash2, Shield, UserCog, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import BatchUploadModal from "@/components/dashboard/BatchUploadModal";
import PurchaseLicensesModal from "@/components/dashboard/PurchaseLicensesModal";

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

const areaOptions = [
  "All Areas", "Student Progress", "Common Errors", "Case Difficulty",
  "Training Progress", "Anesthesia", "Surgery", "Internal Medicine", "Advanced Practice Providers",
];

interface Coordinator {
  id: string;
  name: string;
  email: string;
  assignedAreas: string[];
}

const initialCoordinators: Coordinator[] = [
  { id: "1", name: "Dr. Sarah Miller", email: "s.miller@mercygeneral.edu", assignedAreas: ["Common Errors", "Anesthesia"] },
  { id: "2", name: "Dr. John Adams", email: "j.adams@mercygeneral.edu", assignedAreas: ["Anesthesia", "Surgery"] },
  { id: "3", name: "Nancy Drew, RN", email: "n.drew@mercygeneral.edu", assignedAreas: ["Training Progress", "Internal Medicine"] },
];

type LicenseSortKey = "name" | "unit" | "purchased" | "expires" | "timeLeft";
type CoordSortKey = "name" | "email";
type SortDir = "asc" | "desc";

const LicensesAccessPage = () => {
  const [batchOpen, setBatchOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [coordinators, setCoordinators] = useState<Coordinator[]>(initialCoordinators);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newAreas, setNewAreas] = useState<string[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const { licensesUsed, licensesTotal } = summaryStats;
  const usagePercent = Math.round((licensesUsed / licensesTotal) * 100);

  // License table sort
  const [licSortKey, setLicSortKey] = useState<LicenseSortKey>("name");
  const [licSortDir, setLicSortDir] = useState<SortDir>("asc");

  const handleLicSort = (key: LicenseSortKey) => {
    if (licSortKey === key) setLicSortDir(licSortDir === "asc" ? "desc" : "asc");
    else { setLicSortKey(key); setLicSortDir("asc"); }
  };

  const toggleArea = (area: string) => {
    setNewAreas((prev) => prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]);
  };

  const handleAdd = () => {
    if (newName && newEmail && newAreas.length > 0) {
      setCoordinators((prev) => [...prev, { id: Date.now().toString(), name: newName, email: newEmail, assignedAreas: [...newAreas] }]);
      setNewName(""); setNewEmail(""); setNewAreas([]); setShowAdd(false);
    }
  };

  // Sort students for license table
  const sortedStudents = [...students].sort((a, b) => {
    let cmp = 0;
    const aPurchased = licensePurchased[a.id] || "2025-06-01";
    const bPurchased = licensePurchased[b.id] || "2025-06-01";
    switch (licSortKey) {
      case "name": cmp = a.name.localeCompare(b.name); break;
      case "unit": cmp = a.unit.localeCompare(b.unit); break;
      case "purchased": cmp = aPurchased.localeCompare(bPurchased); break;
      case "expires": cmp = getAnnualExpiry(aPurchased).localeCompare(getAnnualExpiry(bPurchased)); break;
      case "timeLeft": {
        const aDays = Math.ceil((new Date(getAnnualExpiry(aPurchased)).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const bDays = Math.ceil((new Date(getAnnualExpiry(bPurchased)).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        cmp = aDays - bDays;
        break;
      }
    }
    return licSortDir === "asc" ? cmp : -cmp;
  });

  const LicSortHeader = ({ label, field }: { label: string; field: LicenseSortKey }) => (
    <th
      className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleLicSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${licSortKey === field ? "text-primary" : "text-muted-foreground/40"}`} />
      </div>
    </th>
  );

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
            <Button className="gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none" variant="outline" size="sm" onClick={() => setPurchaseOpen(true)}>
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
                    <LicSortHeader label="Student" field="name" />
                    <LicSortHeader label="Unit" field="unit" />
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
                      <tr key={student.id} className="border-b transition-colors hover:bg-muted/30">
                        <td className="px-3 py-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input placeholder="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} className="text-sm" />
                <Input placeholder="Email Address" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-2 block">Assigned Areas (select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {areaOptions.map((area) => (
                    <label
                      key={area}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs cursor-pointer transition-colors ${
                        newAreas.includes(area) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Checkbox
                        checked={newAreas.includes(area)}
                        onCheckedChange={() => toggleArea(area)}
                        className="h-3 w-3"
                      />
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
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coordinator</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assigned Areas</th>
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
                    <td className="px-3 py-3 text-muted-foreground text-xs">{coord.email}</td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {coord.assignedAreas.map((area) => (
                          <span key={area} className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{area}</span>
                        ))}
                      </div>
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
      <PurchaseLicensesModal open={purchaseOpen} onClose={() => setPurchaseOpen(false)} />
    </div>
  );
};

export default LicensesAccessPage;
