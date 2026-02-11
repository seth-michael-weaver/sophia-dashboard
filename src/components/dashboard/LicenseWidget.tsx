import { KeyRound, ShoppingCart, Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { summaryStats } from "@/data/mockData";

const LicenseWidget = () => {
  const { licensesUsed, licensesTotal } = summaryStats;
  const usagePercent = Math.round((licensesUsed / licensesTotal) * 100);

  return (
    <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">License Management</h3>
          <p className="text-xs text-muted-foreground">Usage & user controls</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
          <KeyRound className="h-4 w-4 text-warning" />
        </div>
      </div>

      {/* Usage bar */}
      <div className="mb-4">
        <div className="flex items-end justify-between mb-1.5">
          <span className="text-2xl font-bold text-foreground">{licensesUsed}</span>
          <span className="text-xs text-muted-foreground">of {licensesTotal} licenses</span>
        </div>
        <div className="h-2.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${usagePercent}%`,
              background: usagePercent > 85 
                ? "hsl(0, 72%, 51%)" 
                : usagePercent > 65 
                ? "hsl(38, 92%, 50%)" 
                : "hsl(217, 91%, 60%)",
            }}
          />
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {usagePercent > 85 ? "⚠ Running low on licenses" : `${licensesTotal - licensesUsed} licenses available`}
        </p>
      </div>

      {/* Quick actions */}
      <div className="space-y-2">
        <Button className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none" variant="outline" size="sm">
          <ShoppingCart className="h-3.5 w-3.5" />
          Purchase Licenses
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline" size="sm">
          <Upload className="h-3.5 w-3.5" />
          Batch Upload CSV
        </Button>
        <Button className="w-full justify-start gap-2" variant="outline" size="sm">
          <Sparkles className="h-3.5 w-3.5" />
          Assign Practice
        </Button>
      </div>
    </div>
  );
};

export default LicenseWidget;
