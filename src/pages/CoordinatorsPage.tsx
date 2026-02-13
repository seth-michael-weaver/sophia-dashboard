import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCog, Plus, Trash2, Shield } from "lucide-react";

interface Coordinator {
  id: string;
  name: string;
  email: string;
  assignedArea: string;
}

const areaOptions = [
  "All Areas",
  "Student Progress",
  "Common Errors",
  "Case Difficulty",
  "Training Progress",
  "Anesthesia",
  "Surgery",
  "Internal Medicine",
  "Advanced Practice Providers",
];

const initialCoordinators: Coordinator[] = [
  { id: "1", name: "Dr. Sarah Miller", email: "s.miller@hospital.edu", assignedArea: "Common Errors" },
  { id: "2", name: "Dr. John Adams", email: "j.adams@hospital.edu", assignedArea: "Anesthesia" },
  { id: "3", name: "Nancy Drew, RN", email: "n.drew@hospital.edu", assignedArea: "Training Progress" },
];

const CoordinatorsPage = () => {
  const [coordinators, setCoordinators] = useState<Coordinator[]>(initialCoordinators);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newArea, setNewArea] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (newName && newEmail && newArea) {
      setCoordinators((prev) => [
        ...prev,
        { id: Date.now().toString(), name: newName, email: newEmail, assignedArea: newArea },
      ]);
      setNewName("");
      setNewEmail("");
      setNewArea("");
      setShowAdd(false);
    }
  };

  const handleRemove = (id: string) => {
    setCoordinators((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Education Coordinators</h2>
          <p className="text-sm text-muted-foreground">Assign coordinators to review specific areas</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)} className="gap-2">
          <Plus className="h-4 w-4" /> Add Coordinator
        </Button>
      </div>

      {showAdd && (
        <div className="rounded-xl bg-card p-5 shadow-card space-y-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <UserCog className="h-4 w-4 text-primary" /> New Coordinator
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="Full Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-sm"
            />
            <Input
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="text-sm"
            />
            <Select value={newArea} onValueChange={setNewArea}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Assigned Area" />
              </SelectTrigger>
              <SelectContent>
                {areaOptions.map((area) => (
                  <SelectItem key={area} value={area} className="text-sm">{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button size="sm" onClick={handleAdd} disabled={!newName || !newEmail || !newArea}>Save</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Coordinator</th>
              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
              <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Assigned Area</th>
              <th className="px-3 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"></th>
            </tr>
          </thead>
          <tbody>
            {coordinators.map((coord) => (
              <tr key={coord.id} className="border-b transition-colors hover:bg-muted/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      <Shield className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-foreground">{coord.name}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-muted-foreground">{coord.email}</td>
                <td className="px-3 py-3">
                  <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    {coord.assignedArea}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleRemove(coord.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoordinatorsPage;
