import { useState } from "react";
import ErrorAnalytics from "@/components/dashboard/ErrorAnalytics";
import StudentTable from "@/components/dashboard/StudentTable";

const ErrorsPage = () => {
  const [activeError, setActiveError] = useState("");

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Common Errors</h2>
        <p className="text-sm text-muted-foreground">Click an error bar to filter students below</p>
      </div>

      <ErrorAnalytics activeError={activeError} onErrorChange={setActiveError} />

      <StudentTable activeUnit="All" activeError={activeError} />
    </div>
  );
};

export default ErrorsPage;
