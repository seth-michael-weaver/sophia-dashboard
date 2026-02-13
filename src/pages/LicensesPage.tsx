import LicenseWidget from "@/components/dashboard/LicenseWidget";

const LicensesPage = () => {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">License Management</h2>
        <p className="text-sm text-muted-foreground">Manage licenses and batch uploads</p>
      </div>

      <LicenseWidget />
    </div>
  );
};

export default LicensesPage;
