'use client';

import { useRouter } from 'next/navigation';
import { ParentSurveyList } from '@/src/components/survey-creation/parent-view/ParentSurveyList';
import type { ParentSurvey, ParentSurveyStats } from '@/src/types/parentSurveyTypes';

// Mock data - replace with actual API call
const mockSurveys: ParentSurvey[] = [
  {
    id: 'survey-1',
    name: 'Student Wellbeing Survey 2024',
    schoolName: 'Poi Ching Primary School',
    description: 'Help us understand your childs wellbeing and mental health at school',
    dueDate: 'Feb 28, 2024',
    estimatedTime: '5-7 min',
    status: 'to_do',
    childName: 'Sarah Chen',
  },
  {
    id: 'survey-2',
    name: 'Parent Satisfaction Survey',
    schoolName: 'Poi Ching Primary School',
    description: 'Share your feedback on school programs and facilities',
    dueDate: 'Mar 15, 2024',
    estimatedTime: '8-10 min',
    status: 'to_do',
    childName: 'Sarah Chen',
  },
  {
    id: 'survey-3',
    name: 'School Climate Assessment',
    schoolName: 'St. Andrews Secondary School',
    description: 'Evaluate school culture and community engagement',
    dueDate: 'Mar 20, 2024',
    estimatedTime: '6-8 min',
    status: 'to_do',
    childName: 'David Chen',
  },
  {
    id: 'survey-4',
    name: 'Academic Feedback Survey',
    schoolName: 'Poi Ching Primary School',
    description: 'Provide feedback on teaching methods and academic support',
    completedDate: 'Feb 1, 2024',
    estimatedTime: '5 min',
    status: 'completed',
    childName: 'Sarah Chen',
  },
  {
    id: 'survey-5',
    name: 'Extracurricular Activities Interest',
    schoolName: 'St. Andrews Secondary School',
    description: 'Help us plan next semesters activities',
    completedDate: 'Jan 28, 2024',
    estimatedTime: '3 min',
    status: 'completed',
    childName: 'David Chen',
  },
];

const mockStats: ParentSurveyStats = {
  total: 5,
  toDo: 3,
  completed: 2,
};

export default function ParentDashboardPage() {
  const router = useRouter();

  const handleStartSurvey = (surveyId: string) => {
    // Navigate to survey taking page
    router.push(`/parent/survey/${surveyId}`);
  };

  return (
    <ParentSurveyList 
      surveys={mockSurveys} 
      stats={mockStats} 
      onStartSurvey={handleStartSurvey} 
    />
  );
}