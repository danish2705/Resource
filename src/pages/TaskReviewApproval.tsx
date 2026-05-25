import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Search,
  ChevronRight,
  User,
  Tag,
  Calendar,
  AlertCircle,
  X,
  Check,
  FileText,
  Users,
  BarChart3,
  Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TaskStatus = "Pending" | "Approved" | "Rejected";

interface TaskRequest {
  id: string;
  taskName: string;
  taskDescription: string;
  project: string;
  taskType: string;
  assignedTo: string;
  assignedRole: string;
  assignedInitials: string;
  assignedColor: string;
  requestedBy: string;
  priority: "High" | "Medium" | "Low";
  sprint: string;
  allocation: number;
  status: TaskStatus;
  timeline: string;
  comments: string;
  submittedDate: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_TASKS: TaskRequest[] = [
  {
    id: "TRQ-001",
    taskName: "API Integration",
    taskDescription:
      "Design and implement RESTful API integration between the legacy system and new microservices architecture. Includes authentication, rate limiting, and error handling.",
    project: "Data Modernization – ASPAC",
    taskType: "Development",
    assignedTo: "Rachel Morgan",
    assignedRole: "Cloud Architect",
    assignedInitials: "RM",
    assignedColor: "#6366f1",
    requestedBy: "Anurag Vaishy",
    priority: "High",
    sprint: "Sprint 3",
    allocation: 100,
    status: "Pending",
    timeline: "Nov 1 – Nov 22, 2024",
    comments:
      "Critical path item. Needs to be completed before UI development begins.",
    submittedDate: "Oct 28, 2024",
  },
  {
    id: "TRQ-002",
    taskName: "Regression Testing",
    taskDescription:
      "Full regression test suite execution covering all core modules after the latest sprint changes. Includes automated and manual test cases.",
    project: "Cloud Migration Phase 2",
    taskType: "Testing",
    assignedTo: "James Whitfield",
    assignedRole: "QA Engineer",
    assignedInitials: "JW",
    assignedColor: "#0ea5e9",
    requestedBy: "Anurag Vaishy",
    priority: "High",
    sprint: "Sprint 4",
    allocation: 75,
    status: "Approved",
    timeline: "Nov 5 – Nov 18, 2024",
    comments: "Aligned with release schedule. Must finish before UAT.",
    submittedDate: "Oct 25, 2024",
  },
  {
    id: "TRQ-003",
    taskName: "Authentication Setup",
    taskDescription:
      "Implement OAuth 2.0 + SAML SSO for enterprise identity provider integration. Covers token management, session handling, and MFA flows.",
    project: "Enterprise Security Platform",
    taskType: "Development",
    assignedTo: "Priya Nair",
    assignedRole: "Security Engineer",
    assignedInitials: "PN",
    assignedColor: "#10b981",
    requestedBy: "Anurag Vaishy",
    priority: "High",
    sprint: "Sprint 2",
    allocation: 100,
    status: "Approved",
    timeline: "Oct 21 – Nov 8, 2024",
    comments: "Dependency for all downstream services. Priority escalated.",
    submittedDate: "Oct 18, 2024",
  },
  {
    id: "TRQ-004",
    taskName: "Security Review",
    taskDescription:
      "Comprehensive security audit of the payment processing module. Includes penetration testing, OWASP compliance check, and vulnerability assessment.",
    project: "FinTech Core Upgrade",
    taskType: "QA",
    assignedTo: "Derek Okafor",
    assignedRole: "Security Analyst",
    assignedInitials: "DO",
    assignedColor: "#f59e0b",
    requestedBy: "Anurag Vaishy",
    priority: "Medium",
    sprint: "Sprint 5",
    allocation: 50,
    status: "Rejected",
    timeline: "Nov 12 – Nov 25, 2024",
    comments:
      "Scope needs clarification. Please resubmit with updated requirements.",
    submittedDate: "Oct 30, 2024",
  },
  {
    id: "TRQ-005",
    taskName: "Database Schema Migration",
    taskDescription:
      "Migrate existing PostgreSQL schema to the new normalized structure. Includes data validation, rollback scripts, and zero-downtime migration strategy.",
    project: "Data Modernization – ASPAC",
    taskType: "Architecture",
    assignedTo: "Sofia Reyes",
    assignedRole: "Data Architect",
    assignedInitials: "SR",
    assignedColor: "#8b5cf6",
    requestedBy: "Anurag Vaishy",
    priority: "High",
    sprint: "Sprint 3",
    allocation: 100,
    status: "Pending",
    timeline: "Nov 4 – Nov 29, 2024",
    comments: "Requires DBA sign-off. Schema diagram attached.",
    submittedDate: "Oct 29, 2024",
  },
  {
    id: "TRQ-006",
    taskName: "CI/CD Pipeline Setup",
    taskDescription:
      "Configure automated build, test, and deployment pipelines using GitHub Actions. Includes staging and production environment configurations.",
    project: "Cloud Migration Phase 2",
    taskType: "Development",
    assignedTo: "Marcus Chen",
    assignedRole: "DevOps Engineer",
    assignedInitials: "MC",
    assignedColor: "#ec4899",
    requestedBy: "Anurag Vaishy",
    priority: "Medium",
    sprint: "Sprint 2",
    allocation: 75,
    status: "Approved",
    timeline: "Oct 28 – Nov 10, 2024",
    comments: "Foundation for all deployment automation.",
    submittedDate: "Oct 20, 2024",
  },
  {
    id: "TRQ-007",
    taskName: "UI Component Library",
    taskDescription:
      "Build reusable Storybook component library with Tailwind CSS. Includes design tokens, accessibility compliance, and documentation.",
    project: "Digital Experience Platform",
    taskType: "Development",
    assignedTo: "Aisha Patel",
    assignedRole: "Frontend Engineer",
    assignedInitials: "AP",
    assignedColor: "#14b8a6",
    requestedBy: "Anurag Vaishy",
    priority: "Medium",
    sprint: "Sprint 4",
    allocation: 100,
    status: "Pending",
    timeline: "Nov 6 – Nov 27, 2024",
    comments: "Design tokens finalized. Ready to begin development.",
    submittedDate: "Oct 31, 2024",
  },
  {
    id: "TRQ-008",
    taskName: "Performance Optimization",
    taskDescription:
      "Profile and optimize critical API endpoints. Target: reduce P95 latency from 800ms to under 200ms using caching, query optimization, and CDN.",
    project: "Enterprise Security Platform",
    taskType: "Development",
    assignedTo: "Thomas Bauer",
    assignedRole: "Backend Engineer",
    assignedInitials: "TB",
    assignedColor: "#f97316",
    requestedBy: "Anurag Vaishy",
    priority: "High",
    sprint: "Sprint 5",
    allocation: 75,
    status: "Rejected",
    timeline: "Nov 10 – Nov 28, 2024",
    comments:
      "Resource conflict with Sprint 4 deliverables. Reschedule to Sprint 6.",
    submittedDate: "Oct 27, 2024",
  },
  {
    id: "TRQ-009",
    taskName: "API Documentation",
    taskDescription:
      "Write comprehensive OpenAPI 3.0 documentation for all public endpoints. Includes code examples, authentication guide, and Postman collection.",
    project: "Data Modernization – ASPAC",
    taskType: "Documentation",
    assignedTo: "Elena Vasquez",
    assignedRole: "Technical Writer",
    assignedInitials: "EV",
    assignedColor: "#64748b",
    requestedBy: "Anurag Vaishy",
    priority: "Low",
    sprint: "Sprint 5",
    allocation: 50,
    status: "Pending",
    timeline: "Nov 15 – Nov 30, 2024",
    comments: "Coordinate with API team for accuracy review.",
    submittedDate: "Nov 1, 2024",
  },
  {
    id: "TRQ-010",
    taskName: "Load Testing",
    taskDescription:
      "Execute load and stress testing scenarios for the payment gateway. Target: 10,000 concurrent users with sub-500ms response times.",
    project: "FinTech Core Upgrade",
    taskType: "Testing",
    assignedTo: "Kevin Strand",
    assignedRole: "QA Lead",
    assignedInitials: "KS",
    assignedColor: "#0284c7",
    requestedBy: "Anurag Vaishy",
    priority: "High",
    sprint: "Sprint 4",
    allocation: 100,
    status: "Approved",
    timeline: "Nov 3 – Nov 20, 2024",
    comments: "Use production-mirror environment for accurate results.",
    submittedDate: "Oct 26, 2024",
  },
  {
    id: "TRQ-011",
    taskName: "Microservices Architecture",
    taskDescription:
      "Design and document the microservices decomposition strategy for the monolithic application. Includes service boundaries, communication patterns, and data ownership.",
    project: "Cloud Migration Phase 2",
    taskType: "Architecture",
    assignedTo: "Rachel Morgan",
    assignedRole: "Cloud Architect",
    assignedInitials: "RM",
    assignedColor: "#6366f1",
    requestedBy: "Anurag Vaishy",
    priority: "High",
    sprint: "Sprint 2",
    allocation: 100,
    status: "Approved",
    timeline: "Oct 22 – Nov 5, 2024",
    comments:
      "Architecture review board approved. Proceed with implementation.",
    submittedDate: "Oct 15, 2024",
  },
  {
    id: "TRQ-012",
    taskName: "Data Validation Framework",
    taskDescription:
      "Build automated data quality validation pipeline. Includes schema checks, referential integrity, business rule validation, and alerting.",
    project: "Data Modernization – ASPAC",
    taskType: "Development",
    assignedTo: "Sofia Reyes",
    assignedRole: "Data Architect",
    assignedInitials: "SR",
    assignedColor: "#8b5cf6",
    requestedBy: "Anurag Vaishy",
    priority: "Medium",
    sprint: "Sprint 4",
    allocation: 75,
    status: "Pending",
    timeline: "Nov 8 – Nov 26, 2024",
    comments: "Blocked until schema migration (TRQ-005) is complete.",
    submittedDate: "Oct 31, 2024",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: TaskStatus }) {
  const config = {
    Pending: {
      cls: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300",
      dot: "bg-amber-500",
    },
    Approved: {
      cls: "bg-green-500/15 text-green-700 border-green-500/30 dark:text-green-300",
      dot: "bg-green-500",
    },
    Rejected: {
      cls: "bg-red-500/15 text-red-700 border-red-500/30 dark:text-red-300",
      dot: "bg-red-500",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  const cls = {
    High: "text-red-600 dark:text-red-400",
    Medium: "text-amber-600 dark:text-amber-400",
    Low: "text-muted-foreground",
  }[priority];
  return (
    <span className={`text-xs font-medium ${cls}`}>{priority} Priority</span>
  );
}

function Avatar({
  initials,
  color,
  size = "sm",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md";
}) {
  const sz = size === "sm" ? "w-7 h-7 text-xs" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

// ─── Details Dialog ───────────────────────────────────────────────────────────

function TaskDetailsDialog({
  task,
  onClose,
}: {
  task: TaskRequest;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {task.taskName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {task.id} · {task.project}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={task.status} />
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground tracking-wider mb-2">
              Description
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              {task.taskDescription}
            </p>
          </div>

          {/* Detail grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Task Type",
                value: task.taskType,
                icon: <Tag className="w-3.5 h-3.5" />,
              },
              {
                label: "Priority",
                value: task.priority,
                icon: <AlertCircle className="w-3.5 h-3.5" />,
              },
              {
                label: "Sprint",
                value: task.sprint,
                icon: <BarChart3 className="w-3.5 h-3.5" />,
              },
              {
                label: "Allocation",
                value: `${task.allocation}%`,
                icon: <Users className="w-3.5 h-3.5" />,
              },
              {
                label: "Timeline",
                value: task.timeline,
                icon: <Calendar className="w-3.5 h-3.5" />,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-muted/40 border border-border rounded-xl p-3"
              >
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  {item.icon}
                  <span className="text-xs font-medium uppercase tracking-wide">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Assigned resource */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Assigned Resource
            </h3>
            <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-3">
              <Avatar
                initials={task.assignedInitials}
                color={task.assignedColor}
                size="md"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {task.assignedTo}
                </p>
                <p className="text-xs text-muted-foreground">
                  {task.assignedRole}
                </p>
              </div>
            </div>
          </div>

          {/* Requested by */}
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Requested By
            </h3>
            <div className="flex items-center gap-3 bg-muted/40 border border-border rounded-xl p-3">
              <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-foreground">AV</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {task.requestedBy}
                </p>
                <p className="text-xs text-muted-foreground">
                  Project Manager · Submitted {task.submittedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Comments */}
          {task.comments && (
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Comments
              </h3>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                <p className="text-sm text-foreground">{task.comments}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Approve Dialog ───────────────────────────────────────────────────────────

function ApproveConfirmDialog({
  task,
  onConfirm,
  onCancel,
}: {
  task: TaskRequest;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground mb-1">
              Approve Task Assignment?
            </h2>
            <p className="text-sm text-muted-foreground">
              You're approving{" "}
              <span className="font-semibold text-foreground">
                {task.taskName}
              </span>{" "}
              assigned to{" "}
              <span className="font-semibold text-foreground">
                {task.assignedTo}
              </span>
              .
            </p>
          </div>
        </div>
        <div className="bg-muted/40 border border-border rounded-xl p-3 mb-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Project:</span>{" "}
          {task.project}
          <br />
          <span className="font-medium text-foreground">Allocation:</span>{" "}
          {task.allocation}%
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg bg-green-500/15 border border-green-500/30 text-sm font-semibold text-green-700 dark:text-green-400 hover:bg-green-500/25 transition-colors"
          >
            Approve Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reject Dialog ────────────────────────────────────────────────────────────

function RejectTaskDialog({
  task,
  onConfirm,
  onCancel,
}: {
  task: TaskRequest;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground mb-1">
              Reject Task Assignment
            </h2>
            <p className="text-sm text-muted-foreground">
              Rejecting{" "}
              <span className="font-semibold text-foreground">
                {task.taskName}
              </span>
            </p>
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
            Reason for Rejection <span className="text-destructive">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError(false);
            }}
            placeholder="Provide a clear reason for rejection..."
            rows={4}
            className={`w-full text-sm px-3 py-2.5 rounded-lg border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-colors ${
              error
                ? "border-destructive"
                : "border-border hover:border-border/80"
            }`}
          />
          {error && (
            <p className="mt-1.5 text-xs text-destructive flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Rejection reason is required.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 transition-colors"
          >
            Reject Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  const cfg =
    type === "success"
      ? {
          cls: "bg-green-500/15 border-green-500/30 text-green-700 dark:text-green-300",
          icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,
        }
      : {
          cls: "bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-300",
          icon: <XCircle className="w-4 h-4 text-red-500" />,
        };

  return (
    <div
      className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl border ${cfg.cls} shadow-2xl text-sm font-medium`}
      style={{ animation: "slideUp 0.2s ease-out" }}
    >
      {cfg.icon}
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TaskReviewApproval() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialTasks: TaskRequest[] = useMemo(() => {
    const stateTasks = location.state?.submittedTasks ?? [];
    return [...stateTasks, ...MOCK_TASKS];
  }, [location.state]);

  const [tasks, setTasks] = useState<TaskRequest[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TaskStatus>("All");
  const [viewTask, setViewTask] = useState<TaskRequest | null>(null);
  const [approveTask, setApproveTask] = useState<TaskRequest | null>(null);
  const [rejectTask, setRejectTask] = useState<TaskRequest | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = () => {
    if (!approveTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === approveTask.id ? { ...t, status: "Approved" } : t,
      ),
    );
    setApproveTask(null);
    showToast("Task approved successfully", "success");
  };

  const handleReject = (reason: string) => {
    if (!rejectTask) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === rejectTask.id
          ? { ...t, status: "Rejected", comments: reason }
          : t,
      ),
    );
    setRejectTask(null);
    showToast("Task rejected", "error");
  };

  const kpi = useMemo(
    () => ({
      pending: tasks.filter((t) => t.status === "Pending").length,
      approved: tasks.filter((t) => t.status === "Approved").length,
      rejected: tasks.filter((t) => t.status === "Rejected").length,
    }),
    [tasks],
  );

  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        const q = search.toLowerCase();
        const matchSearch =
          !search ||
          t.taskName.toLowerCase().includes(q) ||
          t.project.toLowerCase().includes(q) ||
          t.assignedTo.toLowerCase().includes(q);
        const matchStatus = statusFilter === "All" || t.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [tasks, search, statusFilter],
  );

  return (
    <div className="space-y-4">
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Dialogs */}
      {viewTask && (
        <TaskDetailsDialog task={viewTask} onClose={() => setViewTask(null)} />
      )}
      {approveTask && (
        <ApproveConfirmDialog
          task={approveTask}
          onConfirm={handleApprove}
          onCancel={() => setApproveTask(null)}
        />
      )}
      {rejectTask && (
        <RejectTaskDialog
          task={rejectTask}
          onConfirm={handleReject}
          onCancel={() => setRejectTask(null)}
        />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h1 className="text-lg font-semibold text-foreground tracking-tight">
              Task Review
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Project Manager approval for submitted task assignments
            </p>
          </div>
        </div>
      </div>

      {/* ── Workflow Bar ── */}
      <div className="bg-card border border-border rounded-xl px-5 py-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
          Approval Workflow
        </p>
        <div className="flex items-center">
          {/* Step 1 */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
              <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 leading-tight">
                Submitted
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Task assigned
              </p>
            </div>
          </div>

          <div className="flex-1 mx-3 flex items-center gap-1 min-w-0">
            <div className="flex-1 h-px bg-border" />
            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          </div>

          {/* Step 2 */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-tight">
                Pending PM Approval
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Awaiting review
              </p>
            </div>
          </div>

          <div className="flex-1 mx-3 flex items-center gap-1 min-w-0">
            <div className="flex-1 h-px bg-border" />
            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          </div>

          {/* Step 3 */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-3 h-3 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-green-700 dark:text-green-400 leading-tight">
                Approved
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Ready to start
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-3 gap-3">
        {/* Pending */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                Pending PM Approval
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {kpi.pending}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{
                  width: `${tasks.length ? (kpi.pending / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0 tabular-nums">
              {tasks.length
                ? Math.round((kpi.pending / tasks.length) * 100)
                : 0}
              %
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Awaiting your review
          </p>
        </div>

        {/* Approved */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                Approved
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {kpi.approved}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-green-500/15 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all"
                style={{
                  width: `${tasks.length ? (kpi.approved / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0 tabular-nums">
              {tasks.length
                ? Math.round((kpi.approved / tasks.length) * 100)
                : 0}
              %
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Cleared for execution
          </p>
        </div>

        {/* Rejected */}
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider leading-tight">
                Rejected
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {kpi.rejected}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full transition-all"
                style={{
                  width: `${tasks.length ? (kpi.rejected / tasks.length) * 100 : 0}%`,
                }}
              />
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0 tabular-nums">
              {tasks.length
                ? Math.round((kpi.rejected / tasks.length) * 100)
                : 0}
              %
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Returned for revision
          </p>
        </div>
      </div>

      {/* ── Table Card ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-3 border-b border-border flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-foreground">Task Requests</h2>
            <p className="text-xs text-muted-foreground">
              {filtered.length} of {tasks.length} tasks
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search task, project, resource..."
                className="pl-8 pr-3 py-1.5 text-xs bg-card border border-border rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground text-foreground transition-colors hover:border-border/80"
              />
            </div>
            {/* Status filter */}
            <div className="relative">
              <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "All" | TaskStatus)
                }
                className="pl-8 pr-7 py-1.5 text-xs bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground appearance-none cursor-pointer hover:border-border/80 transition-colors"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table
            className="w-full text-sm"
            style={{ tableLayout: "fixed", minWidth: "960px" }}
          >
            <colgroup>
              <col style={{ width: "160px" }} />
              <col style={{ width: "155px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "150px" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "100px" }} />
              <col style={{ width: "155px" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {[
                  "Task",
                  "Project",
                  "Task Type",
                  "Assigned To",
                  "Allocation",
                  "Status",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground tracking-wider whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-10 text-center text-sm text-muted-foreground"
                  >
                    No tasks match your current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((task) => (
                  <tr
                    key={task.id}
                    className="hover:bg-accent/20 transition-colors"
                  >
                    {/* Task */}
                    <td className="px-3 py-2.5">
                      <p className="text-xs font-semibold text-foreground leading-tight truncate">
                        {task.taskName}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <PriorityBadge priority={task.priority} />
                        <span className="text-border">·</span>
                        <span className="text-xs text-muted-foreground truncate">
                          {task.sprint}
                        </span>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="px-3 py-2.5">
                      <p className="text-xs font-medium text-muted-foreground leading-snug line-clamp-2">
                        {task.project}
                      </p>
                    </td>

                    {/* Task Type */}
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-xs font-medium whitespace-nowrap border border-border">
                        {task.taskType}
                      </span>
                    </td>

                    {/* Assigned To */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <Avatar
                          initials={task.assignedInitials}
                          color={task.assignedColor}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {task.assignedTo}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {task.assignedRole}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Allocation */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${task.allocation}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-foreground flex-shrink-0 tabular-nums">
                          {task.allocation}%
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-2.5">
                      <StatusBadge status={task.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewTask(task)}
                          title="View Details"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {task.status === "Pending" && (
                          <>
                            <button
                              onClick={() => setApproveTask(task)}
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg bg-green-500/15 border border-green-500/30 text-green-700 dark:text-green-400 hover:bg-green-500/25 text-xs font-semibold transition-colors flex-shrink-0"
                            >
                              <Check className="w-2.5 h-2.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectTask(task)}
                              className="flex items-center gap-0.5 px-2 py-1 rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors flex-shrink-0"
                            >
                              <X className="w-2.5 h-2.5" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {tasks.length} task requests
          </p>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <User className="w-3 h-3" />
            Only Project Manager approval required
          </span>
        </div>
      </div>
    </div>
  );
}
