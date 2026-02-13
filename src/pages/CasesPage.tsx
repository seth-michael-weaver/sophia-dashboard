import CaseDifficulty from "@/components/dashboard/CaseDifficulty";

const CasesPage = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Case Difficulty</h2>
        <p className="text-sm text-muted-foreground">Actionable priority by patient case</p>
      </div>

      <CaseDifficulty />
    </div>
  );
};

export default CasesPage;
