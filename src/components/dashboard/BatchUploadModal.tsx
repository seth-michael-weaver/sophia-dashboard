import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileSpreadsheet, CheckCircle, Calendar } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface BatchUploadModalProps {
  open: boolean;
  onClose: () => void;
}

const patientCasesList = [
  "Johnston, Helena (Thin, no peripheral access)",
  "CVC IJV Emergent",
  "CVC Subclavian Elective",
  "CVC Femoral Critical",
  "PICC Line Insertion",
  "Arterial Line Radial",
  "Triple Lumen IJV",
  "Patient Case 7",
  "Patient Case 8",
  "Patient Case 9",
  "Patient Case 10",
  "Patient Case 11",
  "Patient Case 12",
  "Patient Case 13",
  "Patient Case 14",
  "Patient Case 15",
  "Patient Case 16",
  "Patient Case 17",
  "Patient Case 18",
];

const moduleOptions = [
  { id: "walkthrough", label: "Walkthrough Training" },
  { id: "patient-cases", label: "Patient Cases (18)" },
  { id: "verification", label: "Verification of Proficiency" },
];

const BatchUploadModal = ({ open, onClose }: BatchUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dueDate, setDueDate] = useState("");
  const [unit, setUnit] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [selectedCases, setSelectedCases] = useState<string[]>([]);
  const [showCases, setShowCases] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const toggleModule = (id: string) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
    if (id === "patient-cases") {
      setShowCases(!showCases);
    }
  };

  const toggleCase = (name: string) => {
    setSelectedCases((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const handleUpload = () => {
    setUploaded(true);
    setTimeout(() => {
      setUploaded(false);
      setFile(null);
      setDueDate("");
      setUnit("");
      setSelectedModules([]);
      setSelectedCases([]);
      setShowCases(false);
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
            Upload a CSV or Excel file with student data, then assign modules and due dates.
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
            {/* File upload */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Upload File</label>
              <div className="relative">
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="text-xs"
                />
              </div>
              {file && (
                <p className="text-[10px] text-success font-medium mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> {file.name}
                </p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">
                Columns: Name, Email, Unit (optional). One student per row.
              </p>
            </div>

            {/* Unit assignment */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Assign Unit</label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select unit..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Anesthesia" className="text-xs">Anesthesia</SelectItem>
                  <SelectItem value="Surgery" className="text-xs">Surgery</SelectItem>
                  <SelectItem value="Internal Medicine" className="text-xs">Internal Medicine</SelectItem>
                  <SelectItem value="Advanced Practice Providers" className="text-xs">Advanced Practice Providers</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due date */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-1.5 block flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> Due Date
              </label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs"
              />
            </div>

            {/* Module selection */}
            <div>
              <label className="text-xs font-semibold text-foreground mb-2 block">Assign Modules</label>
              <div className="space-y-2">
                {moduleOptions.map((mod) => (
                  <label
                    key={mod.id}
                    className="flex items-center gap-2.5 rounded-lg border border-border px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      checked={selectedModules.includes(mod.id)}
                      onCheckedChange={() => toggleModule(mod.id)}
                    />
                    <span className="text-xs font-medium text-foreground">{mod.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Patient cases selection */}
            {showCases && selectedModules.includes("patient-cases") && (
              <div>
                <label className="text-xs font-semibold text-foreground mb-2 block">Select Patient Cases</label>
                <div className="max-h-[180px] overflow-y-auto rounded-lg border border-border p-2 space-y-1">
                  <button
                    onClick={() => {
                      if (selectedCases.length === patientCasesList.length) {
                        setSelectedCases([]);
                      } else {
                        setSelectedCases([...patientCasesList]);
                      }
                    }}
                    className="text-[10px] font-semibold text-primary hover:underline mb-1"
                  >
                    {selectedCases.length === patientCasesList.length ? "Deselect All" : "Select All"}
                  </button>
                  {patientCasesList.map((caseName) => (
                    <label
                      key={caseName}
                      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={selectedCases.includes(caseName)}
                        onCheckedChange={() => toggleCase(caseName)}
                      />
                      <span className="text-[11px] text-foreground">{caseName}</span>
                    </label>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{selectedCases.length} of {patientCasesList.length} cases selected</p>
              </div>
            )}

            {/* Submit */}
            <Button
              className="w-full gap-2"
              onClick={handleUpload}
              disabled={!file}
            >
              <Upload className="h-4 w-4" />
              Upload & Assign ({selectedModules.length} modules)
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BatchUploadModal;
