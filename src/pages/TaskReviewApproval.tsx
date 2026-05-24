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
    comments: "Critical path item. Needs to be completed before UI development begins.",
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
    comments: "Scope needs clarification. Please resubmit with updated requirements.",
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
    comments: "Resource conflict with Sprint 4 deliverables. Reschedule to Sprint 6.",
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
    comments: "Architecture review board approved. Proceed with implementation.",
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
    "Pending": {
      cls: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700",
      dot: "bg-amber-500",
    },
    Approved: {
      cls: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700",
      dot: "bg-emerald-500",
    },
    Rejected: {
      cls: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700",
      dot: "bg-red-500",
    },
  }[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  const cls = {
    High: "text-red-600 dark:text-red-400",
    Medium: "text-amber-600 dark:text-amber-400",
    Low: "text-slate-500 dark:text-slate-400",
  }[priority];
  return <span className={`text-xs font-medium ${cls}`}>{priority} Priority</span>;
}

function Avatar({ initials, color, size = "sm" }: { initials: string; color: string; size?: "sm" | "md" }) {
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

function TaskDetailsDialog({ task, onClose }: { task: TaskRequest; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{task.taskName}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{task.id} · {task.project}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={task.status} />
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{task.taskDescription}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Task Type", value: task.taskType, icon: <Tag className="w-3.5 h-3.5" /> },
              { label: "Priority", value: task.priority, icon: <AlertCircle className="w-3.5 h-3.5" /> },
              { label: "Sprint", value: task.sprint, icon: <BarChart3 className="w-3.5 h-3.5" /> },
              { label: "Allocation", value: `${task.allocation}%`, icon: <Users className="w-3.5 h-3.5" /> },
              { label: "Timeline", value: task.timeline, icon: <Calendar className="w-3.5 h-3.5" /> },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 mb-1">
                  {item.icon}
                  <span className="text-xs font-medium uppercase tracking-wide">{item.label}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Assigned Resource</h3>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <Avatar initials={task.assignedInitials} color={task.assignedColor} size="md" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{task.assignedTo}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{task.assignedRole}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Requested By</h3>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
              <div className="w-9 h-9 rounded-full bg-slate-700 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-white">AV</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{task.requestedBy}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Project Manager · Submitted {task.submittedDate}</p>
              </div>
            </div>
          </div>
          {task.comments && (
            <div>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Comments</h3>
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl p-3">
                <p className="text-sm text-slate-700 dark:text-slate-300">{task.comments}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Approve Dialog ───────────────────────────────────────────────────────────

function ApproveConfirmDialog({ task, onConfirm, onCancel }: { task: TaskRequest; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Approve Task Assignment?</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              You're approving <span className="font-semibold text-slate-700 dark:text-slate-200">{task.taskName}</span> assigned to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{task.assignedTo}</span>.
            </p>
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mb-5 text-sm text-slate-600 dark:text-slate-300">
          <span className="font-medium">Project:</span> {task.project}
          <br />
          <span className="font-medium">Allocation:</span> {task.allocation}% 
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold text-white transition-colors">
            Approve Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reject Dialog ────────────────────────────────────────────────────────────

function RejectTaskDialog({ task, onConfirm, onCancel }: { task: TaskRequest; onConfirm: (reason: string) => void; onCancel: () => void }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (!reason.trim()) { setError(true); return; }
    onConfirm(reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Reject Task Assignment</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Rejecting <span className="font-semibold text-slate-700 dark:text-slate-200">{task.taskName}</span>
            </p>
          </div>
        </div>
        <div className="mb-5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Reason for Rejection <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(false); }}
            placeholder="Provide a clear reason for rejection..."
            rows={4}
            className={`w-full text-sm px-3 py-2.5 rounded-xl border ${
              error
                ? "border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-700"
                : "border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
            } text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 resize-none transition-colors`}
          />
          {error && (
            <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Rejection reason is required.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-sm font-semibold text-white transition-colors">
            Reject Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  const cfg = type === "success"
    ? { bg: "bg-emerald-600", icon: <CheckCircle2 className="w-4 h-4" /> }
    : { bg: "bg-red-600", icon: <XCircle className="w-4 h-4" /> };

  return (
    <div className={`fixed bottom-5 right-5 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl ${cfg.bg} text-white shadow-2xl text-sm font-medium`}
      style={{ animation: "slideUp 0.2s ease-out" }}>
      {cfg.icon}
      {message}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TaskReviewApproval() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialTasks: TaskRequest[] = useMemo(() => {
  const stateTasks = location.state?.submittedTasks ?? [];

  // Put newly submitted tasks at the top
  return [...stateTasks, ...MOCK_TASKS];
}, [location.state]);

  const [tasks, setTasks] = useState<TaskRequest[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | TaskStatus>("All");
  const [viewTask, setViewTask] = useState<TaskRequest | null>(null);
  const [approveTask, setApproveTask] = useState<TaskRequest | null>(null);
  const [rejectTask, setRejectTask] = useState<TaskRequest | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleApprove = () => {
    if (!approveTask) return;
    setTasks((prev) => prev.map((t) => t.id === approveTask.id ? { ...t, status: "Approved" } : t));
    setApproveTask(null);
    showToast("Task approved successfully", "success");
  };

  const handleReject = (reason: string) => {
    if (!rejectTask) return;
    setTasks((prev) => prev.map((t) => t.id === rejectTask.id ? { ...t, status: "Rejected", comments: reason } : t));
    setRejectTask(null);
    showToast("Task rejected", "error");
  };

  const kpi = useMemo(() => ({
    pending: tasks.filter((t) => t.status === "Pending").length,
    approved: tasks.filter((t) => t.status === "Approved").length,
    rejected: tasks.filter((t) => t.status === "Rejected").length,
  }), [tasks]);

  const filtered = useMemo(() => tasks.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !search || t.taskName.toLowerCase().includes(q) || t.project.toLowerCase().includes(q) || t.assignedTo.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  }), [tasks, search, statusFilter]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <style>{`
        @keyframes slideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        * { box-sizing: border-box; }
        :root { color-scheme: light dark; }
      `}</style>

      {/* Dialogs */}
      {viewTask && <TaskDetailsDialog task={viewTask} onClose={() => setViewTask(null)} />}
      {approveTask && <ApproveConfirmDialog task={approveTask} onConfirm={handleApprove} onCancel={() => setApproveTask(null)} />}
      {rejectTask && <RejectTaskDialog task={rejectTask} onConfirm={handleReject} onCancel={() => setRejectTask(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="px-5 py-5 space-y-4">

        {/* ── Page Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Task Review</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Project Manager approval for submitted task assignments</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg px-3 py-1.5">
            <User className="w-3.5 h-3.5 text-blue-500" />
            PM approval only
          </div>
        </div>

        {/* ── Workflow Bar ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 px-5 py-3">
          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">Approval Workflow</p>
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-700 dark:text-blue-400 leading-tight">Submitted</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">Task assigned</p>
              </div>
            </div>
            <div className="flex-1 mx-3 flex items-center gap-1 min-w-0">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                <Clock className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 leading-tight">Pending PM Approval</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">Awaiting review</p>
              </div>
            </div>
            <div className="flex-1 mx-3 flex items-center gap-1 min-w-0">
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
              <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 leading-tight">Approved</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-tight">Ready to start</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-3 gap-3">
          {/* Pending */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">Pending PM Approval</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{kpi.pending}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4.5 h-4.5 text-amber-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${tasks.length ? (kpi.pending / tasks.length) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 tabular-nums">
                {tasks.length ? Math.round((kpi.pending / tasks.length) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Awaiting your review</p>
          </div>

          {/* Approved */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">Approved</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{kpi.approved}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full transition-all" style={{ width: `${tasks.length ? (kpi.approved / tasks.length) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 tabular-nums">
                {tasks.length ? Math.round((kpi.approved / tasks.length) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Cleared for execution</p>
          </div>

          {/* Rejected */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider leading-tight">Rejected</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{kpi.rejected}</p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <XCircle className="w-4.5 h-4.5 text-red-400" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${tasks.length ? (kpi.rejected / tasks.length) * 100 : 0}%` }} />
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 flex-shrink-0 tabular-nums">
                {tasks.length ? Math.round((kpi.rejected / tasks.length) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Returned for revision</p>
          </div>
        </div>

        {/* ── Table Card ── */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Card Header */}
          <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Task Requests</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">{filtered.length} of {tasks.length} tasks</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search task, project, resource..."
                  className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 placeholder-slate-400 dark:placeholder-slate-500 text-slate-700 dark:text-slate-200 transition-colors"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "All" | TaskStatus)}
                  className="pl-8 pr-7 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 text-slate-700 dark:text-slate-200 appearance-none cursor-pointer"
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
            <table className="w-full text-sm" style={{ tableLayout: "fixed", minWidth: "960px" }}>
              <colgroup>
                <col style={{ width: "160px" }} />
                <col style={{ width: "155px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "150px" }} />
                <col style={{ width: "140px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "130px" }} />
                <col style={{ width: "155px" }} />
              </colgroup>
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                  {["Task", "Project", "Task Type", "Assigned To", "Allocation", "Status", "Actions"].map((col) => (
                    <th key={col} className="text-left px-3 py-2.5 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-3 py-10 text-center text-sm text-slate-400 dark:text-slate-500">
                      No tasks match your current filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                      {/* Task */}
                      <td className="px-3 py-2.5">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight truncate">{task.taskName}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <PriorityBadge priority={task.priority} />
                          <span className="text-slate-300 dark:text-slate-600">·</span>
                          <span className="text-xs text-slate-400 dark:text-slate-500 truncate">{task.sprint}</span>
                        </div>
                      </td>

                      {/* Project */}
                      <td className="px-3 py-2.5">
                        <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-snug line-clamp-2">{task.project}</p>
                      </td>

                      {/* Task Type */}
                      <td className="px-3 py-2.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium whitespace-nowrap">
                          {task.taskType}
                        </span>
                      </td>

                      {/* Assigned To */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <Avatar initials={task.assignedInitials} color={task.assignedColor} />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{task.assignedTo}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{task.assignedRole}</p>
                          </div>
                        </div>
                      </td>

                      {/* Allocation */}
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${task.allocation}%` }} />
                          </div>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex-shrink-0 tabular-nums">{task.allocation}%</span>
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
                            className="w-6 h-6 rounded-md flex items-center justify-center text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors flex-shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {task.status === "Pending" && (
                            <>
                              <button
                                onClick={() => setApproveTask(task)}
                                className="flex items-center gap-0.5 px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-semibold transition-colors flex-shrink-0"
                              >
                                <Check className="w-2.5 h-2.5" />
                                Approve
                              </button>
                              <button
                                onClick={() => setRejectTask(task)}
                                className="flex items-center gap-0.5 px-2 py-1 rounded-md border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 text-xs font-semibold transition-colors flex-shrink-0"
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
          <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Showing {filtered.length} of {tasks.length} task requests
            </p>
            <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <User className="w-3 h-3" />
              Only Project Manager approval required
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}