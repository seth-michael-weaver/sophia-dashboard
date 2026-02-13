import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type Student } from "@/data/mockData";
import { Flag, Mail, Send, Clock, BookOpen, AlertTriangle, CheckCircle, ClipboardList } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StudentDetailModalProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

// Walkthrough sub-modules based on CVC training curriculum
const getWalkthroughModules = (overallProgress: number) => {
  const scale = (base: number) => Math.min(100, Math.max(0, Math.round(base)));
  return {
    overall: overallProgress,
    proceduralPreparation: scale(overallProgress * 1.15),
    needleInsertion: {
      overall: scale(overallProgress * 1.05),
      vesselIdentification: scale(overallProgress * 1.2),
      needleAspiration: scale(overallProgress * 1.1),
      needleProbeAlignment: scale(overallProgress * 1.05),
      needleTipTracking: scale(overallProgress * 0.95),
      accessVein: scale(overallProgress * 0.9),
    },
    catheterPlacement: scale(Math.max(0, overallProgress - 15)),
  };
};

// Mock verification attempts
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

// Mock cases completed
const casesCompleted: Record<string, number> = {
  "1": 15, "2": 8, "3": 4, "4": 14, "5": 10,
  "6": 0, "7": 17, "8": 6, "9": 13, "10": 0,
  "11": 9, "12": 3,
};

const StudentDetailModal = ({ student, open, onClose }: StudentDetailModalProps) => {
  const [message, setMessage] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  if (!student) return null;

  const modules = getWalkthroughModules(student.walkthroughComplete);
  const verification = verificationAttempts[student.id] || { attempts: 0, failures: 0 };
  const completedCases = casesCompleted[student.id] || 0;

  const handleSendMessage = () => {
    if (message.trim()) setMessage("");
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => { setShowReminder(false); setReminderSent(false); }, 2000);
  };

  const ProgressRow = ({ label, value, indent = false }: { label: string; value: number; indent?: boolean }) => (
    <div className={`flex items-center gap-3 ${indent ? "pl-6" : ""}`}>
      <span className={`text-xs text-foreground flex-shrink-0 ${indent ? "w-[140px]" : "w-[160px] font-medium"}`}>{label}</span>
      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${value}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-foreground w-[35px] text-right">{value}%</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {student.avatar}
            </div>
            <div>
              <DialogTitle className="text-lg">{student.name}</DialogTitle>
              <p className="text-xs text-muted-foreground">{student.unit} · {student.currentModule}</p>
            </div>
            {student.needsPractice && (
              <div className="ml-auto flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-1 text-destructive">
                <Flag className="h-3 w-3 fill-current" />
                <span className="text-[10px] font-semibold">Needs Practice</span>
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{student.walkthroughComplete}%</p>
            <p className="text-[10px] text-muted-foreground font-medium">Walkthrough</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className={`text-2xl font-bold ${
              student.latestScore >= 80 ? "text-success" : student.latestScore >= 60 ? "text-warning" : "text-destructive"
            }`}>{student.latestScore}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Latest Score</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3 text-center">
            <p className={`text-2xl font-bold ${
              student.daysRemaining < 0 ? "text-destructive" : student.daysRemaining <= 3 ? "text-warning" : "text-success"
            }`}>{student.daysRemaining < 0 ? "Overdue" : `${student.daysRemaining}d`}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Deadline</p>
          </div>
        </div>

        {/* Walkthrough Module Progress */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> Walkthrough Module Progress
          </h4>
          <div className="space-y-2.5 rounded-lg border border-border p-3">
            <ProgressRow label="CVC Skill Mastery Training" value={modules.overall} />
            <div className="border-t pt-2 space-y-2">
              <ProgressRow label="Procedural Preparation" value={modules.proceduralPreparation} />
              <div>
                <ProgressRow label="Needle Insertion" value={modules.needleInsertion.overall} />
                <div className="mt-1.5 space-y-1.5 border-l-2 border-primary/20 ml-3">
                  <ProgressRow label="Vessel Identification" value={modules.needleInsertion.vesselIdentification} indent />
                  <ProgressRow label="Needle Aspiration" value={modules.needleInsertion.needleAspiration} indent />
                  <ProgressRow label="Needle & Probe Alignment" value={modules.needleInsertion.needleProbeAlignment} indent />
                  <ProgressRow label="Needle Tip Tracking" value={modules.needleInsertion.needleTipTracking} indent />
                  <ProgressRow label="Access Vein" value={modules.needleInsertion.accessVein} indent />
                </div>
              </div>
              <ProgressRow label="Catheter Placement" value={modules.catheterPlacement} />
            </div>
          </div>
        </div>

        {/* Verification of Proficiency */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" /> Verification of Proficiency
          </h4>
          <div className="rounded-lg border border-border p-3 flex items-center justify-between">
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                student.verificationStatus === "Verified" ? "bg-success/10 text-success" :
                student.verificationStatus === "In Progress" ? "bg-info/10 text-info" :
                "bg-muted text-muted-foreground"
              }`}>
                {student.verificationStatus}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-foreground">
                <span className="font-semibold">{verification.attempts}</span> attempt{verification.attempts !== 1 ? "s" : ""}
              </p>
              {verification.failures > 0 && (
                <p className="text-[10px] text-destructive font-medium">
                  {verification.failures} failed attempt{verification.failures !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Cases Completed */}
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
            <p className="text-[10px] text-muted-foreground mt-1">{Math.round((completedCases / 17) * 100)}% of patient cases completed</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Recent Activity
          </h4>
          <div className="space-y-2">
            {[
              { text: `Scored ${student.latestScore} on latest attempt`, time: student.lastActivity, icon: student.latestScore >= 70 ? CheckCircle : AlertTriangle, color: student.latestScore >= 70 ? "text-success" : "text-destructive" },
              { text: `Walkthrough at ${student.walkthroughComplete}%`, time: "ongoing", icon: BookOpen, color: "text-primary" },
              { text: `Completed ${completedCases} of 17 patient cases`, time: "current", icon: ClipboardList, color: "text-primary" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg bg-muted/30 px-3 py-2">
                <item.icon className={`h-3.5 w-3.5 shrink-0 ${item.color}`} />
                <p className="text-xs text-foreground flex-1">{item.text}</p>
                <span className="text-[10px] text-muted-foreground">{item.time}</span>
              </div>
            ))}
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
              {reminderSent && (
                <p className="text-[10px] text-success font-medium flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> Reminder sent to {student.name}
                </p>
              )}
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
