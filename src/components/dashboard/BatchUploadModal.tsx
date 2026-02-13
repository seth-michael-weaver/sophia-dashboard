import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileSpreadsheet, CheckCircle, Calendar, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface BatchUploadModalProps {
  open: boolean;
  onClose: () => void;
}

const patientCasesList = [
  "Case 1: Doebuck, James", "Case 2: Miller, Vincent", "Case 3: Washington, Simone",
  "Case 4: Gonzalez, Jessica", "Case 5: Johnston, Helena", "Case 6: Brown, Christina",
  "Case 7: Stevenson, Kawhi", "Case 8: Sparrow, Timmothy", "Case 9: Castell, Heather",
  "Case 10: Smith, Anna", "Case 11: Jacobson, Devin", "Case 12: Shoemaker, Ashley",
  "Case 13: Steinlan, John", "Case 14: Zhang, Colin", "Case 15: Nash, Jeff",
  "Case 16: Carr, John", "Case 17: Wilson, Alan",
];

const moduleOptions = [
  { id: "walkthrough", label: "Walkthrough Training" },
  { id: "patient-cases", label: "Patient Cases (17)" },
  { id: "verification", label: "Verification of Proficiency" },
];

const downloadTemplate = () => {
  const headers = "First Name,Last Name,Email,Unit,Training Due Date,Walkthrough (Y/N),Patient Cases (Y/N),Verification of Proficiency (Y/N)";
  const example1 = "John,Doe,john.doe@hospital.edu,Surgery,2026-06-01,Y,Y,Y";
  const example2 = "Jane,Smith,jane.smith@hospital.edu,Anesthesia,2026-07-15,Y,Y,N";
  const notes = "\n# INSTRUCTIONS:\n# - Unit must match a configured department (e.g. Surgery, Anesthesia, Internal Medicine, etc.)\n# - Training Due Date format: YYYY-MM-DD\n# - Use Y or N for module assignments\n# - One student per row";
  const csv = `${headers}\n${example1}\n${example2}\n${notes}`;
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "student_upload_template.csv";
  a.click();
  URL.revokeObjectURL(url);
};

const BatchUploadModal = ({ open, onClose }: BatchUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [showCases, setShowCases] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const toggleModule = (id: string) => {
    setSelectedModules((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]);
    if (id === "patient-cases") setShowCases(!showCases);
  };

  const toggleCase = (name: string) => {
    setSelectedCases((prev) => prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]);
  };

  const handleUpload = () => {
    setUploaded(true);
    setTimeout(() => {
      setUploaded(false); setFile(null); setDueDate("");
      setSelectedModules([]); setSelectedCases([]); setShowCases(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Batch Upload Students
          </DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file with student data. The file should include columns for name, email, unit, due date, and modules.
          </DialogDescription>
        </DialogHeader>

        {uploaded ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <CheckCircle className="h-12 w-12 text-success" />
            <p className="text-sm font-semibold text-foreground">Upload Successful!</p>
            <p className="text-xs text-muted-foreground">Students have been added and assigned.</p>
          </div>
        ) : (
          <div className="space-y-5 mt-2">
            {/* Download Template */}
            <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
              <p className="text-xs font-semibold text-foreground mb-1">Need a template?</p>
              <p className="text-[10px] text-muted-foreground mb-2">Download our CSV template pre-filled with the correct columns and example data.</p>
              <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={downloadTemplate}>
                <Download className="h-3.5 w-3.5" /> Download CSV Template
              </Button>
            </div>

            {/* File upload */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Upload File</label>
              <Input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="text-xs" />
              {file && (
                <p className="text-[10px] text-success font-medium mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> {file.name}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">
                Required columns: <strong>First Name, Last Name, Email, Unit, Training Due Date, Modules</strong>. Unit will be auto-assigned from the file.
              </p>
            </div>

            {/* Default due date (override) */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Default Due Date (overrides file if set)
              </label>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="text-xs" />
            </div>

            {/* Module selection */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">Override Module Assignment (optional)</label>
              <div className="space-y-2">
                {moduleOptions.map((mod) => (
                  <label key={mod.id} className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors">
                    <Checkbox checked={selectedModules.includes(mod.id)} onCheckedChange={() => toggleModule(mod.id)} />
                    <span className="text-xs font-medium text-foreground">{mod.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {showCases && selectedModules.includes("patient-cases") && (
              <div>
                <label className="text-xs font-semibold text-foreground mb-2 block">Select Patient Cases</label>
                <div className="max-h-[180px] overflow-y-auto rounded-lg border border-border p-2 space-y-1">
                  <button
                    onClick={() => setSelectedCases(selectedCases.length === patientCasesList.length ? [] : [...patientCasesList])}
                    className="text-[10px] font-semibold text-primary hover:underline mb-1"
                  >
                    {selectedCases.length === patientCasesList.length ? "Deselect All" : "Select All"}
                  </button>
                  {patientCasesList.map((caseName) => (
                    <label key={caseName} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer transition-colors">
                      <Checkbox checked={selectedCases.includes(caseName)} onCheckedChange={() => toggleCase(caseName)} />
                      <span className="text-[11px] text-foreground">{caseName}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{selectedCases.length} of {patientCasesList.length} cases selected</p>
              </div>
            )}

            <Button className="w-full gap-2" onClick={handleUpload} disabled={!file}>
              <Upload className="h-4 w-4" />
              Upload & Assign
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BatchUploadModal;
