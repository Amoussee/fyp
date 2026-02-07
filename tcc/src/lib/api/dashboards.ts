// src/lib/api/dashboards.ts
import { apiFetch } from './client';
import type { Dashboard, DashboardLayoutType, WidgetConfig } from '../../types/dashboard';

export type DashboardApiRow = {
  dashboard_id: number;
  name: string;
  config: {
    layoutType: DashboardLayoutType;
    widgets: WidgetConfig[];
  };
};

export type SaveDashboardPayload = {
  dashboard_id?: number;
  email: string;
  name: string;
  layoutType: DashboardLayoutType;
  widgets: WidgetConfig[];
};

export async function listDashboards(email: string): Promise<DashboardApiRow[]> {
  return apiFetch<DashboardApiRow[]>(`/api/dashboards?email=${encodeURIComponent(email)}`, {
    method: 'GET',
    // credentials: 'include', // keep if your BE uses cookies/session
  });
}

export async function saveDashboard(payload: SaveDashboardPayload): Promise<DashboardApiRow> {
  return apiFetch<DashboardApiRow>('/api/dashboards', {
    method: 'POST',
    // credentials: 'include',
    body: payload,
  });
}

// Optional: map BE → FE shape in one place
export function mapDashboards(rows: DashboardApiRow[]): Dashboard[] {
  return rows.map((d) => ({
    id: d.dashboard_id.toString(),
    name: d.name,
    layoutType: d.config.layoutType,
    widgets: d.config.widgets ?? [],
  }));
}
