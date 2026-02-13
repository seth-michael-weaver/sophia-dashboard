import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type PatientCase } from "@/data/mockData";

interface CaseDetailModalProps {
  patientCase: PatientCase | null;
  open: boolean;
  onClose: () => void;
}

const difficultyBadge: Record<string, string> = {
  Easy: "bg-success/10 text-success",
  Moderate: "bg-warning/10 text-warning",
  Hard: "bg-destructive/10 text-destructive",
};

const CaseDetailModal = ({ patientCase, open, onClose }: CaseDetailModalProps) => {
  if (!patientCase) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <div className="rounded-lg bg-primary px-4 py-3 -mx-2 -mt-2 mb-2">
            <DialogTitle className="text-lg text-primary-foreground">Case Information</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Name:</p>
            <p className="text-sm text-foreground">{patientCase.patientName}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Race:</p>
            <p className="text-sm text-foreground">{patientCase.race}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-wide">Sex:</p>
              <p className="text-sm text-foreground">{patientCase.sex}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground uppercase tracking-wide">Age:</p>
              <p className="text-sm text-foreground">{patientCase.age}</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Pre-existing Conditions:</p>
            <p className="text-sm text-foreground">{patientCase.preexistingConditions}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-foreground uppercase tracking-wide">Symptoms and Notable Features:</p>
            <p className="text-sm text-foreground">{patientCase.symptoms}</p>
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-xs font-bold text-foreground uppercase tracking-wide mb-2">Performance Metrics</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold text-foreground">{patientCase.avgScore}</p>
                <p className="text-[10px] text-muted-foreground">Avg Score</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${difficultyBadge[patientCase.difficulty]}`}>{patientCase.difficulty}</span>
                <p className="text-[10px] text-muted-foreground mt-1">Difficulty</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold text-success">{100 - patientCase.errorRate}%</p>
                <p className="text-[10px] text-muted-foreground">Pass Rate</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-xl font-bold text-foreground">{patientCase.completions}</p>
                <p className="text-[10px] text-muted-foreground">Completions</p>
              </div>
            </div>
            {patientCase.topErrors.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-1">Top Errors</p>
                <div className="flex flex-wrap gap-1">
                  {patientCase.topErrors.map((e) => (
                    <span key={e} className="inline-block rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-medium text-destructive">{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CaseDetailModal;
