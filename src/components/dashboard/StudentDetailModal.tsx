import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type Student } from "@/data/mockData";
import { Flag, Mail, Send, Clock, BookOpen, AlertTriangle, CheckCircle, ClipboardList, Edit2, Save, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentDetailModalProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

const units = ["Anesthesia", "Surgery", "Internal Medicine", "Advanced Practice Providers", "Emergency Medicine", "Critical Care", "Pediatrics"];

// Walkthrough is sequential: can't move on until previous is done
const getWalkthroughModules = (overallProgress: number) => {
  // Sequential: Procedural Preparation → Needle Insertion → Catheter Placement
  // Sub-modules within Needle Insertion are also sequential
  const procPrep = Math.min(100, Math.round(overallProgress * 3));
  const procPrepDone = procPrep >= 100;

  const needleOverall = procPrepDone ? Math.min(100, Math.round((overallProgress - 33) * 1.5)) : 0;
  const needleDone = needleOverall >= 100;

  // Sequential sub-modules for needle insertion
  const needleSubProgress = Math.max(0, needleOverall);
  const vesselId = Math.min(100, Math.round(needleSubProgress * 5));
  const needleAsp = vesselId >= 100 ? Math.min(100, Math.round((needleSubProgress - 20) * 6.25)) : 0;
  const needleProbe = needleAsp >= 100 ? Math.min(100, Math.round((needleSubProgress - 40) * 5)) : 0;
  const needleTip = needleProbe >= 100 ? Math.min(100, Math.round((needleSubProgress - 60) * 5)) : 0;
  const accessVein = needleTip >= 100 ? Math.min(100, Math.round((needleSubProgress - 80) * 5)) : 0;

  const catheter = needleDone ? Math.min(100, Math.round((overallProgress - 67) * 3)) : 0;

  return {
    overall: overallProgress,
    proceduralPreparation: procPrep,
    needleInsertion: {
      overall: needleOverall,
      vesselIdentification: vesselId,
      needleAspiration: needleAsp,
      needleProbeAlignment: needleProbe,
      needleTipTracking: needleTip,
      accessVein: accessVein,
    },
    catheterPlacement: catheter,
  };
};

const verificationAttempts: Record<string, { attempts: number; failures: number }> = {
  "1": { attempts: 1, failures: 0 },
  "2": { attempts: 3, failures: 2 },
  "3": { attempts: 0, failures: 0 },
  "4": { attempts: 2, failures: 1 },
  "5": { attempts: 1, failures: 0 },
  "6": { attempts: 0, failures: 0 },
  "7": { attempts: 1, failures: 0 },
  "8": { attempts: 2, failures: 2 },
  "9": { attempts: 2, failures: 1 },
  "10": { attempts: 0, failures: 0 },
  "11": { attempts: 1, failures: 0 },
  "12": { attempts: 0, failures: 0 },
};

const casesCompleted: Record<string, number> = {
  "1": 15, "2": 8, "3": 4, "4": 14, "5": 10,
  "6": 0, "7": 17, "8": 6, "9": 13, "10": 0,
  "11": 9, "12": 3,
};

const studentErrors: Record<string, { error: string; details: string }[]> = {
  "2": [
    { error: "Arterial Puncture", details: "Occurred during Case 6 (Brown, Christina) — failed to identify artery vs vein under ultrasound" },
    { error: "Through-and-Through", details: "Occurred during Case 9 (Castell, Heather) — needle advanced too far" },
    { error: "Excessive Cannulation Attempts", details: "3+ attempts on Case 5 (Johnston, Helena)" },
  ],
  "3": [
    { error: "Guidewire Misplacement", details: "Guidewire advanced into incorrect vessel during Case 3 (Washington, Simone)" },
    { error: "Prolonged Arrhythmia", details: "Guidewire-induced arrhythmia > 30s during Case 14 (Zhang, Colin)" },
  ],
  "6": [
    { error: "Arterial Puncture", details: "Failed vessel identification on Case 15 (Nash, Jeff)" },
    { error: "Failed Cannulation Attempts", details: "Unable to cannulate after multiple attempts on Case 12 (Shoemaker, Ashley)" },
    { error: "Through-and-Through", details: "Needle advanced through posterior wall on Case 6 (Brown, Christina)" },
  ],
  "8": [
    { error: "Excessive Cannulation Attempts", details: "4 attempts on Case 11 (Jacobson, Devin) — thick neck anatomy" },
    { error: "Guidewire Misplacement", details: "Guidewire in subclavian instead of IJ on Case 8 (Sparrow, Timmothy)" },
  ],
  "10": [
    { error: "Arterial Puncture", details: "Punctured carotid during Case 9 (Castell, Heather)" },
    { error: "Prolonged Arrhythmia", details: "Sustained arrhythmia during Case 15 (Nash, Jeff)" },
    { error: "Failed Cannulation Attempts", details: "Could not obtain access on Case 6 (Brown, Christina)" },
  ],
  "12": [
    { error: "Through-and-Through", details: "Posterior wall puncture on Case 3 (Washington, Simone)" },
    { error: "Guidewire Misplacement", details: "Wire advanced into contralateral vessel on Case 17 (Wilson, Alan)" },
  ],
};

const StudentDetailModal = ({ student, open, onClose }: StudentDetailModalProps) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editEmail, setEditEmail] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editSaved, setEditSaved] = useState(false);

  if (!student) return null;

  const modules = getWalkthroughModules(student.walkthroughComplete);
  const verification = verificationAttempts[student.id] || { attempts: 0, failures: 0 };
  const completedCases = casesCompleted[student.id] || 0;
  const errors = studentErrors[student.id] || [];

  const startEdit = () => {
    setEditEmail(`${student.name.toLowerCase().replace(" ", ".")}@mercygeneral.edu`);
    setEditDueDate(student.deadline);
    setEditUnit(student.unit);
    setEditing(true);
  };

  const saveEdit = () => {
    setEditSaved(true);
    setTimeout(() => { setEditSaved(false); setEditing(false); }, 1500);
  };

  const handleSendMessage = () => {
    if (message.trim()) setMessage("");
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => { setShowReminder(false); setReminderSent(false); }, 2000);
  };

  const ProgressRow = ({ label, value, indent = false, locked = false }: { label: string; value: number; indent?: boolean; locked?: boolean }) => (
    <div className={`flex items-center gap-3 ${indent ? "pl-6" : ""}`}>
      <span className={`text-xs flex-shrink-0 ${indent ? "w-[140px]" : "w-[160px] font-medium"} ${locked ? "text-muted-foreground" : "text-foreground"}`}>
        {locked ? "🔒 " : ""}{label}
      </span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full transition-all ${locked ? "bg-muted-foreground/30" : "bg-primary"}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-foreground w-[35px] text-right">{value}%</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {student.avatar}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg">{student.name}</DialogTitle>
              <p className="text-xs text-muted-foreground">{student.unit} · {student.currentModule}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {student.needsPractice && (
                <div className="flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-destructive">
                  <Flag className="h-3 w-3 fill-current" />
                  <span className="text-[10px] font-semibold">Needs Practice</span>
                </div>
              )}
              <Button variant="outline" size="sm" className="text-[10px] h-7 gap-1" onClick={startEdit}>
                <Edit2 className="h-3 w-3" /> Edit
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Edit section */}
        {editing && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-3 mt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-foreground">Edit Student Details</p>
              <button onClick={() => setEditing(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-semibold text-foreground mb-0.5 block">Email</label>
                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} className="text-xs h-8" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground mb-0.5 block">Due Date</label>
                <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className="text-xs h-8" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-foreground mb-0.5 block">Unit</label>
                <Select value={editUnit} onValueChange={setEditUnit}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>{units.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              {editSaved ? (
                <p className="text-[10px] text-success font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Saved!</p>
              ) : (
                <Button size="sm" className="text-xs h-7 gap-1" onClick={saveEdit}><Save className="h-3 w-3" /> Save</Button>
              )}
            </div>
          </div>
        )}

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{student.walkthroughComplete}%</p>
            <p className="text-[10px] text-muted-foreground font-medium">Walkthrough</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className={`text-2xl font-bold ${student.latestScore >= 80 ? "text-success" : student.latestScore >= 60 ? "text-warning" : "text-destructive"}`}>{student.latestScore}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Latest Score</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className={`text-2xl font-bold ${student.daysRemaining < 0 ? "text-destructive" : student.daysRemaining <= 3 ? "text-warning" : "text-success"}`}>{student.daysRemaining < 0 ? "Overdue" : `${student.daysRemaining}d`}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Deadline</p>
          </div>
        </div>

        {/* Why they need practice */}
        {student.needsPractice && errors.length > 0 && (
          <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <h4 className="text-xs font-semibold text-destructive mb-2 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Why This Student Needs Practice
            </h4>
            <div className="space-y-2">
              {errors.map((err, i) => (
                <div key={i} className="rounded bg-background/50 px-3 py-2">
                  <p className="text-xs font-semibold text-destructive">{err.error}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{err.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Walkthrough Module Progress - Sequential */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> CVC Skill Mastery Training <span className="text-[10px] text-muted-foreground font-normal">(sequential — must complete each section before advancing)</span>
          </h4>
          <div className="space-y-2.5 rounded-lg border border-border p-3">
            <ProgressRow label="Overall Progress" value={modules.overall} />
            <div className="border-t pt-2 space-y-2">
              <ProgressRow label="1. Procedural Preparation" value={modules.proceduralPreparation} />
              <div>
                <ProgressRow label="2. Needle Insertion" value={modules.needleInsertion.overall} locked={modules.proceduralPreparation < 100} />
                {modules.proceduralPreparation >= 100 && (
                  <div className="mt-1.5 space-y-1.5 border-l-2 border-primary/20 ml-3">
                    <ProgressRow label="Vessel Identification" value={modules.needleInsertion.vesselIdentification} indent />
                    <ProgressRow label="Needle Aspiration" value={modules.needleInsertion.needleAspiration} indent locked={modules.needleInsertion.vesselIdentification < 100} />
                    <ProgressRow label="Needle & Probe Alignment" value={modules.needleInsertion.needleProbeAlignment} indent locked={modules.needleInsertion.needleAspiration < 100} />
                    <ProgressRow label="Needle Tip Tracking" value={modules.needleInsertion.needleTipTracking} indent locked={modules.needleInsertion.needleProbeAlignment < 100} />
                    <ProgressRow label="Access Vein" value={modules.needleInsertion.accessVein} indent locked={modules.needleInsertion.needleTipTracking < 100} />
                  </div>
                )}
              </div>
              <ProgressRow label="3. Catheter Placement" value={modules.catheterPlacement} locked={modules.needleInsertion.overall < 100} />
            </div>
          </div>
        </div>

        {/* Verification */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Verification of Proficiency
          </h4>
          <div className="rounded-lg border border-border p-3 flex items-center justify-between">
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
              student.verificationStatus === "Verified" ? "bg-success/10 text-success" :
              student.verificationStatus === "In Progress" ? "bg-info/10 text-info" :
              "bg-muted text-muted-foreground"
            }`}>{student.verificationStatus}</span>
            <div className="text-right">
              <p className="text-xs text-foreground"><span className="font-semibold">{verification.attempts}</span> attempt{verification.attempts !== 1 ? "s" : ""}</p>
              {verification.failures > 0 && <p className="text-[10px] text-destructive font-medium">{verification.failures} failed</p>}
            </div>
          </div>
        </div>

        {/* Cases */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <ClipboardList className="h-3.5 w-3.5" /> Patient Cases Completed
          </h4>
          <div className="rounded-lg border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-bold text-foreground">{completedCases}/17</span>
            </div>
            <Progress value={(completedCases / 17) * 100} className="h-2.5" />
          </div>
        </div>

        {/* Email reminder */}
        <div className="mt-4 rounded-lg border border-border p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email Reminders
            </h4>
            <Button variant="outline" size="sm" className="text-[11px] h-7" onClick={() => setShowReminder(!showReminder)}>
              {showReminder ? "Cancel" : "Send Reminder"}
            </Button>
          </div>
          {showReminder && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-[10px] h-7 flex-1" onClick={handleSendReminder}>📋 Complete Course</Button>
                <Button variant="outline" size="sm" className="text-[10px] h-7 flex-1" onClick={handleSendReminder}>🔄 Additional Practice</Button>
              </div>
              {reminderSent && <p className="text-[10px] text-success font-medium flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Reminder sent!</p>}
            </div>
          )}
        </div>

        {/* Message */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Send className="h-3.5 w-3.5" /> Send Message
          </h4>
          <Textarea placeholder={`Message ${student.name}...`} value={message} onChange={(e) => setMessage(e.target.value)} className="text-xs min-h-[60px] resize-none" />
          <div className="flex justify-end mt-2">
            <Button size="sm" className="text-xs" onClick={handleSendMessage} disabled={!message.trim()}>
              <Send className="h-3 w-3 mr-1" /> Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailModal;
