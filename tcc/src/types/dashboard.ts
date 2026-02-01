import { ChartType } from '../lib/surveyConstants';

export interface WidgetConfig {
    id: string; // Unique ID for the widget location/instance
    questionId: string;
    chartType: ChartType;
    aggregation: 'count' | 'sum' | 'average';
    title?: string; // Optional custom title
}

export interface DashboardLayout {
    widgets: WidgetConfig[];
}
