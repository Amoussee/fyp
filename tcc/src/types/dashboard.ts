import { ChartType } from '../lib/surveyConstants';

export interface WidgetConfig {
  id: string; // Unique ID for the widget location/instance
  questionId: string;
  chartType: ChartType;
  aggregation: 'count' | 'sum' | 'average';
  title?: string; // Optional custom title
  pivotState?: Record<string, unknown>; // Stores the state from react-pivottable
}

export type DashboardLayoutType = 'layout-1' | 'layout-2' | 'layout-3' | 'layout-4';

export interface Dashboard {
  id: string;
  name: string;
  layoutType: DashboardLayoutType;
  widgets: WidgetConfig[];
}

export interface DashboardLayout {
  widgets: WidgetConfig[];
}
