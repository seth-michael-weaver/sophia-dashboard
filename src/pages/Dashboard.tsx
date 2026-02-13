import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import StudentTable from "@/components/dashboard/StudentTable";

const Dashboard = () => {
  const [activeUnit, setActiveUnit] = useState("All");
  const [activeStatus, setActiveStatus] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Dashboard</h2>
        <p className="text-sm text-muted-foreground">Students needing attention and key metrics</p>
      </div>

      <SummaryCards activeUnit={activeUnit} onUnitChange={setActiveUnit} activeStatus={activeStatus} onStatusChange={setActiveStatus} />

      {/* Dashboard only shows students who are behind or need practice */}
      <StudentTable
        activeUnit={activeUnit}
        activeStatus={activeStatus}
        dashboardMode
      />

      <div className="flex justify-end">
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View all student progress <ArrowRight className="h-4 w-4" />
        </Link>
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
  );
};

export default Dashboard;
