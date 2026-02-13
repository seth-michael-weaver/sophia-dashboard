import { useState } from "react";
import { students, summaryStats } from "@/data/mockData";
import { KeyRound, ShoppingCart, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import BatchUploadModal from "@/components/dashboard/BatchUploadModal";

// Mock license expiration dates
const licenseExpiry: Record<string, string> = {
  "1": "2026-06-15", "2": "2026-05-20", "3": "2026-04-10", "4": "2026-08-01",
  "5": "2026-07-22", "6": "2026-03-15", "7": "2026-09-30", "8": "2026-04-05",
  "9": "2026-06-28", "10": "2026-03-01", "11": "2026-07-14", "12": "2026-05-18",
};

const getExpiryBadge = (date: string) => {
  const days = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 30) return { text: `${days}d`, className: "bg-destructive/10 text-destructive" };
  if (days < 90) return { text: `${days}d`, className: "bg-warning/10 text-warning" };
  return { text: `${days}d`, className: "bg-success/10 text-success" };
};

const LicensesPage = () => {
  const [batchOpen, setBatchOpen] = useState(false);
  const { licensesUsed, licensesTotal } = summaryStats;
  const usagePercent = Math.round((licensesUsed / licensesTotal) * 100);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">License Management</h2>
        <p className="text-sm text-muted-foreground">Manage licenses, batch uploads, and view active license holders</p>
      </div>

      {/* License overview + actions */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl bg-card p-5 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-warning/10">
              <KeyRound className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Usage</p>
              <p className="text-3xl font-bold text-foreground">{licensesUsed}<span className="text-lg text-muted-foreground font-normal">/{licensesTotal}</span></p>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden mb-1">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${usagePercent}%`, background: usagePercent > 85 ? "hsl(0, 65%, 48%)" : "hsl(217, 91%, 60%)" }} />
          </div>
          <p className="text-[10px] text-muted-foreground">{licensesTotal - licensesUsed} licenses available</p>
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

      {/* Students with active licenses */}
      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        <div className="p-5 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Students with Active Licenses</h3>
          <p className="text-xs text-muted-foreground">{students.length} active license holders</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-b bg-muted/50">
                <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Student</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Unit</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">License Expires</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Time Left</th>
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const expiry = licenseExpiry[student.id] || "2026-06-01";
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

      <BatchUploadModal open={batchOpen} onClose={() => setBatchOpen(false)} />
    </div>
  );
};

export default LicensesPage;
