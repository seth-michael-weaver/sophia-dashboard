import { useState } from "react";
import { students, type Student } from "@/data/mockData";
import { Send, CheckCircle, Search, Filter, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const filters = [
  { value: "All", label: "All Students" },
  { value: "Needs Practice", label: "Needs More Practice" },
  { value: "Not Started", label: "Hasn't Started" },
  { value: "Overdue", label: "Overdue" },
  { value: "Due Soon", label: "Due Soon (≤7 days)" },
];

const templates = [
  { label: "📋 Complete Course", text: "This is a reminder to please complete your CVC training course before your deadline. Log in to SOPHIA Sync to continue your progress." },
  { label: "🔄 Additional Practice", text: "You have been identified as needing additional practice. Please log in and complete the assigned practice modules." },
  { label: "⏰ Deadline Approaching", text: "Your training deadline is approaching. Please make sure to complete all required modules before the due date." },
  { label: "✅ Verification Reminder", text: "Please complete your Verification of Proficiency assessment. This is required to finish the training program." },
];

const MessagesPage = () => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  let filtered = [...students];
  if (search) filtered = filtered.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()));
  if (filter === "Needs Practice") filtered = filtered.filter((s) => s.needsPractice);
  else if (filter === "Not Started") filtered = filtered.filter((s) => s.walkthroughComplete === 0);
  else if (filter === "Overdue") filtered = filtered.filter((s) => s.daysRemaining < 0);
  else if (filter === "Due Soon") filtered = filtered.filter((s) => s.daysRemaining >= 0 && s.daysRemaining <= 7);

  const toggleStudent = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((s) => s.id)));
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => { setSent(false); setMessage(""); setSelected(new Set()); }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Messages</h2>
        <p className="text-sm text-muted-foreground">Send reminders and messages to enrolled students</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Student selection */}
        <div className="lg:col-span-2 rounded-xl bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filter} onValueChange={(v) => { setFilter(v); setSelected(new Set()); }}>
              <SelectTrigger className="h-9 text-xs flex-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {filters.map((f) => <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search students…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9 text-sm" />
          </div>

          <div className="flex items-center justify-between">
            <button onClick={selectAll} className="text-[10px] font-semibold text-primary hover:underline">
              {selected.size === filtered.length ? "Deselect All" : "Select All"} ({filtered.length})
            </button>
            <span className="text-[10px] text-muted-foreground">{selected.size} selected</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-1">
            {filtered.map((s) => (
              <label key={s.id} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${selected.has(s.id) ? "bg-primary/5" : "hover:bg-muted/50"}`}>
                <Checkbox checked={selected.has(s.id)} onCheckedChange={() => toggleStudent(s.id)} />
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">{s.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.unit}</p>
                </div>
                {s.needsPractice && <span className="text-[9px] text-destructive font-semibold">⚠</span>}
                {s.daysRemaining < 0 && <span className="text-[9px] text-destructive font-semibold">Overdue</span>}
              </label>
            ))}
            {filtered.length === 0 && (
              <p className="text-xs text-muted-foreground text-center py-4">No students match this filter.</p>
            )}
          </div>
        </div>

        {/* Message composition */}
        <div className="lg:col-span-3 rounded-xl bg-card p-5 shadow-card space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Compose Message</h3>
          </div>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <CheckCircle className="h-12 w-12 text-success" />
              <p className="text-sm font-semibold text-foreground">Messages sent to {selected.size} student{selected.size !== 1 ? "s" : ""}!</p>
            </div>
          ) : (
            <>
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Quick Templates</p>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((t) => (
                    <Button key={t.label} variant="outline" size="sm" className="text-[10px] h-auto py-2 text-left justify-start" onClick={() => setMessage(t.text)}>
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-foreground mb-1.5">Message</p>
                <Textarea placeholder="Type your message here…" value={message} onChange={(e) => setMessage(e.target.value)} className="text-sm min-h-[140px]" />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Sending to <strong>{selected.size}</strong> student{selected.size !== 1 ? "s" : ""}</p>
                <Button onClick={handleSend} disabled={!message.trim() || selected.size === 0} className="gap-2">
                  <Send className="h-4 w-4" /> Send Message
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
