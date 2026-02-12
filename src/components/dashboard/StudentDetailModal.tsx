import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type Student } from "@/data/mockData";
import { Flag, Mail, Send, Clock, BookOpen, AlertTriangle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";

interface StudentDetailModalProps {
  student: Student | null;
  open: boolean;
  onClose: () => void;
}

const moduleProgress = [
  { name: "Anatomy Review", score: 92, status: "complete" },
  { name: "Ultrasound Guidance", score: 78, status: "complete" },
  { name: "Femoral Access", score: 65, status: "in-progress" },
  { name: "Subclavian Access", score: 0, status: "not-started" },
  { name: "Advanced Lines", score: 0, status: "not-started" },
];

const StudentDetailModal = ({ student, open, onClose }: StudentDetailModalProps) => {
  const [message, setMessage] = useState("");
  const [showReminder, setShowReminder] = useState(false);
  const [reminderSent, setReminderSent] = useState(false);

  if (!student) return null;

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  const handleSendReminder = () => {
    setReminderSent(true);
    setTimeout(() => {
      setShowReminder(false);
      setReminderSent(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "hsl(152, 69%, 41%)";
    if (score >= 60) return "hsl(38, 92%, 50%)";
    return "hsl(0, 72%, 51%)";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
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

        {/* Module progress chart */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <BookOpen className="h-3.5 w-3.5" /> Module Progress
          </h4>
          <div className="h-[160px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleProgress} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  tick={{ fontSize: 10, fill: "hsl(215, 14%, 46%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(0 0% 100%)",
                    border: "1px solid hsl(214 20% 90%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value}%`, "Score"]}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={14}>
                  {moduleProgress.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" /> Recent Activity
          </h4>
          <div className="space-y-2">
            {[
              { text: `Scored ${student.latestScore} on latest attempt`, time: student.lastActivity, icon: student.latestScore >= 70 ? CheckCircle : AlertTriangle, color: student.latestScore >= 70 ? "text-success" : "text-destructive" },
              { text: `Walkthrough at ${student.walkthroughComplete}%`, time: "ongoing", icon: BookOpen, color: "text-primary" },
              { text: `Verification: ${student.verificationStatus}`, time: "current", icon: CheckCircle, color: student.verificationStatus === "Verified" ? "text-success" : "text-muted-foreground" },
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
            <Button
              variant="outline"
              size="sm"
              className="text-[11px] h-7"
              onClick={() => setShowReminder(!showReminder)}
            >
              {showReminder ? "Cancel" : "Send Reminder"}
            </Button>
          </div>
          {showReminder && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-7 flex-1"
                  onClick={handleSendReminder}
                >
                  📋 Complete Course
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-[10px] h-7 flex-1"
                  onClick={handleSendReminder}
                >
                  🔄 Additional Practice
                </Button>
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
          <div className="flex gap-2">
            <Textarea
              placeholder={`Message ${student.name}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="text-xs min-h-[60px] resize-none"
            />
          </div>
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
