import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  KeyRound,
  LogOut,
  ClipboardList,
  Building2,
  MessageSquare,
  User,
  Settings,
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

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Students & Analytics", url: "/students", icon: Users },
  { title: "Case Review", url: "/cases", icon: ClipboardList },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Licenses & Access", url: "/licenses", icon: KeyRound },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

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
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-1">
        {/* User Profile */}
        <Popover open={profileOpen} onOpenChange={setProfileOpen}>
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
          <PopoverContent side="right" align="end" className="w-64 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                SM
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Dr. Sarah Miller</p>
                <p className="text-xs text-muted-foreground">s.miller@mercygeneral.edu</p>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-3">Mercy General Hospital</p>
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-xs"
                onClick={() => { setProfileOpen(false); navigate("/profile"); }}
              >
                <User className="h-3.5 w-3.5" /> View Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-xs"
                onClick={() => { setProfileOpen(false); navigate("/profile"); }}
              >
                <Settings className="h-3.5 w-3.5" /> Account Settings
              </Button>
            </div>
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
