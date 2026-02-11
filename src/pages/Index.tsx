import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ProgressChart from "@/components/dashboard/ProgressChart";
import LicenseWidget from "@/components/dashboard/LicenseWidget";
import StudentTable from "@/components/dashboard/StudentTable";
import ErrorAnalytics from "@/components/dashboard/ErrorAnalytics";
import CaseDifficulty from "@/components/dashboard/CaseDifficulty";

const Index = () => {
  const [activeUnit, setActiveUnit] = useState("All");

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Summary strip */}
        <SummaryCards activeUnit={activeUnit} onUnitChange={setActiveUnit} />

        {/* Row 1: Progress + Licenses */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ProgressChart />
          <ErrorAnalytics />
          <LicenseWidget />
        </div>

        {/* Row 2: Student table */}
        <StudentTable activeUnit={activeUnit} />

        {/* Row 3: Case difficulty */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <CaseDifficulty />
          {/* Activity feed placeholder */}
          <div className="rounded-xl bg-card p-5 shadow-card animate-fade-in">
            <h3 className="text-sm font-semibold text-foreground mb-1">Recent Activity</h3>
            <p className="text-xs text-muted-foreground mb-4">Latest training events</p>
            <div className="space-y-3">
              {[
                { text: "Sarah Chen completed Verification of Proficiency", time: "2 hrs ago", type: "success" },
                { text: "James Rodriguez flagged: 3+ arterial puncture errors", time: "5 hrs ago", type: "error" },
                { text: "Emily Thompson started Module 2: Ultrasound Guidance", time: "1 day ago", type: "info" },
                { text: "Tom Bradley deadline overdue — Module 1 incomplete", time: "1 day ago", type: "error" },
                { text: "Aisha Patel scored 76 on Subclavian Access simulation", time: "12 hrs ago", type: "info" },
                { text: "Batch upload: 12 new students added to Surgery", time: "2 days ago", type: "info" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 group cursor-pointer">
                  <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${
                    item.type === "success" ? "bg-success" : item.type === "error" ? "bg-destructive" : "bg-primary"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground group-hover:text-primary transition-colors">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
