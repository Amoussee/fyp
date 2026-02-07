'use client';

import { useState } from 'react';
import { Box, Container, Typography, Card, CardContent, Tabs, Tab } from '@mui/material';
import { BRAND } from '@/src/styles/brand';
import { ParentSurveyCard } from './ParentSurveyCard';
import { UniversalFilter, FilterConfig, FilterValues } from '@/src/components/UniversalFilter';
import type { ParentSurvey, ParentSurveyStats } from '@/src/types/parentSurveyTypes';

interface ParentSurveyListProps {
  surveys: ParentSurvey[];
  stats: ParentSurveyStats;
  onStartSurvey: (surveyId: string) => void;
}

const filterConfigs: FilterConfig[] = [
  {
    field: 'schoolName',
    label: 'School',
    type: 'text',
    placeholder: 'Search by school name',
  },
  {
    field: 'childName',
    label: 'Child Name',
    type: 'text',
    placeholder: 'Search by child name',
  },
];

export function ParentSurveyList({ surveys, stats, onStartSurvey }: ParentSurveyListProps) {
  const [activeTab, setActiveTab] = useState<'to_do' | 'completed'>('to_do');
  const [filterValues, setFilterValues] = useState<FilterValues>({
    schoolName: '',
    childName: '',
  });

  // Filter surveys based on filter values
  const filteredSurveys = surveys.filter((survey) => {
    // Tab filter
    if (survey.status !== activeTab) return false;

    // School name filter
    const schoolFilter = filterValues.schoolName as string;
    if (schoolFilter && !survey.schoolName.toLowerCase().includes(schoolFilter.toLowerCase())) {
      return false;
    }

    // Child name filter
    const childFilter = filterValues.childName as string;
    if (
      childFilter &&
      (!survey.childName || !survey.childName.toLowerCase().includes(childFilter.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });

  const toDoSurveys = surveys.filter((s) => s.status === 'to_do');
  const completedSurveys = surveys.filter((s) => s.status === 'completed');

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: BRAND.surface,
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: BRAND.text,
              mb: 1,
            }}
          >
            My Surveys
          </Typography>
          <Typography sx={{ color: BRAND.muted }}>
            Complete surveys for your children's schools
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 4,
          }}
        >
          <Card
            elevation={0}
            sx={{
              border: `1px solid ${BRAND.border}`,
              borderRadius: 2,
              backgroundColor: BRAND.bg,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '0.875rem', color: BRAND.muted, mb: 1 }}>
                Total Surveys
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: BRAND.text }}>
                {stats.total}
              </Typography>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: `2px solid ${BRAND.green}`,
              borderRadius: 2,
              backgroundColor: BRAND.greenHover,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '0.875rem', color: BRAND.green, mb: 1, fontWeight: 600 }}>
                To Do
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: BRAND.green }}>
                {stats.toDo}
              </Typography>
            </CardContent>
          </Card>

          <Card
            elevation={0}
            sx={{
              border: `1px solid ${BRAND.border}`,
              borderRadius: 2,
              backgroundColor: BRAND.bg,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography sx={{ fontSize: '0.875rem', color: BRAND.muted, mb: 1 }}>
                Completed
              </Typography>
              <Typography sx={{ fontSize: '2rem', fontWeight: 700, color: BRAND.text }}>
                {stats.completed}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Tabs and Filters */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            gap: 2,
            flexWrap: 'wrap',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: BRAND.green,
              },
            }}
          >
            <Tab
              label={`To Do (${toDoSurveys.length})`}
              value="to_do"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: BRAND.muted,
                '&.Mui-selected': {
                  color: BRAND.green,
                },
              }}
            />
            <Tab
              label={`Completed (${completedSurveys.length})`}
              value="completed"
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: BRAND.muted,
                '&.Mui-selected': {
                  color: BRAND.green,
                },
              }}
            />
          </Tabs>

          <UniversalFilter
            filters={filterConfigs}
            values={filterValues}
            onChange={setFilterValues}
            onClear={() => setFilterValues({ schoolName: '', childName: '' })}
          />
        </Box>

        {/* Survey List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredSurveys.length === 0 ? (
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${BRAND.border}`,
                borderRadius: 2,
                backgroundColor: BRAND.bg,
              }}
            >
              <CardContent sx={{ p: 6, textAlign: 'center' }}>
                <Typography sx={{ color: BRAND.muted, fontSize: '1rem' }}>
                  {activeTab === 'to_do'
                    ? 'No surveys to complete at the moment'
                    : 'No completed surveys yet'}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredSurveys.map((survey) => (
              <ParentSurveyCard key={survey.id} survey={survey} onStartSurvey={onStartSurvey} />
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}
