import ProgressChart from "@/components/dashboard/ProgressChart";
import ErrorAnalytics from "@/components/dashboard/ErrorAnalytics";
import CaseDifficulty from "@/components/dashboard/CaseDifficulty";
import { useState } from "react";

const TrainingPage = () => {
  const [activeError, setActiveError] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Training & Analytics</h2>
        <p className="text-sm text-muted-foreground">Training progress, common errors, and case difficulty</p>
      </div>

      <ProgressChart />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ErrorAnalytics activeError={activeError} onErrorChange={setActiveError} />
        <CaseDifficulty />
      </div>
    </div>
  );
};

export default TrainingPage;
