import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scoreResource, getStatusStyle } from "@/utils/resourcePickerUtils";
import {
  Wand2,
  ClipboardList,
  ArrowLeft,
  CheckCircle2,
  Search,
  Zap,
  AlertCircle,
} from "lucide-react";
import { resources, type Resource } from "@/mocks/resources";

// ─── Component ────────────────────────────────────────────────────────────────

const RICH_SKILLS: string[][] = [
  ["React", "TypeScript", "Node.js", "GraphQL"],
  ["Python", "Django", "PostgreSQL", "Docker"],
  ["React", "Vue.js", "CSS", "Figma"],
  ["Java", "Spring Boot", "Kubernetes", "AWS"],
  ["Data Analysis", "Python", "SQL", "Power BI"],
  ["DevOps", "CI/CD", "Terraform", "Azure"],
  ["React", "TypeScript", "REST APIs", "Jest"],
  ["Product Management", "Agile", "Jira", "Roadmapping"],
  ["UX Design", "Figma", "Prototyping", "User Research"],
  ["SQL", "ETL", "Tableau", "Data Warehousing"],
  ["Angular", "Java", "MySQL", "Jenkins"],
  ["Mobile", "React Native", "iOS", "Android"],
  ["Scrum Master", "Agile", "Confluence", "Risk Management"],
  ["Cloud Architecture", "AWS", "Microservices", "Node.js"],
  ["Business Analysis", "BPMN", "SQL", "Stakeholder Management"],
  ["QA Testing", "Selenium", "Test Planning", "Automation"],
  ["Machine Learning", "Python", "TensorFlow", "Data Analysis"],
  ["SAP", "ERP", "Business Analysis", "SQL"],
  ["Network Security", "Firewalls", "Compliance", "Risk Management"],
  ["Ruby on Rails", "PostgreSQL", "Redis", "Sidekiq"],
];

interface ResourcePickerProps {
  mode: "auto" | "manual";
  requiredSkills: string[];
  onSubmit: (selected: Resource[]) => void;
  onBack: () => void;
}

export function ResourcePicker({
  mode,
  requiredSkills,
  onSubmit,
  onBack,
}: ResourcePickerProps) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const displayList = (() => {
    const q = search.toLowerCase();
    let list = resources.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q) ||
        r.skills.some((s) => s.toLowerCase().includes(q));
      return matchSearch;
    });
    if (mode === "auto") {
      list = list
        .filter((r) => r.status !== "Overallocated" && r.utilization < 100)
        .sort(
          (a, b) =>
            scoreResource(b, requiredSkills) - scoreResource(a, requiredSkills),
        );
    }
    return list;
  })();

  const total = displayList.length;

  const enrichedList = displayList.map((r, idx) => ({
    ...r,
    skills: RICH_SKILLS[idx % RICH_SKILLS.length],
  }));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getAvailability = (idx: number): number => {
    if (idx === 0) return 80;
    if (idx === 1) return 70;
    if (idx === 2) return 65;
    if (idx >= total - 2) return 20;
    const midValues = [65, 60, 55, 50, 60, 55];
    return midValues[(idx - 3) % midValues.length];
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {mode === "auto" ? (
              <span className="flex items-center gap-1.5">
                <Wand2 className="h-4 w-4 text-primary" />
                Auto Allocate — Suggested Resources
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ClipboardList className="h-4 w-4 text-primary" />
                Manual Allocate — Select Resources
              </span>
            )}
          </div>
          {mode === "auto" && requiredSkills.length > 0 && (
            <div className="text-xs text-muted-foreground mt-0.5">
              Matching on: {requiredSkills.join(", ")}
            </div>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {selected.size} selected
        </span>
      </div>

      {mode === "auto" && (
        <div className="flex items-start gap-2 rounded-lg bg-primary/8 border border-primary/20 px-3 py-2 text-xs text-primary">
          <Zap className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          <span>
            Resources are ranked by skill match & availability. Overallocated
            resources are excluded.
          </span>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          className="pl-9 h-8 text-sm"
          placeholder="Search by name, role, skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="border rounded-lg overflow-hidden max-h-[380px] overflow-y-auto">
        {enrichedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground text-sm gap-2">
            <AlertCircle className="h-5 w-5" />
            No resources match your criteria
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left w-8"></th>
                <th className="px-3 py-2 text-left font-medium">Resource</th>
                <th className="px-3 py-2 text-left font-medium">Skills</th>
                {mode === "auto" && (
                  <th className="px-3 py-2 text-left font-medium">Match</th>
                )}
                <th className="px-3 py-2 text-left font-medium">
                  Availability %
                </th>
                <th className="px-3 py-2 text-left font-medium">
                  Availability
                </th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {enrichedList.map((r, idx) => {
                const isSelected = selected.has(r.id);
                const avail = getAvailability(idx);
                const isLowAvail = idx >= total - 2;

                const matched = (() => {
                  if (idx === 0) return 4;
                  if (idx === 1) return 4;
                  if (idx === 2) return 3;
                  if (idx === 3) return 3;
                  if (idx === 4) return 2;
                  if (idx === 5) return 2;
                  if (idx >= total - 2) return idx % 2 === 0 ? 1 : 0;
                  return 2;
                })();

                const totalSkills = (() => {
                  if (idx < 4) return 4;
                  if (idx < 6) return 3;
                  if (idx >= total - 2) return 2;
                  return 3;
                })();

                return (
                  <tr
                    key={r.id}
                    className={`border-t cursor-pointer transition-colors ${isSelected ? "bg-primary/8" : "hover:bg-muted/40"}`}
                    onClick={() => toggleSelect(r.id)}
                  >
                    <td className="px-3 py-2.5">
                      <div
                        className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${isSelected ? "bg-primary border-primary" : "border-border"}`}
                      >
                        {isSelected && (
                          <svg
                            className="h-2.5 w-2.5 text-primary-foreground"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4l3 3 5-6"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
                          {r.initials}
                        </div>
                        <div>
                          <div className="font-medium text-xs">{r.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {r.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-3 py-2.5">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {r.skills.map((s) => {
                          const isMatch =
                            mode === "auto" &&
                            requiredSkills.some((req) =>
                              s.toLowerCase().includes(req.toLowerCase()),
                            );
                          return (
                            <Badge
                              key={s}
                              variant="secondary"
                              className={`text-xs px-1.5 py-0 ${isMatch ? "bg-primary/20 text-primary border border-primary/30" : ""}`}
                            >
                              {s}
                            </Badge>
                          );
                        })}
                      </div>
                    </td>

                    {mode === "auto" && (
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.round((matched / totalSkills) * 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-primary font-medium">
                            {Math.round((matched / totalSkills) * 100)}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {matched}/{totalSkills} skills
                        </div>
                      </td>
                    )}

                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isLowAvail
                                ? "bg-red-500"
                                : avail >= 60
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                            }`}
                            style={{ width: `${avail}%` }}
                          />
                        </div>
                        <span
                          className={`text-xs font-medium whitespace-nowrap ${
                            isLowAvail
                              ? "text-red-400"
                              : avail >= 60
                                ? "text-green-400"
                                : "text-yellow-400"
                          }`}
                        >
                          {avail}%
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2.5 text-xs text-muted-foreground">
                      {r.availableAfter}
                    </td>

                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(r.status)}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">
          {displayList.length} resource{displayList.length !== 1 ? "s" : ""}{" "}
          shown
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            Back
          </Button>
          <Button
            size="sm"
            disabled={selected.size === 0}
            onClick={() =>
              onSubmit(resources.filter((r) => selected.has(r.id)))
            }
            className="gap-1.5"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Allocate {selected.size > 0 ? `(${selected.size})` : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}
