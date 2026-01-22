//IMPORT INSTRUCTIONS
// import { CHART_TYPES, CHART_CATEGORIES, type ChartType } from '@/lib/chartConstants';

// interface PivotProps {
//   data: any[];
//   selectedView: ChartType;
// }

// const PivotRenderer = ({ data, selectedView }: PivotProps) => {
//   const category = CHART_CATEGORIES[selectedView];

//   // Logic to determine which component to show
//   if (category === 'table') {
//     return <TableView data={data} heatmap={selectedView.includes('Heatmap')} />;
//   }

//   if (category === 'chart') {
//     return <ChartView data={data} type={selectedView} />;
//   }

//   return <div>Exporting...</div>;
// };

// // Use CHART_TYPES to populate a Sidebar or Toolbar
// export const ChartSelector = ({ current, onSelect }: { current: ChartType, onSelect: (v: ChartType) => void }) => (
//   <div className="flex flex-col gap-2">
//     {CHART_TYPES.map((type) => (
//       <button 
//         key={type}
//         className={current === type ? 'active' : ''}
//         onClick={() => onSelect(type)}
//       >
//         {type}
//       </button>
//     ))}
//   </div>
// );

// start of actual code
// src/lib/surveyConstants.ts

export const QUESTION_TYPES = [
  'multiple_choice',
  'multi_select',
  'short_answer',
  'long_answer',
  'rating_scale',
  'date',
  'file_upload',
  'dropdown',
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

// helper for labels to display in a UI dropdown
export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  multiple_choice: 'Multiple Choice',
  multi_select: 'Multi-Select (Checkboxes)',
  short_answer: 'Short Answer',
  long_answer: 'Paragraph/Long Answer',
  rating_scale: 'Rating Scale',
  date: 'Date Picker',
  file_upload: 'File Upload',
  dropdown: 'Dropdown Menu',
};

export const CHART_TYPES = [
  'Table',
  'Table Heatmap',
  'Table Col Heatmap',
  'Table Row Heatmap',
  'Exportable TSV',
  'Grouped Column Chart',
  'Stacked Column Chart',
  'Grouped Bar Chart',
  'Stacked Bar Chart',
  'Line Chart',
  'Dot Chart',
  'Area Chart',
  'Scatter Chart',
  'Multiple Pie Chart',
] as const;

export type ChartType = (typeof CHART_TYPES)[number];

// categorization helper for labels to render chart
export const CHART_CATEGORIES: Record<ChartType, 'table' | 'chart' | 'export'> = {
  'Table': 'table',
  'Table Heatmap': 'table',
  'Table Col Heatmap': 'table',
  'Table Row Heatmap': 'table',
  'Exportable TSV': 'export',
  'Grouped Column Chart': 'chart',
  'Stacked Column Chart': 'chart',
  'Grouped Bar Chart': 'chart',
  'Stacked Bar Chart': 'chart',
  'Line Chart': 'chart',
  'Dot Chart': 'chart',
  'Area Chart': 'chart',
  'Scatter Chart': 'chart',
  'Multiple Pie Chart': 'chart',
};