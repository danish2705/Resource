import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pencil,
  Trash2,
  X,
  Users,
  Wand2,
  ClipboardList,
  ArrowLeft,
  Save,
  SendHorizonal,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { type Resource } from "@/mocks/resources";
import { useAuth } from "@/auth/useAuth";
import { useStore } from "@/store/useStore";
import { ResourcePicker } from "@/components/resourceComponents/ResourcePicker";;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AssignedResource {
  id: string;
  name: string;
  email: string;
  domain: string;
}

type ModalStep = "list" | "chooseMode" | "picker" | "confirm";

// ─── Component ────────────────────────────────────────────────────────────────

interface ResourceDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  demandId: string;
  projectName: string;
  projectSkills?: string[];
  initialResources?: AssignedResource[];
  userRole?: string;
}

export function ResourceDialog({
  open,
  onOpenChange,
  demandId,
  projectName,
  projectSkills = [],
  initialResources = [],
  userRole,
}: ResourceDialogProps) {
  const empty: Omit<AssignedResource, "id"> = { name: "", email: "", domain: "" };

  const [assignedResources, setAssignedResources] =
    useState<AssignedResource[]>(initialResources);
  const [pickedResources, setPickedResources] = useState<Resource[]>([]);
  const [step, setStep] = useState<ModalStep>("list");
  const [pickerMode, setPickerMode] = useState<"auto" | "manual">("manual");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<AssignedResource, "id">>(empty);
  const [addForm, setAddForm] = useState<Omit<AssignedResource, "id">>(empty);
  const [showAddRow, setShowAddRow] = useState(false);
  const [removeId, setRemoveId] = useState<string | null>(null);
  const [hasPendingChanges, setHasPendingChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const role = userRole;
  const {
    updateDemand,
    updateReviewRequest,
    reviewRequests,
    addReviewRequest,
    demands,
  } = useStore();
  const { user } = useAuth();

  useEffect(() => {
    setAssignedResources(initialResources);
  }, [open, initialResources]);

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("list");
      setHasPendingChanges(false);
    }, 300);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const names = assignedResources.map((r) => r.name).join(", ");
      updateDemand(demandId, {
        resourceName: names,
        resourceCount: assignedResources.length,
        identified: assignedResources.length > 0,
      });
      setIsSaving(false);
      setHasPendingChanges(false);
      toast.success(`Resource allocation saved to ${projectName}`, {
        description: `${assignedResources.length} resource${assignedResources.length !== 1 ? "s" : ""} have been saved to this project. Changes are in draft.`,
        duration: 4000,
      });
    }, 600);
  };

  const handleSaveAndSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const finalResources =
        pickedResources.length > 0
          ? pickedResources.map((r) => r.name).join(", ")
          : assignedResources.map((r) => r.name).join(", ");
      const count =
        pickedResources.length > 0
          ? pickedResources.length
          : assignedResources.length;
      const resourceWord = `${count} resource${count !== 1 ? "s" : ""}`;

      updateDemand(demandId, {
        resourceName: finalResources,
        resourceCount: count,
        identified: count > 0,
        status: "Pending",
      });

      const matchingReview = reviewRequests.find((r) => r.demandId === demandId);
      const dateLabel = new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });

      if (matchingReview) {
        updateReviewRequest(matchingReview.id, {
          resourceName: finalResources,
          resourceCount: count,
          status: "Pending",
          requestedBy: user?.username ?? matchingReview.requestedBy,
          requestedOn: dateLabel,
        });
      } else {
        const demand = demands.find((d) => d.id === demandId);
        if (demand) {
          addReviewRequest({
            id: `rev-${Date.now()}`,
            demandId,
            requestedBy: user?.username ?? "Unknown",
            requestedOn: dateLabel,
            project: demand.projectName,
            resourceName: finalResources,
            projectRole: demand.projectRole || "TBD",
            portfolio: demand.portfolio || "",
            pillar: demand.pillar || "",
            startDate: demand.startDate,
            endDate: demand.endDate,
            type: demand.type,
            vendorName: demand.vendorName || "",
            allocationPercent: demand.allocationPercent,
            estimatedRate: demand.estimatedRate,
            currentYearForecast: demand.currentYearForecast,
            country: demand.country || "Sydney",
            resourceCount: count,
            status: "Pending" as const,
            approvalHistory: [],
            mailSubject: `Resource Review Required: ${demand.projectRole || "Resource"} – ${demand.projectName}`,
            mailBody: `Hi Manager,\n\nA resource request has been submitted.\n\nProject: ${demand.projectName}\nRole: ${demand.projectRole || "TBD"}\nResource: ${finalResources}\n\nThank you,\nResource Management System`,
          });
        }
      }

      setIsSubmitting(false);
      setHasPendingChanges(false);

      if (role === "resource_manager") {
        toast.success("Allocation submitted for approval", {
          description: `An email has been sent to PMO for approval of ${resourceWord} on ${projectName}.`,
          duration: 6000,
        });
      } else if (role === "pmo") {
        toast.success("Allocation submitted for approval", {
          description: `An email has been sent to Resource Manager for approval of ${resourceWord} on ${projectName}.`,
          duration: 6000,
        });
      } else {
        toast.success("Allocation submitted for approval", {
          description: `${resourceWord} submitted. Resource Manager and PMO can now approve on the Allocation Review page.`,
          duration: 6000,
        });
      }

      handleClose();
      navigate("/resource-review");
    }, 800);
  };

  const startEdit = (r: AssignedResource) => {
    setEditingId(r.id);
    setEditForm({ name: r.name, email: r.email, domain: r.domain });
  };

  const saveEdit = () => {
    if (!editForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setAssignedResources((prev) =>
      prev.map((r) => (r.id === editingId ? { ...r, ...editForm } : r)),
    );
    setEditingId(null);
    toast.success("Resource updated");
  };

  const confirmRemove = () => {
    const removed = assignedResources.find((r) => r.id === removeId);
    setAssignedResources((prev) => prev.filter((r) => r.id !== removeId));
    setRemoveId(null);
    setHasPendingChanges(true);
    toast.info(`${removed?.name ?? "Resource"} removed`, {
      description: "Save your changes to confirm this removal.",
    });
  };

  const addResource = () => {
    if (!addForm.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setAssignedResources((prev) => [
      ...prev,
      { id: `r${Date.now()}`, ...addForm },
    ]);
    setAddForm(empty);
    setShowAddRow(false);
    setHasPendingChanges(true);
    toast.info(`${addForm.name} added`, {
      description: "Save your changes to confirm this addition.",
    });
  };

  const handlePickerSubmit = (picked: Resource[]) => {
    setPickedResources(picked);
    setStep("confirm");
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      const newResources: AssignedResource[] = pickedResources.map((r) => ({
        id: `r${Date.now()}-${r.id}`,
        name: r.name,
        email: `${r.name.toLowerCase().replace(" ", ".")}@company.com`,
        domain: r.team,
      }));
      setAssignedResources((prev) => {
        const existingNames = new Set(prev.map((r) => r.name));
        return [
          ...prev,
          ...newResources.filter((r) => !existingNames.has(r.name)),
        ];
      });

      const allNames = [
        ...assignedResources.map((r) => r.name),
        ...newResources.map((r) => r.name),
      ].join(", ");
      const allCount = assignedResources.length + newResources.length;
      updateDemand(demandId, {
        resourceName: allNames,
        resourceCount: allCount,
        identified: allCount > 0,
      });

      setIsSaving(false);
      setHasPendingChanges(false);
      toast.success("Allocation saved as draft", {
        description: `${pickedResources.length} resource${pickedResources.length !== 1 ? "s" : ""} saved to ${projectName}. Changes are in draft and not yet submitted.`,
        duration: 4000,
      });
      handleClose();
    }, 600);
  };

  const modalTitle = () => {
    if (step === "confirm") return `Confirm Allocation — ${projectName}`;
    if (step === "chooseMode") return `Allocate Resource — ${projectName}`;
    if (step === "picker")
      return pickerMode === "auto"
        ? `Auto Allocate — ${projectName}`
        : `Manual Allocate — ${projectName}`;
    return `Resources — ${projectName}`;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className={step === "picker" ? "max-w-4xl" : "max-w-2xl"}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {modalTitle()}
            </DialogTitle>
            {step === "list" && (
              <div className="text-sm text-muted-foreground font-normal">
                {projectName}
              </div>
            )}
          </DialogHeader>

          {/* ── List Step ── */}
          {step === "list" && (
            <>
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">
                        Resource Name
                      </th>
                      <th className="px-3 py-2 text-left font-medium">Email</th>
                      <th className="px-3 py-2 text-left font-medium">Domain</th>
                      <th className="px-3 py-2 text-left font-medium w-28">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignedResources.map((r) =>
                      editingId === r.id ? (
                        <tr key={r.id} className="border-t bg-accent/30">
                          <td className="px-2 py-1.5">
                            <Input
                              className="h-7 text-sm"
                              value={editForm.name}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  name: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <Input
                              className="h-7 text-sm"
                              value={editForm.email}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  email: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5">
                            <Input
                              className="h-7 text-sm"
                              value={editForm.domain}
                              onChange={(e) =>
                                setEditForm((f) => ({
                                  ...f,
                                  domain: e.target.value,
                                }))
                              }
                            />
                          </td>
                          <td className="px-2 py-1.5 flex gap-1">
                            <Button
                              size="sm"
                              className="h-7 text-xs"
                              onClick={saveEdit}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => setEditingId(null)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={r.id} className="border-t hover:bg-muted/40">
                          <td className="px-3 py-2">{r.name}</td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {r.email}
                          </td>
                          <td className="px-3 py-2">
                            <Badge variant="outline" className="text-xs">
                              {r.domain}
                            </Badge>
                          </td>
                          <td className="px-5 py-2">
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => setRemoveId(r.id)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ),
                    )}
                    {showAddRow && (
                      <tr className="border-t bg-accent/20">
                        <td className="px-2 py-1.5">
                          <Input
                            className="h-7 text-sm"
                            placeholder="Name"
                            value={addForm.name}
                            onChange={(e) =>
                              setAddForm((f) => ({
                                ...f,
                                name: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <Input
                            className="h-7 text-sm"
                            placeholder="Email"
                            value={addForm.email}
                            onChange={(e) =>
                              setAddForm((f) => ({
                                ...f,
                                email: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-1.5">
                          <Input
                            className="h-7 text-sm"
                            placeholder="Domain"
                            value={addForm.domain}
                            onChange={(e) =>
                              setAddForm((f) => ({
                                ...f,
                                domain: e.target.value,
                              }))
                            }
                          />
                        </td>
                        <td className="px-2 py-1.5 flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs"
                            onClick={addResource}
                          >
                            Add
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0"
                            onClick={() => {
                              setShowAddRow(false);
                              setAddForm(empty);
                            }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    )}
                    {assignedResources.length === 0 && !showAddRow && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-8 text-center text-muted-foreground text-sm"
                        >
                          No resources assigned yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPickerMode("manual");
                      setStep("picker");
                    }}
                    disabled={showAddRow}
                    className="gap-1.5"
                  >
                    <ClipboardList className="h-3.5 w-3.5" />
                    Manual Allocate
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setPickerMode("auto");
                      setStep("picker");
                    }}
                    disabled={showAddRow}
                    className="gap-1.5"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                    Auto Allocate
                  </Button>
                </div>

                {hasPendingChanges && (
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-amber-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 inline-block" />
                      Unsaved changes
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1.5"
                      disabled={isSaving || isSubmitting}
                      onClick={handleSave}
                    >
                      <Save className="h-3.5 w-3.5" />
                      {isSaving ? "Saving…" : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1.5"
                      disabled={isSaving || isSubmitting}
                      onClick={handleSaveAndSubmit}
                    >
                      <SendHorizonal className="h-3.5 w-3.5" />
                      {isSubmitting ? "Submitting…" : "Save & Submit"}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── Picker Step ── */}
          {step === "picker" && (
            <ResourcePicker
              mode={pickerMode}
              requiredSkills={projectSkills}
              onSubmit={handlePickerSubmit}
              onBack={() => setStep("list")}
            />
          )}

          {/* ── Confirm Step ── */}
          {step === "confirm" && (
            <div className="flex flex-col gap-5 py-2">
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Selected Resources ({pickedResources.length})
                </div>
                <div className="divide-y">
                  {pickedResources.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
                        {r.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{r.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.role} · {r.team}
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-wrap justify-end">
                        {r.skills.slice(0, 2).map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="text-xs px-1.5 py-0"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                      <span
                        className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                          r.status === "Available"
                            ? "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:text-emerald-300"
                            : "bg-blue-500/15 text-blue-700 border border-blue-500/30 dark:text-blue-300"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
                <div className="mt-0.5 h-4 w-4 shrink-0 text-primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    On submit, an email will be sent to:
                  </div>
                  <ul className="mt-1 space-y-0.5 text-muted-foreground text-xs">
                    {role === "resource_manager" ? (
                      <li>
                        • <span className="font-medium text-foreground">PMO</span>{" "}
                        — for approval of this allocation request
                      </li>
                    ) : role === "pmo" ? (
                      <li>
                        •{" "}
                        <span className="font-medium text-foreground">
                          Resource Manager
                        </span>{" "}
                        — for approval of this allocation request
                      </li>
                    ) : (
                      <>
                        <li>
                          •{" "}
                          <span className="font-medium text-foreground">
                            Resource Manager
                          </span>{" "}
                          — to approve the allocation request
                        </li>
                        <li>
                          •{" "}
                          <span className="font-medium text-foreground">PMO</span>{" "}
                          — for capacity planning and tracking
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1.5 text-muted-foreground"
                  onClick={() => setStep("picker")}
                  disabled={isSaving || isSubmitting}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 min-w-[130px]"
                    disabled={isSaving || isSubmitting}
                    onClick={handleSaveDraft}
                  >
                    <Save className="h-3.5 w-3.5" />
                    {isSaving ? "Saving…" : "Save as Draft"}
                  </Button>
                  <Button
                    size="sm"
                    className="gap-1.5 min-w-[130px]"
                    disabled={isSaving || isSubmitting}
                    onClick={handleSaveAndSubmit}
                  >
                    <SendHorizonal className="h-3.5 w-3.5" />
                    {isSubmitting ? "Submitting…" : "Submit for Approval"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!removeId} onOpenChange={() => setRemoveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Resource</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this resource? This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
