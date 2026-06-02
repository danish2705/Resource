import { useState, useCallback } from "react";
import { useAuth } from "@/auth/useAuth";

export interface WidgetConfig {
  id: string;
  label: string;
  checked: boolean;
  row: number;
  order?: number;
}

export interface KpiConfig {
  id: string;
  checked: boolean;
}

export interface DashboardConfig {
  widgets: WidgetConfig[];
  kpiCards: KpiConfig[];
  savedAt?: string;
}

function getStorageKey(userId: string, persona: string) {
  return `dashboard-config:${userId}:${persona}`;
}

export function useDashboardConfig(
  persona: string,
  defaultWidgets: WidgetConfig[],
  defaultKpiIds: string[]
) {
  const { user } = useAuth();
  const userId = user?.id ?? "anonymous";
  const storageKey = getStorageKey(userId, persona);

  function loadFromStorage(): DashboardConfig | null {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      return JSON.parse(raw) as DashboardConfig;
    } catch {
      return null;
    }
  }

  function mergeWithDefaults(saved: DashboardConfig | null, defaultW: WidgetConfig[], defaultKIds: string[]) {
    if (!saved) {
      return {
        widgets: defaultW.map((w, i) => ({ ...w, order: i })),
        kpiCards: defaultKIds.map((id) => ({ id, checked: true })),
      };
    }
    // Merge: for any widget not in saved, add it as checked (new widgets added after save)
    const savedWidgetMap = new Map(saved.widgets.map((w) => [w.id, w]));
    const widgets = defaultW
      .map((w, i) => {
        const s = savedWidgetMap.get(w.id);
        return s ? { ...w, checked: s.checked, order: s.order ?? i } : { ...w, order: i };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const savedKpiMap = new Map(saved.kpiCards.map((k) => [k.id, k]));
    const kpiCards = defaultKIds.map((id) => {
      const s = savedKpiMap.get(id);
      return { id, checked: s ? s.checked : true };
    });

    return { widgets, kpiCards };
  }

  const saved = loadFromStorage();
  const merged = mergeWithDefaults(saved, defaultWidgets, defaultKpiIds);

  const [widgets, setWidgets] = useState<WidgetConfig[]>(merged.widgets);
  const [kpiCards, setKpiCards] = useState<KpiConfig[]>(merged.kpiCards);

  const saveConfig = useCallback(
    (ws: WidgetConfig[], kpis: KpiConfig[]) => {
      const config: DashboardConfig = {
        widgets: ws.map((w, i) => ({ ...w, order: i })),
        kpiCards: kpis,
        savedAt: new Date().toISOString(),
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(config));
      } catch {
        // storage full or unavailable
      }
    },
    [storageKey]
  );

  const resetConfig = useCallback(() => {
    const freshWidgets = defaultWidgets.map((w, i) => ({ ...w, order: i }));
    const freshKpis = defaultKpiIds.map((id) => ({ id, checked: true }));
    setWidgets(freshWidgets);
    setKpiCards(freshKpis);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }, [storageKey, defaultWidgets, defaultKpiIds]);

  const toggleWidget = useCallback((id: string) => {
    setWidgets((ws) => ws.map((w) => (w.id === id ? { ...w, checked: !w.checked } : w)));
  }, []);

  const toggleKpi = useCallback((id: string) => {
    setKpiCards((ks) => ks.map((k) => (k.id === id ? { ...k, checked: !k.checked } : k)));
  }, []);

  const reorderWidgets = useCallback((fromIndex: number, toIndex: number) => {
    setWidgets((ws) => {
      const arr = [...ws];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr.map((w, i) => ({ ...w, order: i }));
    });
  }, []);

  const reorderKpis = useCallback((fromIndex: number, toIndex: number) => {
    setKpiCards((ks) => {
      const arr = [...ks];
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      return arr;
    });
  }, []);

  return {
    widgets,
    kpiCards,
    setWidgets,
    setKpiCards,
    saveConfig,
    resetConfig,
    toggleWidget,
    toggleKpi,
    reorderWidgets,
    reorderKpis,
    hasSavedConfig: saved !== null,
  };
}