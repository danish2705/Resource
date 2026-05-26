import { useState, useEffect, useMemo } from "react";
import {
  Search, Star, Lock, Unlock, MoreHorizontal, Plus, Filter,
  ChevronDown, LayoutDashboard, Clock, Users, Trash2,
  Edit3, Copy, ArrowUpRight, BarChart2, TrendingUp, X,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface SavedView {
  name: string;
  widgets: { id: string; label: string; checked: boolean; row: number; colSpan: string }[];
  kpiCards: { id: string; label: string; checked: boolean }[];
  active: boolean;
}

interface DashboardCard {
  id: string;
  name: string;
  owner: string;
  ownerInitials: string;
  ownerColor: string;
  ownerAvatar?: string;
  workspace: string;
  workspaceIcon: string;
  isStarred: boolean;
  isLocked: boolean;
  permission: "owner" | "editor" | "viewer";
  lastModified: Date;
  widgetCount: number;
  kpiCount: number;
  previewWidgets: string[];
  isActive: boolean;
  isSharedWithMe?: boolean;
}

// ─── Theme hook ─────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const h = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  const t = dark
    ? {
        pageBg: "#111318", panel: "#1a1d24", card: "#1e2229",
        cardHover: "#242830", border: "#2d3139", inputBg: "#13161c",
        text1: "#f0f2f5", text2: "#9ca3af", text3: "#4b5563",
        sectionLabel: "#3b82f6",
        activeRing: "#3b82f6",
        previewBg: "#13161c",
        previewLine: "#2d3139",
        tagBg: "#1e2a3d", tagText: "#60a5fa",
        starActive: "#f59e0b", starInactive: "#374151",
        dot: "#22c55e",
      }
    : {
        pageBg: "#f7f8fa", panel: "#ffffff", card: "#ffffff",
        cardHover: "#fafbfc", border: "#e5e7eb", inputBg: "#f9fafb",
        text1: "#111827", text2: "#6b7280", text3: "#9ca3af",
        sectionLabel: "#1d4ed8",
        activeRing: "#2563eb",
        previewBg: "#f3f4f6",
        previewLine: "#e5e7eb",
        tagBg: "#eff6ff", tagText: "#2563eb",
        starActive: "#f59e0b", starInactive: "#d1d5db",
        dot: "#16a34a",
      };
  return { dark, t };
}

// ─── Mini Dashboard Preview ──────────────────────────────────────────────────
function DashboardPreview({ widgets, t }: { widgets: string[]; t: any }) {
  const sectionColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];
  const bars = [65, 80, 55, 90, 70, 45, 85, 60, 75];
  return (
    <div style={{
      background: t.previewBg, borderRadius: 8, padding: "12px 10px",
      flex: 1, display: "flex", flexDirection: "column", gap: 6,
      minHeight: 140, overflow: "hidden",
    }}>
      {/* mini KPI row */}
      <div style={{ display: "flex", gap: 4 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 18, borderRadius: 4,
            background: sectionColors[i % sectionColors.length],
            opacity: 0.15 + i * 0.05,
          }} />
        ))}
      </div>
      {/* mini chart rows */}
      <div style={{ display: "flex", gap: 4, flex: 1 }}>
        {[...Array(3)].map((_, col) => (
          <div key={col} style={{
            flex: 1, background: t.panel, borderRadius: 5,
            border: `1px solid ${t.previewLine}`,
            padding: "5px 5px 4px",
            display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 2,
          }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 1.5, height: 32 }}>
              {bars.slice(col * 3, col * 3 + 3).map((h, i) => (
                <div key={i} style={{
                  flex: 1, height: `${h}%`,
                  borderRadius: 2,
                  background: sectionColors[(col + i) % sectionColors.length],
                  opacity: 0.7,
                }} />
              ))}
            </div>
            <div style={{ height: 3, borderRadius: 2, background: t.previewLine }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 22, borderRadius: 4,
            background: t.panel, border: `1px solid ${t.previewLine}`,
            display: "flex", alignItems: "center", padding: "0 4px", gap: 3,
          }}>
            <div style={{ width: 3, height: 10, borderRadius: 1, background: sectionColors[i * 2 % sectionColors.length], opacity: 0.8 }} />
            <div style={{ flex: 1, height: 3, borderRadius: 1, background: t.previewLine }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dashboard Card ──────────────────────────────────────────────────────────
function DashboardCard({
  card, t, onStar, onDelete, onOpen, onDuplicate,
}: {
  card: DashboardCard; t: any;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const relativeTime = (d: Date) => {
    const diff = Date.now() - d.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  };

  return (
    <div
      onClick={() => onOpen(card.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false); }}
      style={{
        background: hovered ? t.cardHover : t.card,
        border: card.isActive
          ? `2px solid ${t.activeRing}`
          : `1px solid ${t.border}`,
        borderRadius: 12,
        cursor: "pointer",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        boxShadow: hovered
          ? "0 8px 30px rgba(0,0,0,0.10)"
          : "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s, transform 0.18s, border-color 0.15s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        position: "relative",
      }}
    >
      {/* Active badge */}
      {card.isActive && (
        <div style={{
          position: "absolute", top: 10, right: 10, zIndex: 2,
          background: t.activeRing, color: "#fff",
          fontSize: 9, fontWeight: 700, letterSpacing: "0.08em",
          padding: "2px 7px", borderRadius: 99,
        }}>ACTIVE</div>
      )}

      {/* Title bar */}
      <div style={{ padding: "14px 14px 10px" }}>
        <div style={{
          fontSize: 13, fontWeight: 650, color: t.text1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          maxWidth: "85%", lineHeight: 1.3,
        }}>
          {card.name}
        </div>
      </div>

      {/* Preview area */}
      <div style={{ padding: "0 10px", display: "flex", flex: 1 }}>
        <DashboardPreview widgets={card.previewWidgets} t={t} />
      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderTop: `1px solid ${t.border}`, marginTop: 10,
      }}>
        {/* Owner / Workspace */}
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 24, height: 24, borderRadius: "50%",
            background: card.ownerColor,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 800, color: "#fff", flexShrink: 0,
          }}>
            {card.ownerInitials}
          </div>
          <span style={{
            fontSize: 11, fontWeight: 600,
            color: t.text2,
            fontStyle: "italic",
            maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {card.owner}
          </span>
        </div>

        {/* Actions */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 6 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Stat pills */}
          <span style={{ fontSize: 9, color: t.text3, background: t.inputBg, padding: "2px 6px", borderRadius: 6, fontWeight: 600 }}>
            {card.widgetCount}W · {card.kpiCount}K
          </span>
          {/* Star */}
          <button
            onClick={() => onStar(card.id)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}
          >
            <Star
              size={14}
              fill={card.isStarred ? t.starActive : "none"}
              color={card.isStarred ? t.starActive : t.starInactive}
            />
          </button>
          {/* Lock */}
          <div style={{ color: t.text3, display: "flex" }}>
            {card.isLocked
              ? <Lock size={13} />
              : <Unlock size={13} />}
          </div>
          {/* Menu */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen(m => !m)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", color: t.text3 }}
            >
              <MoreHorizontal size={15} />
            </button>
            {menuOpen && (
              <div style={{
                position: "absolute", right: 0, bottom: "calc(100% + 6px)",
                background: t.panel, border: `1px solid ${t.border}`,
                borderRadius: 10, padding: "4px 0",
                boxShadow: "0 8px 30px rgba(0,0,0,0.14)",
                zIndex: 50, minWidth: 150,
              }}>
                {[
                  { icon: Edit3, label: "Open & Edit", action: () => onOpen(card.id) },
                  { icon: Copy, label: "Duplicate", action: () => { onDuplicate(card.id); setMenuOpen(false); } },
                  { icon: Star, label: card.isStarred ? "Unstar" : "Star", action: () => { onStar(card.id); setMenuOpen(false); } },
                  { icon: Trash2, label: "Delete", action: () => { onDelete(card.id); setMenuOpen(false); }, danger: true },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    style={{
                      display: "flex", alignItems: "center", gap: 9,
                      width: "100%", padding: "8px 14px",
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 12, fontWeight: 500,
                      color: (item as any).danger ? "#ef4444" : t.text1,
                      textAlign: "left",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.inputBg; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
                  >
                    <item.icon size={13} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Last modified */}
      <div style={{ padding: "0 14px 10px", display: "flex", alignItems: "center", gap: 5 }}>
        <Clock size={10} color={t.text3} />
        <span style={{ fontSize: 10, color: t.text3 }}>{relativeTime(card.lastModified)}</span>
        <span style={{ fontSize: 10, color: t.text3, marginLeft: 6 }}>
          {card.permission === "owner" ? "Owner" : card.permission === "editor" ? "Editor" : "Viewer"}
        </span>
      </div>
    </div>
  );
}

// ─── Seed data — pre-populated from Dashboard.tsx saved views ────────────────
const SEED_CARDS: DashboardCard[] = [
  {
    id: "v-default",
    name: "Default View",
    owner: "Kantharaja M P",
    ownerInitials: "KM",
    ownerColor: "#2563eb",
    workspace: "Resource Management",
    workspaceIcon: "RM",
    isStarred: true,
    isLocked: false,
    permission: "owner",
    lastModified: new Date(Date.now() - 1 * 86400000),
    widgetCount: 12,
    kpiCount: 7,
    previewWidgets: ["capTrendLine","utilDonut","utilDept","allocPortfolio","allocByFn","forecastBar"],
    isActive: true,
    isSharedWithMe: false,
  },
  {
    id: "v-leadership",
    name: "Leadership View",
    owner: "Kantharaja M P",
    ownerInitials: "KM",
    ownerColor: "#2563eb",
    workspace: "Resource Management",
    workspaceIcon: "RM",
    isStarred: false,
    isLocked: true,
    permission: "owner",
    lastModified: new Date(Date.now() - 9 * 86400000),
    widgetCount: 12,
    kpiCount: 7,
    previewWidgets: ["capTrendLine","allocPortfolio","forecastBar"],
    isActive: false,
    isSharedWithMe: false,
  },
  {
    id: "v-myteam",
    name: "My Team View",
    owner: "Kantharaja M P",
    ownerInitials: "KM",
    ownerColor: "#2563eb",
    workspace: "Resource Management",
    workspaceIcon: "RM",
    isStarred: false,
    isLocked: false,
    permission: "owner",
    lastModified: new Date(Date.now() - 12 * 86400000),
    widgetCount: 12,
    kpiCount: 7,
    previewWidgets: ["utilTrend","demandPriority","resourceRisk"],
    isActive: false,
    isSharedWithMe: false,
  },
  {
    id: "v-weekly",
    name: "Weekly Planning",
    owner: "Kantharaja M P",
    ownerInitials: "KM",
    ownerColor: "#2563eb",
    workspace: "Resource Management",
    workspaceIcon: "RM",
    isStarred: true,
    isLocked: false,
    permission: "owner",
    lastModified: new Date(Date.now() - 15 * 86400000),
    widgetCount: 12,
    kpiCount: 7,
    previewWidgets: ["utilDept","staffing","forecastAcc"],
    isActive: false,
    isSharedWithMe: false,
  },
  {
    id: "v-finance",
    name: "Finance View",
    owner: "Kantharaja M P",
    ownerInitials: "KM",
    ownerColor: "#2563eb",
    workspace: "Resource Management",
    workspaceIcon: "RM",
    isStarred: false,
    isLocked: true,
    permission: "editor",
    lastModified: new Date(Date.now() - 30 * 86400000),
    widgetCount: 12,
    kpiCount: 7,
    previewWidgets: ["forecastBar","allocTrend","forecastAcc"],
    isActive: false,
    isSharedWithMe: false,
  }
  
];

// ─── Filter Dropdown ─────────────────────────────────────────────────────────
function FilterDropdown({
  label, options, value, onChange, t,
}: { label: string; options: string[]; value: string; onChange: (v: string) => void; t: any }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          border: `1px solid ${t.border}`, borderRadius: 8,
          padding: "6px 12px", background: t.panel,
          fontSize: 12, fontWeight: 600, color: value !== "All" ? "#2563eb" : t.text2,
          cursor: "pointer",
          boxShadow: open ? "0 0 0 2px rgba(37,99,235,0.15)" : "none",
        }}
      >
        {label} {value !== "All" ? `· ${value}` : ""}
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0,
          background: t.panel, border: `1px solid ${t.border}`,
          borderRadius: 10, padding: "4px 0",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          zIndex: 40, minWidth: 160,
        }}>
          {options.map(o => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              style={{
                display: "block", width: "100%", textAlign: "left",
                padding: "8px 14px", background: "none", border: "none",
                fontSize: 12, fontWeight: o === value ? 700 : 500,
                color: o === value ? "#2563eb" : t.text1, cursor: "pointer",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.inputBg; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "none"; }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Mydashboard() {
  const { dark, t } = useTheme();

  const [cards, setCards] = useState<DashboardCard[]>(SEED_CARDS);
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("All");
  const [permFilter, setPermFilter] = useState("All");
  const [addFilterOpen, setAddFilterOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Check if we arrived from a save action (Dashboard sets window.__newSavedView)
  useEffect(() => {
    const newView = (window as any).__newSavedView as { name: string; widgetCount: number; kpiCount: number } | undefined;
    if (newView) {
      const id = `v-${Date.now()}`;
      setCards(prev => prev.map(c => ({ ...c, isActive: false })).concat({
        id,
        name: newView.name,
        owner: "Kantharaja M P",
        ownerInitials: "KM",
        ownerColor: "#2563eb",
        workspace: "Resource Management",
        workspaceIcon: "RM",
        isStarred: false,
        isLocked: false,
        permission: "owner",
        lastModified: new Date(),
        widgetCount: newView.widgetCount ?? 12,
        kpiCount: newView.kpiCount ?? 7,
        previewWidgets: ["capTrendLine","utilDonut","allocPortfolio","forecastBar","staffing","resourceRisk"],
        isActive: true,
      }));
      delete (window as any).__newSavedView;
      showNotification(`"${newView.name}" saved successfully`);
    }
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleStar   = (id: string) => setCards(prev => prev.map(c => c.id === id ? { ...c, isStarred: !c.isStarred } : c));
  const handleDelete = (id: string) => {
    const card = cards.find(c => c.id === id);
    setCards(prev => prev.filter(c => c.id !== id));
    if (card) showNotification(`"${card.name}" deleted`);
  };
  const handleOpen   = (id: string) => { window.location.href = "/dashboard"; };
  const handleDuplicate = (id: string) => {
    const src = cards.find(c => c.id === id);
    if (!src) return;
    const copy: DashboardCard = { ...src, id: `v-${Date.now()}`, name: `${src.name} (Copy)`, isActive: false, lastModified: new Date() };
    setCards(prev => [...prev, copy]);
    showNotification(`"${copy.name}" created`);
  };

  const filtered = useMemo(() => {
    return cards.filter(c => {
      const q = search.toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !c.owner.toLowerCase().includes(q)) return false;
      if (ownerFilter !== "All" && c.owner !== ownerFilter) return false;
      if (permFilter !== "All" && c.permission !== permFilter.toLowerCase()) return false;
      return true;
    });
  }, [cards, search, ownerFilter, permFilter]);

  const owners = ["All", ...Array.from(new Set(cards.map(c => c.owner)))];
  const perms  = ["All", "Owner", "Editor", "Viewer"];

  return (
    <div style={{
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: t.pageBg, minHeight: "100vh",
      display: "flex", flexDirection: "column",
    }}>
      {/* ── Toast notification ── */}
      {notification && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          background: "#111827", color: "#f9fafb",
          padding: "12px 18px", borderRadius: 10,
          fontSize: 13, fontWeight: 500,
          boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
          display: "flex", alignItems: "center", gap: 10,
          animation: "slideIn 0.25s ease",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
          {notification}
        </div>
      )}

      {/* ── Page Header ── */}
      <div style={{
        background: t.panel, borderBottom: `1px solid ${t.border}`,
        padding: "18px 32px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 800,
            color: t.text1, letterSpacing: "-0.02em",
          }}>
            My Dashboards
          </h1>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: t.text2 }}>
          All your saved dashboard views — open, duplicate, or manage them here.
        </p>
      </div>

      {/* ── Filters Bar ── */}
      <div style={{
        background: t.panel, borderBottom: `1px solid ${t.border}`,
        padding: "10px 32px",
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          border: `1px solid ${t.border}`, borderRadius: 8,
          padding: "6px 12px", background: t.inputBg, minWidth: 240,
        }}>
          <Search size={13} color={t.text3} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search in: My Dashboard"
            style={{
              border: "none", background: "none", outline: "none",
              fontSize: 12, color: t.text1, flex: 1,
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
              <X size={12} color={t.text3} />
            </button>
          )}
        </div>

        <FilterDropdown label="Owner"       options={owners} value={ownerFilter} onChange={setOwnerFilter} t={t} />

        {/* Right side — New Dashboard button */}
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={() => { window.location.href = "/dashboard"; }}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
              border: "none", borderRadius: 9,
              padding: "8px 16px", fontSize: 12, fontWeight: 700,
              color: "#fff", cursor: "pointer",
              boxShadow: "0 2px 10px rgba(37,99,235,0.3)",
              transition: "filter 0.15s, box-shadow 0.15s, transform 0.12s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.filter = "none";
              (e.currentTarget as HTMLButtonElement).style.transform = "none";
            }}
          >
            <Plus size={14} />
            New Dashboard
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          flex: 1,
          padding: "24px 32px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {filtered.length === 0 ? (
          /* Empty state */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              paddingTop: 80,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: "#eff6ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <LayoutDashboard size={28} color="#2563eb" />
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: t.text1,
              }}
            >
              No dashboards found
            </div>

            <div
              style={{
                fontSize: 13,
                color: t.text2,
              }}
            >
              {search
                ? `No results for "${search}"`
                : "Save a dashboard view to see it here."}
            </div>

            <button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              style={{
                marginTop: 8,
                padding: "9px 20px",
                background: "#2563eb",
                color: "#fff",
                border: "none",
                borderRadius: 9,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {/* Create new card */}
            <div
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              style={{
                border: `2px dashed ${t.border}`,
                borderRadius: 12,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: 24,
                cursor: "pointer",
                minHeight: 220,
                color: t.text3,
                transition:
                  "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                (
                  e.currentTarget as HTMLDivElement
                ).style.borderColor = "#2563eb";
                (
                  e.currentTarget as HTMLDivElement
                ).style.color = "#2563eb";
              }}
              onMouseLeave={(e) => {
                (
                  e.currentTarget as HTMLDivElement
                ).style.borderColor = t.border;
                (
                  e.currentTarget as HTMLDivElement
                ).style.color = t.text3;
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  border: `2px dashed currentColor`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Plus size={20} />
              </div>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                New Dashboard
              </span>
            </div>

            {/* Dashboard cards */}
            {filtered.map((card) => (
              <DashboardCard
                key={card.id}
                card={card}
                t={t}
                onStar={handleStar}
                onDelete={handleDelete}
                onOpen={handleOpen}
                onDuplicate={handleDuplicate}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer stats ── */}
      <div style={{
        background: t.panel, borderTop: `1px solid ${t.border}`,
        padding: "10px 32px",
        display: "flex", alignItems: "center", gap: 18,
      }}>
        {[
          { icon: LayoutDashboard, label: "Total Views", value: cards.length },
          { icon: Star, label: "Starred", value: cards.filter(c => c.isStarred).length },
          { icon: TrendingUp, label: "Active", value: cards.filter(c => c.isActive).length },
          { icon: Lock, label: "Locked", value: cards.filter(c => c.isLocked).length },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: t.text2 }}>
            <Icon size={12} color={t.text3} />
            <span>{label}:</span>
            <span style={{ fontWeight: 700, color: t.text1 }}>{value}</span>
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 11, color: t.text3 }}>
          Showing {filtered.length} of {cards.length} views
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}