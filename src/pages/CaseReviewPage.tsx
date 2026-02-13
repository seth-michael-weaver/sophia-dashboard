import { useState } from "react";
import { patientCases, errorTypes } from "@/data/mockData";
import { ClipboardList, ArrowUpDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ErrorAnalytics from "@/components/dashboard/ErrorAnalytics";
import CaseDifficulty from "@/components/dashboard/CaseDifficulty";

type SortKey = "caseName" | "difficulty" | "errorRate" | "avgScore" | "attempts" | "completions";
type SortDir = "asc" | "desc";

const difficultyOrder = { Easy: 1, Moderate: 2, Hard: 3 };
const difficultyBadge = {
  Easy: "bg-success/10 text-success",
  Moderate: "bg-warning/10 text-warning",
  Hard: "bg-destructive/10 text-destructive",
};

const CaseReviewPage = () => {
  const [activeError, setActiveError] = useState("");
  const [searchCase, setSearchCase] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [filterErrorType, setFilterErrorType] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("id" as any);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  let cases = [...patientCases];
  if (searchCase) cases = cases.filter((c) => c.caseName.toLowerCase().includes(searchCase.toLowerCase()));
  if (filterDifficulty !== "All") cases = cases.filter((c) => c.difficulty === filterDifficulty);
  if (filterErrorType !== "All") cases = cases.filter((c) => c.topErrors.includes(filterErrorType));

  cases.sort((a, b) => {
    let cmp = 0;
    if (sortKey === "difficulty") cmp = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    else if (sortKey === "caseName") cmp = a.caseName.localeCompare(b.caseName);
    else cmp = (a[sortKey] as number) - (b[sortKey] as number);
    return sortDir === "asc" ? cmp : -cmp;
  });

  const avgPassRate = cases.length > 0 ? Math.round(cases.reduce((s, c) => s + (100 - c.errorRate), 0) / cases.length) : 0;
  const totalCompletions = cases.reduce((s, c) => s + c.completions, 0);

  const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
    <th
      className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown className={`h-3 w-3 ${sortKey === field ? "text-primary" : "text-muted-foreground/40"}`} />
      </div>
    </th>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground">Case Review</h2>
        <p className="text-sm text-muted-foreground">Common errors, case difficulty, and detailed patient case analysis</p>
      </div>

      {/* Error Analytics & Case Difficulty charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ErrorAnalytics activeError={activeError} onErrorChange={setActiveError} />
        <CaseDifficulty />
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl bg-card p-4 shadow-card text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Total Cases</p>
          <p className="text-2xl font-bold text-foreground">{patientCases.length}</p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Avg Pass Rate</p>
          <p className="text-2xl font-bold text-success">{avgPassRate}%</p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Total Completions</p>
          <p className="text-2xl font-bold text-foreground">{totalCompletions}</p>
        </div>
        <div className="rounded-xl bg-card p-4 shadow-card text-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Error Types Tracked</p>
          <p className="text-2xl font-bold text-foreground">{errorTypes.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search cases…" value={searchCase} onChange={(e) => setSearchCase(e.target.value)} className="pl-9 h-9 text-sm" />
        </div>
        <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
          <SelectTrigger className="w-[130px] h-9 text-xs"><SelectValue placeholder="Difficulty" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Difficulty</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Moderate">Moderate</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterErrorType} onValueChange={setFilterErrorType}>
          <SelectTrigger className="w-[200px] h-9 text-xs"><SelectValue placeholder="Error Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Error Types</SelectItem>
            {errorTypes.map((e) => <SelectItem key={e.name} value={e.name}>{e.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-[11px] text-muted-foreground ml-auto">{cases.length} cases</p>
      </div>

      {/* Case Table */}
      <div className="rounded-xl bg-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <SortHeader label="Case" field="caseName" />
                <SortHeader label="Difficulty" field="difficulty" />
                <SortHeader label="Error Rate" field="errorRate" />
                <SortHeader label="Avg Score" field="avgScore" />
                <th className="px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Top Errors</th>
                <SortHeader label="Pass Rate" field="errorRate" />
                <SortHeader label="Completions" field="completions" />
                <SortHeader label="Attempts" field="attempts" />
              </tr>
            </thead>
            <tbody>
              {cases.map((c) => (
                <tr key={c.id} className="border-b transition-colors hover:bg-muted/30">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <ClipboardList className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-medium text-foreground text-[13px]">{c.caseName}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${difficultyBadge[c.difficulty]}`}>{c.difficulty}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-semibold ${c.errorRate > 30 ? "text-destructive" : c.errorRate > 20 ? "text-warning" : "text-foreground"}`}>{c.errorRate}%</span>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs font-medium text-foreground">{c.avgScore}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.topErrors.map((e) => (
                        <span key={e} className="inline-block rounded bg-destructive/10 px-1.5 py-0.5 text-[9px] font-medium text-destructive">{e}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3"><span className="text-xs font-semibold text-success">{100 - c.errorRate}%</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-foreground">{c.completions}</span></td>
                  <td className="px-3 py-3"><span className="text-xs text-muted-foreground">{c.attempts}</span></td>
                </tr>
              ))}
              {cases.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-8 text-center text-sm text-muted-foreground">No cases match filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CaseReviewPage;
