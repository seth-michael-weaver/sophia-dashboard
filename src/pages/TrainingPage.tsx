import ProgressChart from "@/components/dashboard/ProgressChart";

const TrainingPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Training Progress</h2>
        <p className="text-sm text-muted-foreground">Module completion across all students</p>
      </div>

      <ProgressChart />
    </div>
  );
};

export default TrainingPage;
