import { useState } from "react";
import SummaryCards from "@/components/dashboard/SummaryCards";
import StudentTable from "@/components/dashboard/StudentTable";
import ErrorAnalytics from "@/components/dashboard/ErrorAnalytics";

const StudentsPage = () => {
  const [activeUnit, setActiveUnit] = useState("All");
  const [activeError, setActiveError] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Student Progress</h2>
        <p className="text-sm text-muted-foreground">Full student list with error filtering</p>
      </div>

      <SummaryCards activeUnit={activeUnit} onUnitChange={setActiveUnit} />

      {/* Error filter section */}
      <div className="rounded-xl bg-card p-5 shadow-card">
        <h3 className="text-sm font-semibold text-foreground mb-1">Filter by Error Type</h3>
        <p className="text-xs text-muted-foreground mb-3">Click an error to filter students who committed it</p>
        <ErrorAnalytics activeError={activeError} onErrorChange={setActiveError} />
      </div>

      <StudentTable activeUnit={activeUnit} activeError={activeError} />
    </div>
  );
};

export default StudentsPage;
