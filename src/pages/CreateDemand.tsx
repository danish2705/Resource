import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useActiveValues } from "@/store/useMasterData";
import type { Demand } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// ── types ─────────────────────────────────────────────────────────────────────

export type DemandForm = {
  portfolio: string;
  program: string;
  projectName: string;
  projectRole: string;
  budgetCode: string;
  pillar: string;
  allocationPercent: number;
  status: Demand["status"];
  comments: string;
  identified: boolean;
  estimatedRate: number;
  currentYearForecast: number;
  resourceName: string;
  workstream: string;
  subTeam: string;
  startDate: string;
  endDate: string;
  type: Demand["type"];
  vendorName: string;
  country: string;
  allocation: {
    current: number;
    y2027: number;
    y2028: number;
    y2029: number;
    y2030: number;
  };
  forecast: {
    current: number;
    y2027: number;
    y2028: number;
    y2029: number;
    y2030: number;
  };
};

export const emptyDemand: DemandForm = {
  portfolio: "",
  program: "Enterprise",
  projectName: "",
  projectRole: "",
  budgetCode: "",
  pillar: "",
  allocationPercent: 0,
  status: "Pending",
  comments: "",
  identified: false,
  estimatedRate: 0,
  currentYearForecast: 0,
  resourceName: "",
  workstream: "",
  subTeam: "",
  startDate: "",
  endDate: "",
  type: "Internal",
  vendorName: "",
  country: "Sydney",
  allocation: { current: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
  forecast: { current: 0, y2027: 0, y2028: 0, y2029: 0, y2030: 0 },
};

const ALLOC_YEARS = ["current", "y2027", "y2028", "y2029", "y2030"] as const;
const yearLabel = (k: string) =>
  k === "current" ? "Current Year" : k.replace("y", "");

// ── component ─────────────────────────────────────────────────────────────────

export default function CreateDemand() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("id"); // /demand/create?id=xxx → edit mode

  const { demands, addDemand, updateDemand } = useStore();
  const projects = useActiveValues("projects");
  const pillars = useActiveValues("pillars");
  const roles = useActiveValues("roles");
  const vendors = useActiveValues("vendors");
  const resourceNames = useActiveValues("resources");
  const portfolios = useActiveValues("portfolios");
  const programs = useActiveValues("programs");
  const locationOpts = useActiveValues("countries");

  const [form, setForm] = useState<DemandForm>(emptyDemand);

  // Pre-fill form when editing
  useEffect(() => {
    if (!editId) return;
    const demand = demands.find((d) => d.id === editId);
    if (!demand) return;
    setForm({
      portfolio: demand.portfolio || demand.pillar,
      program: demand.program,
      projectName: demand.projectName,
      projectRole: demand.projectRole,
      budgetCode: demand.budgetCode,
      pillar: demand.pillar,
      allocationPercent: demand.allocationPercent,
      status: demand.status,
      comments: demand.comments,
      identified: demand.identified,
      estimatedRate: demand.estimatedRate,
      currentYearForecast: demand.currentYearForecast,
      resourceName: demand.resourceName,
      workstream: demand.workstream,
      subTeam: demand.subTeam,
      startDate: demand.startDate,
      endDate: demand.endDate,
      type: demand.type as "Internal" | "External",
      vendorName: demand.vendorName,
      country: demand.country,
      allocation: { ...demand.allocation },
      forecast: { ...demand.forecast },
    });
  }, [editId, demands]);

  const handleSave = (submit: boolean) => {
    if (
      !form.projectName ||
      !form.pillar ||
      !form.startDate ||
      !form.endDate ||
      !form.budgetCode
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    const data = {
      ...form,
      status: submit ? ("Pending" as const) : form.status,
    };
    if (editId) {
      updateDemand(editId, data);
      toast.success("Demand updated successfully");
    } else {
      addDemand(data);
      toast.success("Demand created successfully");
    }
    navigate("/demand"); // go back to Demand Summary
  };

  const set = (patch: Partial<DemandForm>) =>
    setForm((f) => ({ ...f, ...patch }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/demand")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <h1 className="text-xl font-semibold">
          {editId ? "Edit Demand" : "Create Demand"}
        </h1>
      </div>

      {/* ── Core Details ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Project Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label>Portfolio *</Label>
            <Select
              value={form.portfolio || portfolios[0]}
              onValueChange={(v) => set({ portfolio: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Portfolio" />
              </SelectTrigger>
              <SelectContent>
                {portfolios.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Program *</Label>
            <Select
              value={form.program}
              onValueChange={(v) => set({ program: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(programs.length ? programs : ["Enterprise"]).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Project Name *</Label>
            <Select
              value={form.projectName}
              onValueChange={(v) => set({ projectName: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Project Role *</Label>
            <Select
              value={form.projectRole}
              onValueChange={(v) => set({ projectRole: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Pillar *</Label>
            <Select
              value={form.pillar}
              onValueChange={(v) => set({ pillar: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Pillar" />
              </SelectTrigger>
              <SelectContent>
                {pillars.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Budget Code *</Label>
            <Input
              value={form.budgetCode}
              onChange={(e) => set({ budgetCode: e.target.value })}
            />
          </div>
          <div>
            <Label>Workstream</Label>
            <Input
              value={form.workstream}
              onChange={(e) => set({ workstream: e.target.value })}
            />
          </div>
          <div>
            <Label>Start Date *</Label>
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => set({ startDate: e.target.value })}
            />
          </div>
          <div>
            <Label>End Date *</Label>
            <Input
              type="date"
              value={form.endDate}
              onChange={(e) => set({ endDate: e.target.value })}
            />
          </div>
          <div className="col-span-2 md:col-span-3">
            <Label>Comments</Label>
            <Textarea
              value={form.comments}
              onChange={(e) => set({ comments: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Allocation ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wide">
            Allocation (%)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-5 gap-3">
          {ALLOC_YEARS.map((k) => (
            <div key={k}>
              <Label className="text-xs">{yearLabel(k)}</Label>
              <Input
                type="number"
                step="0.01"
                value={form.allocation[k]}
                onChange={(e) =>
                  set({
                    allocation: {
                      ...form.allocation,
                      [k]: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Resource ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-primary uppercase tracking-wide">
            Resource
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 pt-5">
            <Label>Identified</Label>
            <Switch
              checked={form.identified}
              onCheckedChange={(v) => set({ identified: v })}
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select
              value={form.type}
              onValueChange={(v) => set({ type: v as Demand["type"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Internal">Internal</SelectItem>
                <SelectItem value="External">External</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Resource Name</Label>
            <Select
              value={form.resourceName || "__none"}
              onValueChange={(v) =>
                set({ resourceName: v === "__none" ? "" : v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">None</SelectItem>
                {resourceNames.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Vendor Name</Label>
            <Select
              value={form.vendorName || "__none"}
              onValueChange={(v) =>
                set({ vendorName: v === "__none" ? "" : v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none">None</SelectItem>
                {vendors.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Estimated Rate</Label>
            <Input
              type="number"
              value={form.estimatedRate}
              onChange={(e) =>
                set({ estimatedRate: parseFloat(e.target.value) || 0 })
              }
            />
          </div>
          <div>
            <Label>Location</Label>
            <Select
              value={form.country || locationOpts[0] || "Sydney"}
              onValueChange={(v) => set({ country: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locationOpts.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Forecast ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-destructive uppercase tracking-wide">
            Forecast
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-5 gap-3">
          {ALLOC_YEARS.map((k) => (
            <div key={k}>
              <Label className="text-xs">{yearLabel(k)}</Label>
              <Input
                type="number"
                value={form.forecast[k]}
                onChange={(e) =>
                  set({
                    forecast: {
                      ...form.forecast,
                      [k]: parseFloat(e.target.value) || 0,
                    },
                  })
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Footer actions ── */}
      <div className="flex justify-end gap-3 pb-6">
        <Button variant="outline" onClick={() => navigate("/demand")}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={() => handleSave(false)}>
          Save Draft
        </Button>
        <Button onClick={() => handleSave(true)}>Submit</Button>
      </div>
    </div>
  );
}
