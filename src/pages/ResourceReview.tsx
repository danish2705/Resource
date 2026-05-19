import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Users,
  AlertCircle,
  CheckCheck,
  Filter,
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────

type ReviewStatus = "Pending" | "Approved" | "Rejected" | "Awaiting Approval";

interface ReviewRequest {
  id: string;
  demandId: string;
  requestedBy: string;
  requestedOn: string;
  project: string;
  resourceName: string;
  projectRole: string;
  portfolio: string;
  pillar: string;
  startDate: string;
  endDate: string;
  type: "Internal" | "External";
  vendorName: string;
  allocationPercent: number;
  estimatedRate: number;
  currentYearForecast: number;
  country: string;
  status: ReviewStatus;
  reviewedOn?: string;
  reviewComment?: string;
  mailSubject: string;
  mailBody: string;
}

// ─── Mock email-triggered review requests ──────────────────────────────────

const mockReviewRequests: ReviewRequest[] = [
  {
    id: "rev-001",
    demandId: "dem-2",
    requestedBy: "Anurag Vaishy",
    requestedOn: "05/12/2027",
    project: "Data Modernization - ASPAC",
    resourceName: "Karthik Dontula",
    projectRole: "Technical Lead",
    portfolio: "Hi-tech",
    pillar: "Hi-tech",
    startDate: "2027-01-01",
    endDate: "2028-12-31",
    type: "Internal",
    vendorName: "",
    allocationPercent: 100,
    estimatedRate: 130,
    currentYearForecast: 270400,
    country: "Australia",
    status: "Pending",
    mailSubject:
      "Resource Review Required: Technical Lead – Data Modernization ASPAC",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review and approval.\n\nProject: Data Modernization - ASPAC\nRole: Technical Lead\nResource: Karthik Dontula\nAllocation: 100%\nPeriod: Jan 2027 – Dec 2028\nEstimated Rate: $130/hr\nForecast (Current Year): $270,400\n\nPlease review the details and approve or decline the request at your earliest convenience.\n\nThank you,\nResource Management System",
  },
  {
    id: "rev-002",
    demandId: "dem-5",
    requestedBy: "Karthik Dontula",
    requestedOn: "05/13/2027",
    project: "QE Automation",
    resourceName: "Ian Lee",
    projectRole: "QA Engineer",
    portfolio: "Retail",
    pillar: "Retail",
    startDate: "2027-03-01",
    endDate: "2027-12-31",
    type: "External",
    vendorName: "Hyqoo",
    allocationPercent: 75,
    estimatedRate: 95,
    currentYearForecast: 148200,
    country: "Germany",
    status: "Pending",
    mailSubject: "Resource Review Required: QA Engineer – QE Automation",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review and approval.\n\nProject: QE Automation\nRole: QA Engineer\nResource: Ian Lee (External – Hyqoo)\nAllocation: 75%\nPeriod: Mar 2027 – Dec 2027\nEstimated Rate: $95/hr\nForecast (Current Year): $148,200\n\nPlease review and take action.\n\nThank you,\nResource Management System",
  },
  {
    id: "rev-003",
    demandId: "dem-10",
    requestedBy: "Adnan Siddiqui",
    requestedOn: "05/14/2027",
    project: "Cloud Enablement",
    resourceName: "Rich Bowers",
    projectRole: "DevOps Engineer",
    portfolio: "Banking",
    pillar: "Banking",
    startDate: "2027-02-01",
    endDate: "2028-06-30",
    type: "Internal",
    vendorName: "",
    allocationPercent: 50,
    estimatedRate: 110,
    currentYearForecast: 114400,
    country: "Sydney",
    status: "Awaiting Approval",
    mailSubject: "Resource Review Required: DevOps Engineer – Cloud Enablement",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review and approval.\n\nProject: Cloud Enablement\nRole: DevOps Engineer\nResource: Rich Bowers\nAllocation: 50%\nPeriod: Feb 2027 – Jun 2028\nEstimated Rate: $110/hr\nForecast (Current Year): $114,400\n\nPlease review and take action.\n\nThank you,\nResource Management System",
  },
  {
    id: "rev-004",
    demandId: "dem-15",
    requestedBy: "Matthew Truelove",
    requestedOn: "05/10/2027",
    project: "Application Support",
    resourceName: "Lindsey Lord",
    projectRole: "Business Analyst",
    portfolio: "Healthcare",
    pillar: "Healthcare",
    startDate: "2027-01-15",
    endDate: "2027-09-30",
    type: "External",
    vendorName: "Collabera",
    allocationPercent: 100,
    estimatedRate: 85,
    currentYearForecast: 176800,
    country: "Poland",
    status: "Approved",
    reviewedOn: "05/11/2027",
    reviewComment: "Resource approved. Fits project requirements well.",
    mailSubject:
      "Resource Review Required: Business Analyst – Application Support",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review.\n\nProject: Application Support\nRole: Business Analyst\nResource: Lindsey Lord (External – Collabera)\nAllocation: 100%\nPeriod: Jan 2027 – Sep 2027\n\nThank you,\nResource Management System",
  },
  {
    id: "rev-005",
    demandId: "dem-20",
    requestedBy: "Jamison Ducey",
    requestedOn: "05/09/2027",
    project: "Data Modernization - ASPAC",
    resourceName: "Kristie Shirkavand",
    projectRole: "Project Manager",
    portfolio: "Life Sciences",
    pillar: "Life Sciences",
    startDate: "2027-04-01",
    endDate: "2028-03-31",
    type: "Internal",
    vendorName: "",
    allocationPercent: 100,
    estimatedRate: 120,
    currentYearForecast: 249600,
    country: "Sydney",
    status: "Rejected",
    reviewedOn: "05/10/2027",
    reviewComment: "Budget constraints — please resubmit for Q3.",
    mailSubject:
      "Resource Review Required: Project Manager – Data Modernization ASPAC",
    mailBody:
      "Hi Manager,\n\nA resource request has been submitted for your review.\n\nProject: Data Modernization - ASPAC\nRole: Project Manager\nResource: Kristie Shirkavand\nAllocation: 100%\n\nThank you,\nResource Management System",
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────

const statusConfig: Record<
  ReviewStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ReactNode;
  }
> = {
  Pending: {
    label: "Pending",
    variant: "secondary",
    icon: <Clock className="h-3 w-3" />,
  },
  "Awaiting Approval": {
    label: "Awaiting Approval",
    variant: "outline",
    icon: <AlertCircle className="h-3 w-3" />,
  },
  Approved: {
    label: "Approved",
    variant: "default",
    icon: <CheckCircle2 className="h-3 w-3" />,
  },
  Rejected: {
    label: "Rejected",
    variant: "destructive",
    icon: <XCircle className="h-3 w-3" />,
  },
};

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

// ─── Summary card ──────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function ResourceReview() {
  const { updateDemand } = useStore();

  const [requests, setRequests] = useState<ReviewRequest[]>(mockReviewRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Detail / action dialog
  const [selected, setSelected] = useState<ReviewRequest | null>(null);
  const [dialogMode, setDialogMode] = useState<"view" | "approve" | "reject">(
    "view",
  );
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Mail preview dialog
  const [mailPreview, setMailPreview] = useState<ReviewRequest | null>(null);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter(
        (r) => r.status === "Pending" || r.status === "Awaiting Approval",
      ).length,
      approved: requests.filter((r) => r.status === "Approved").length,
      rejected: requests.filter((r) => r.status === "Rejected").length,
    }),
    [requests],
  );

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        search === "" ||
        r.resourceName.toLowerCase().includes(search.toLowerCase()) ||
        r.project.toLowerCase().includes(search.toLowerCase()) ||
        r.projectRole.toLowerCase().includes(search.toLowerCase()) ||
        r.requestedBy.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [requests, search, statusFilter]);

  const openAction = (
    req: ReviewRequest,
    mode: "view" | "approve" | "reject",
  ) => {
    setSelected(req);
    setDialogMode(mode);
    setComment("");
  };

  const handleDecision = (decision: "Approved" | "Rejected") => {
    if (!selected) return;
    setSubmitting(true);
    setTimeout(() => {
      const now = new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      setRequests((prev) =>
        prev.map((r) =>
          r.id === selected.id
            ? {
                ...r,
                status: decision,
                reviewedOn: now,
                reviewComment:
                  comment ||
                  (decision === "Approved" ? "Approved." : "Declined."),
              }
            : r,
        ),
      );
      updateDemand(selected.demandId, {
        status: decision,
        comments:
          comment ||
          (decision === "Approved"
            ? "Approved by manager."
            : "Rejected by manager."),
      });
      toast.success(
        `Request ${decision === "Approved" ? "approved" : "rejected"} successfully.`,
      );
      setSelected(null);
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Resource Review
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and action resource requests sent to you for approval.
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Requests"
          value={counts.total}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          color="bg-blue-50"
        />
        <SummaryCard
          label="Pending Review"
          value={counts.pending}
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          color="bg-amber-50"
        />
        <SummaryCard
          label="Approved"
          value={counts.approved}
          icon={<CheckCheck className="h-5 w-5 text-green-600" />}
          color="bg-green-50"
        />
        <SummaryCard
          label="Rejected"
          value={counts.rejected}
          icon={<XCircle className="h-5 w-5 text-red-500" />}
          color="bg-red-50"
        />
      </div>

      {/* Table card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <CardTitle className="text-base font-semibold">Requests</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resource, project, role…"
                  className="pl-8 h-9 w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-44 gap-1">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Awaiting Approval">
                    Awaiting Approval
                  </SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-6">Resource</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Requested On</TableHead>
                  <TableHead>Allocation</TableHead>
                  <TableHead>Forecast</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No requests match your filters.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((req) => {
                  const cfg = statusConfig[req.status];
                  const isPending =
                    req.status === "Pending" ||
                    req.status === "Awaiting Approval";
                  return (
                    <TableRow
                      key={req.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="pl-6 font-medium">
                        <div>{req.resourceName}</div>
                        <div className="text-xs text-muted-foreground">
                          {req.type === "External"
                            ? `External · ${req.vendorName}`
                            : "Internal"}{" "}
                          · {req.country}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{req.project}</TableCell>
                      <TableCell className="text-sm">
                        {req.projectRole}
                      </TableCell>
                      <TableCell className="text-sm">
                        {req.requestedBy}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {req.requestedOn}
                      </TableCell>
                      <TableCell className="text-sm">
                        {req.allocationPercent}%
                      </TableCell>
                      <TableCell className="text-sm">
                        {fmt(req.currentYearForecast)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={cfg.variant}
                          className="flex items-center gap-1 w-fit text-xs"
                        >
                          {cfg.icon}
                          {cfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {/* Mail preview */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 px-2 text-xs"
                            title="View email"
                            onClick={() => setMailPreview(req)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>

                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs text-green-700 border-green-300 hover:bg-green-50 hover:text-green-800"
                                onClick={() => openAction(req, "approve")}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 px-3 text-xs text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                                onClick={() => openAction(req, "reject")}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Decline
                              </Button>
                            </>
                          )}

                          {!isPending && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 px-3 text-xs"
                              onClick={() => openAction(req, "view")}
                            >
                              Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ─── Detail / Action Dialog ─────────────────────────────────────── */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "approve" && "Approve Resource Request"}
              {dialogMode === "reject" && "Decline Resource Request"}
              {dialogMode === "view" && "Request Details"}
            </DialogTitle>
          </DialogHeader>

          {selected && (
            <div className="space-y-5">
              {/* Resource & project info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-3">
                  <DetailRow label="Resource" value={selected.resourceName} />
                  <DetailRow
                    label="Type"
                    value={
                      selected.type === "External"
                        ? `External · ${selected.vendorName}`
                        : "Internal"
                    }
                  />
                  <DetailRow label="Project" value={selected.project} />
                  <DetailRow label="Role" value={selected.projectRole} />
                  <DetailRow
                    label="Portfolio / Pillar"
                    value={`${selected.portfolio} / ${selected.pillar}`}
                  />
                </div>
                <div className="space-y-3">
                  <DetailRow label="Start Date" value={selected.startDate} />
                  <DetailRow label="End Date" value={selected.endDate} />
                  <DetailRow
                    label="Allocation"
                    value={`${selected.allocationPercent}%`}
                  />
                  <DetailRow
                    label="Est. Rate"
                    value={`$${selected.estimatedRate}/hr`}
                  />
                  <DetailRow
                    label="Forecast (Current Year)"
                    value={fmt(selected.currentYearForecast)}
                  />
                </div>
              </div>

              <div className="border-t pt-4 text-sm space-y-2">
                <DetailRow label="Requested By" value={selected.requestedBy} />
                <DetailRow label="Requested On" value={selected.requestedOn} />
                {selected.reviewedOn && (
                  <DetailRow label="Reviewed On" value={selected.reviewedOn} />
                )}
                {selected.reviewComment && (
                  <DetailRow
                    label="Review Comment"
                    value={selected.reviewComment}
                  />
                )}
              </div>

              {/* Comment box for approve / reject */}
              {(dialogMode === "approve" || dialogMode === "reject") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {dialogMode === "approve"
                      ? "Approval comment (optional)"
                      : "Reason for declining"}
                  </label>
                  <Textarea
                    placeholder={
                      dialogMode === "approve"
                        ? "Add any notes…"
                        : "Please provide a reason…"
                    }
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="resize-none"
                  />
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelected(null)}>
              Cancel
            </Button>
            {dialogMode === "approve" && (
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={submitting}
                onClick={() => handleDecision("Approved")}
              >
                {submitting ? "Approving…" : "Confirm Approval"}
              </Button>
            )}
            {dialogMode === "reject" && (
              <Button
                variant="destructive"
                disabled={submitting || comment.trim() === ""}
                onClick={() => handleDecision("Rejected")}
              >
                {submitting ? "Declining…" : "Confirm Decline"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Mail Preview Dialog ────────────────────────────────────────── */}
      <Dialog
        open={!!mailPreview}
        onOpenChange={(o) => !o && setMailPreview(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base">Email Preview</DialogTitle>
          </DialogHeader>
          {mailPreview && (
            <div className="space-y-3 text-sm">
              <div className="bg-muted/40 rounded-md px-4 py-3 space-y-1.5 border">
                <p className="text-muted-foreground text-xs">
                  From:{" "}
                  <span className="text-foreground font-medium">
                    noreply@resourcemgmt.com
                  </span>
                </p>
                <p className="text-muted-foreground text-xs">
                  Subject:{" "}
                  <span className="text-foreground font-medium">
                    {mailPreview.mailSubject}
                  </span>
                </p>
              </div>
              <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground bg-background border rounded-md px-4 py-3">
                {mailPreview.mailBody}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setMailPreview(null)}>
              Close
            </Button>
            {(mailPreview?.status === "Pending" ||
              mailPreview?.status === "Awaiting Approval") && (
              <Button
                onClick={() => {
                  const req = mailPreview!;
                  setMailPreview(null);
                  openAction(req, "approve");
                }}
              >
                Review Request
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Small helper ──────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-44 shrink-0">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
