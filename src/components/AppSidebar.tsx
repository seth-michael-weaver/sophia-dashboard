import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  KeyRound,
  LogOut,
  ClipboardList,
  Building2,
  Inbox,
  User,
  Settings,
  Bell,
  Mail,
  Lock,
  FileText,
  CheckCircle,
  Save,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { students } from "@/data/mockData";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Students & Analytics", url: "/students", icon: Users },
  { title: "Case Review", url: "/cases", icon: ClipboardList },
  { title: "Inbox", url: "/inbox", icon: Inbox },
  { title: "Licenses & Access", url: "/licenses", icon: KeyRound },
];

const notificationItems = () => {
  const needsAttention = students.filter((s) => s.needsPractice || s.daysRemaining <= 3);
  return needsAttention.map((s) => ({
    id: s.id,
    text: s.needsPractice
      ? `${s.name} needs more practice`
      : s.daysRemaining < 0
      ? `${s.name} is overdue`
      : `${s.name} due in ${s.daysRemaining}d`,
    type: s.daysRemaining < 0 ? "error" : s.needsPractice ? "warning" : "info",
  }));
};

export function AppSidebar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"profile" | "password" | "notifications" | null>(null);

  // Profile state
  const [name, setName] = useState("Dr. Sarah Miller");
  const [email, setEmail] = useState("s.miller@mercygeneral.edu");
  const [affiliation, setAffiliation] = useState("Mercy General Hospital");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [emailFrequency, setEmailFrequency] = useState("weekly");

  const notifications = notificationItems();
  const unreadCount = notifications.length;

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSavePassword = () => {
    setPasswordSaved(true);
    setTimeout(() => { setPasswordSaved(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }, 2000);
  };

  return (
    <Sidebar className="border-none">
      <SidebarHeader className="p-5 pb-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-accent">
            <span className="text-sm font-bold text-sidebar-accent-foreground">S</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight text-sidebar-foreground">
              SOPHIA <span className="text-sidebar-primary">Sync</span>
            </h1>
            <p className="text-[9px] font-medium uppercase tracking-widest text-sidebar-foreground/50">
              CVC Training
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-sidebar-accent/50 px-3 py-2">
          <Building2 className="h-4 w-4 text-sidebar-foreground/60" />
          <div>
            <p className="text-[11px] font-semibold text-sidebar-foreground">Mercy General Hospital</p>
            <p className="text-[9px] text-sidebar-foreground/50">Medical Education Dept.</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild size="lg">
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="!bg-sidebar-accent !text-sidebar-accent-foreground font-semibold"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                      {item.title === "Inbox" && unreadCount > 0 && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-1">
        {/* Notification Bell */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <button className="relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              {unreadCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="end" className="w-80 p-0">
            <div className="p-3 border-b">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <p className="text-[10px] text-muted-foreground">{unreadCount} students need attention</p>
            </div>
            <div className="max-h-[300px] overflow-y-auto">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setNotifOpen(false); navigate("/students", { state: { statusFilter: n.type === "error" ? "Overdue" : "Needs Practice" } }); }}
                  className="flex items-start gap-2.5 px-3 py-2.5 w-full text-left hover:bg-muted/50 transition-colors border-b last:border-b-0"
                >
                  <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.type === "error" ? "bg-destructive" : n.type === "warning" ? "bg-warning" : "bg-info"}`} />
                  <p className="text-xs text-foreground">{n.text}</p>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* User Profile */}
        <Popover open={profileOpen} onOpenChange={(open) => { setProfileOpen(open); if (!open) setSettingsTab(null); }}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/20 text-[10px] font-bold text-sidebar-primary">
                SM
              </div>
              <div className="text-left">
                <p className="text-[11px] font-semibold text-sidebar-foreground">Dr. Sarah Miller</p>
                <p className="text-[9px] text-sidebar-foreground/50">Education Coordinator</p>
              </div>
            </button>
          </PopoverTrigger>
          <PopoverContent side="right" align="end" className="w-[420px] p-0 max-h-[80vh] overflow-y-auto">
            {!settingsTab ? (
              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">SM</div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{name}</p>
                    <p className="text-xs text-muted-foreground">{email}</p>
                    <p className="text-[10px] text-muted-foreground">{affiliation}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs" onClick={() => setSettingsTab("profile")}>
                    <User className="h-3.5 w-3.5" /> Edit Profile
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs" onClick={() => setSettingsTab("password")}>
                    <Lock className="h-3.5 w-3.5" /> Change Password
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-xs" onClick={() => setSettingsTab("notifications")}>
                    <Mail className="h-3.5 w-3.5" /> Email & Report Settings
                  </Button>
                </div>
              </div>
            ) : settingsTab === "profile" ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSettingsTab(null)} className="text-xs text-primary hover:underline">← Back</button>
                  <h3 className="text-sm font-semibold text-foreground">Edit Profile</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Email Address</label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Hospital / Affiliation</label>
                    <Input value={affiliation} onChange={(e) => setAffiliation(e.target.value)} className="text-sm" />
                  </div>
                </div>
                <div className="flex justify-end">
                  {saved ? (
                    <p className="text-xs text-success font-medium flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Saved!</p>
                  ) : (
                    <Button size="sm" onClick={handleSaveProfile} className="gap-2"><Save className="h-3.5 w-3.5" /> Save Changes</Button>
                  )}
                </div>
              </div>
            ) : settingsTab === "password" ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSettingsTab(null)} className="text-xs text-primary hover:underline">← Back</button>
                  <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Current Password</label>
                    <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">New Password</label>
                    <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-1 block">Confirm Password</label>
                    <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="text-sm" />
                  </div>
                </div>
                <div className="flex justify-end">
                  {passwordSaved ? (
                    <p className="text-xs text-success font-medium flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Updated!</p>
                  ) : (
                    <Button size="sm" onClick={handleSavePassword} disabled={!currentPassword || !newPassword || newPassword !== confirmPassword} className="gap-2">
                      <Lock className="h-3.5 w-3.5" /> Update Password
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSettingsTab(null)} className="text-xs text-primary hover:underline">← Back</button>
                  <h3 className="text-sm font-semibold text-foreground">Email & Report Settings</h3>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground mb-1.5 block">Automated Progress Report Frequency</label>
                  <Select value={emailFrequency} onValueChange={setEmailFrequency}>
                    <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-foreground">Sample Progress Report</p>
                  </div>
                  <div className="rounded bg-muted/50 p-3 space-y-2 text-[11px]">
                    <p className="font-semibold text-foreground">SOPHIA Sync — Weekly Progress Report</p>
                    <p className="text-muted-foreground">Period: Feb 6–13, 2026</p>
                    <div className="border-t pt-2 space-y-1">
                      <p className="text-foreground"><strong>System Usage:</strong> 148 active students, 34 active today</p>
                      <p className="text-foreground"><strong>Students Needing Attention:</strong> 6 overdue, 4 need practice</p>
                      <p className="text-foreground"><strong>Common Errors:</strong> Arterial Puncture (23), Through-and-Through (18)</p>
                      <p className="text-foreground"><strong>Avg Walkthrough Progress:</strong> 67%</p>
                    </div>
                    <div className="border-t pt-2">
                      <p className="text-primary font-medium cursor-pointer hover:underline">→ Start New Training Session</p>
                      <p className="text-primary font-medium cursor-pointer hover:underline">→ View Full Dashboard</p>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full">Save Preferences</Button>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-sidebar-accent hover:text-destructive w-full">
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
