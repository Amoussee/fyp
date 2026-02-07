// Parent-facing survey types
export type ParentSurveyStatus = 'to_do' | 'completed';

export interface ParentSurvey {
  id: string;
  name: string;
  schoolName: string;
  description?: string;
  dueDate?: string;
  completedDate?: string;
  estimatedTime: string;
  status: ParentSurveyStatus;
  childName?: string; // Which child this survey is for
}

export interface ParentSurveyStats {
  toDo: number;
  completed: number;
  total: number;
}
