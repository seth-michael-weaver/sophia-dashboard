import { useState } from "react";
import { User, Mail, Lock, Building2, Save, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProfilePage = () => {
  const [name, setName] = useState("Dr. Sarah Miller");
  const [email, setEmail] = useState("s.miller@mercygeneral.edu");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const handleSaveProfile = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = () => {
    setPasswordSaved(true);
    setTimeout(() => {
      setPasswordSaved(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Profile & Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl bg-card p-6 shadow-card space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            SM
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{name}</h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3 w-3" /> Mercy General Hospital · Education Coordinator
            </p>
          </div>
        </div>

        <div className="border-t pt-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Account Information
          </h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} className="text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground mb-1 block flex items-center gap-1">
                <Mail className="h-3 w-3" /> Email Address
              </label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="flex justify-end">
            {saved ? (
              <p className="text-xs text-success font-medium flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Saved!</p>
            ) : (
              <Button size="sm" onClick={handleSaveProfile} className="gap-2">
                <Save className="h-3.5 w-3.5" /> Save Changes
              </Button>
            )}
          </div>
        </div>

        <div className="border-t pt-5 space-y-4">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" /> Change Password
          </h4>
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
              <label className="text-xs font-semibold text-foreground mb-1 block">Confirm New Password</label>
              <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="text-sm" />
            </div>
          </div>
          <div className="flex justify-end">
            {passwordSaved ? (
              <p className="text-xs text-success font-medium flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Password updated!</p>
            ) : (
              <Button size="sm" onClick={handleChangePassword} disabled={!currentPassword || !newPassword || newPassword !== confirmPassword} className="gap-2">
                <Lock className="h-3.5 w-3.5" /> Update Password
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
