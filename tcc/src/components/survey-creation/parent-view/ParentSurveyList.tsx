import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  LinearProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';
import {
  School as SchoolIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { BRAND } from '@/src/styles/brand';

// Mock data structure
interface Survey {
  id: string;
  schoolName: string;
  schoolId: string;
  childName: string;
  title: string;
  description: string;
  deadline: string;
  status: 'completed' | 'pending' | 'in-progress';
  completedDate?: string;
}

// Mock data - replace with actual API call
const mockSurveys: Survey[] = [
  {
    id: 'survey-1',
    schoolName: 'Greenwood Elementary School',
    schoolId: 'school-1',
    childName: 'Emma Thompson',
    title: 'Parent Satisfaction Survey 2024',
    description: 'Help us improve our school by sharing your feedback on our programs and services.',
    deadline: '2024-03-15',
    status: 'pending',
  },
  {
    id: 'survey-2',
    schoolName: 'Greenwood Elementary School',
    schoolId: 'school-1',
    childName: 'Emma Thompson',
    title: 'After-School Activities Feedback',
    description: 'Share your thoughts on our after-school programs and activities.',
    deadline: '2024-03-20',
    status: 'completed',
    completedDate: '2024-02-28',
  },
  {
    id: 'survey-3',
    schoolName: 'Riverside High School',
    schoolId: 'school-2',
    childName: 'James Thompson',
    title: 'Academic Progress Survey',
    description: "Provide feedback on your child's academic experience and support needs.",
    deadline: '2024-03-18',
    status: 'pending',
  },
  {
    id: 'survey-4',
    schoolName: 'Riverside High School',
    schoolId: 'school-2',
    childName: 'James Thompson',
    title: 'Campus Safety Assessment',
    description: 'Help us maintain a safe and secure learning environment.',
    deadline: '2024-03-25',
    status: 'in-progress',
  },
];

interface ParentSurveyListProps {
  onSurveyClick: (surveyId: string) => void;
}

export const ParentSurveyList: React.FC<ParentSurveyListProps> = ({ onSurveyClick }) => {
  const [surveys, setSurveys] = React.useState<Survey[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedSchool, setSelectedSchool] = React.useState<string>('all');

  React.useEffect(() => {
    // Simulate API call
    const fetchSurveys = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSurveys(mockSurveys);
      setLoading(false);
    };

    fetchSurveys();
  }, []);

  // Get unique schools
  const schools = Array.from(new Set(surveys.map((s) => s.schoolName)));

  // Filter surveys based on selected school
  const filteredSurveys =
    selectedSchool === 'all' ? surveys : surveys.filter((s) => s.schoolName === selectedSchool);

  // Calculate statistics
  const totalSurveys = filteredSurveys.length;
  const completedSurveys = filteredSurveys.filter((s) => s.status === 'completed').length;
  const pendingSurveys = filteredSurveys.filter((s) => s.status === 'pending').length;
  const inProgressSurveys = filteredSurveys.filter((s) => s.status === 'in-progress').length;

  const getStatusChip = (status: Survey['status']) => {
    switch (status) {
      case 'completed':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label="Completed"
            size="small"
            sx={{
              bgcolor: '#dcfce7',
              color: '#166534',
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#166534' },
            }}
          />
        );
      case 'in-progress':
        return (
          <Chip
            icon={<ScheduleIcon />}
            label="In Progress"
            size="small"
            sx={{
              bgcolor: '#fef3c7',
              color: '#92400e',
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#92400e' },
            }}
          />
        );
      case 'pending':
        return (
          <Chip
            icon={<ScheduleIcon />}
            label="Pending"
            size="small"
            sx={{
              bgcolor: '#fee2e2',
              color: '#991b1b',
              fontWeight: 600,
              '& .MuiChip-icon': { color: '#991b1b' },
            }}
          />
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              border: `4px solid ${BRAND.green}`,
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              mx: 'auto',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <Typography sx={{ mt: 2, color: BRAND.green, fontWeight: 600 }}>
            Loading surveys...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', py: 6 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#166534', mb: 1 }}>
            Parent Surveys
          </Typography>
          <Typography sx={{ color: '#6b7280' }}>
            Complete surveys for your children's schools
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${BRAND.border}`,
                borderLeft: `4px solid ${BRAND.green}`,
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                  Total Surveys
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#166534', mt: 0.5 }}>
                  {totalSurveys}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${BRAND.border}`,
                borderLeft: '4px solid #16a34a',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                  Completed
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#16a34a', mt: 0.5 }}>
                  {completedSurveys}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${BRAND.border}`,
                borderLeft: '4px solid #eab308',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                  In Progress
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#ca8a04', mt: 0.5 }}>
                  {inProgressSurveys}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                border: `1px solid ${BRAND.border}`,
                borderLeft: '4px solid #dc2626',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 600 }}>
                  Pending
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#dc2626', mt: 0.5 }}>
                  {pendingSurveys}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Progress Bar */}
        {totalSurveys > 0 && (
          <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 2, mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>
                  Overall Progress
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: BRAND.green }}>
                  {completedSurveys} of {totalSurveys} completed
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={(completedSurveys / totalSurveys) * 100}
                sx={{
                  height: 10,
                  borderRadius: 5,
                  bgcolor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: BRAND.green,
                    borderRadius: 5,
                  },
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* Filter by School */}
        {schools.length > 1 && (
          <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 2, mb: 3 }}>
            <CardContent>
              <FormControl fullWidth>
                <InputLabel>Filter by School</InputLabel>
                <Select
                  value={selectedSchool}
                  label="Filter by School"
                  onChange={(e) => setSelectedSchool(e.target.value)}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">All Schools</MenuItem>
                  {schools.map((school) => (
                    <MenuItem key={school} value={school}>
                      {school}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        )}

        {/* Surveys List */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredSurveys.length === 0 ? (
            <Card elevation={0} sx={{ border: `1px solid ${BRAND.border}`, borderRadius: 2 }}>
              <CardContent sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#9ca3af', mb: 1 }}>
                  No surveys available
                </Typography>
                <Typography variant="body2" sx={{ color: '#6b7280' }}>
                  Check back later for new surveys
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredSurveys.map((survey) => {
              const daysRemaining = getDaysRemaining(survey.deadline);
              const isUrgent = daysRemaining <= 3 && survey.status !== 'completed';

              return (
                <Card
                  key={survey.id}
                  elevation={0}
                  sx={{
                    border: `1px solid ${BRAND.border}`,
                    borderLeft: `4px solid ${isUrgent && survey.status !== 'completed' ? '#dc2626' : BRAND.green}`,
                    borderRadius: 2,
                    cursor: survey.status !== 'completed' ? 'pointer' : 'default',
                    opacity: survey.status === 'completed' ? 0.7 : 1,
                    transition: 'all 0.2s',
                    '&:hover': survey.status !== 'completed'
                      ? {
                          boxShadow: 3,
                          transform: 'translateY(-2px)',
                        }
                      : {},
                  }}
                  onClick={() => survey.status !== 'completed' && onSurveyClick(survey.id)}
                >
                  <CardContent>
                    {/* Header */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getStatusChip(survey.status)}
                        {isUrgent && survey.status !== 'completed' && (
                          <Chip
                            label="Urgent"
                            size="small"
                            sx={{
                              bgcolor: '#fef2f2',
                              color: '#991b1b',
                              fontWeight: 600,
                              border: '1px solid #fecaca',
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                        {survey.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        {survey.description}
                      </Typography>
                    </Box>

                    {/* School and Child Info */}
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              bgcolor: '#dcfce7',
                              p: 1,
                              borderRadius: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <SchoolIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              School
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                              {survey.schoolName}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              bgcolor: '#dcfce7',
                              p: 1,
                              borderRadius: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <PersonIcon sx={{ color: '#16a34a', fontSize: 20 }} />
                          </Box>
                          <Box>
                            <Typography variant="caption" sx={{ color: '#6b7280' }}>
                              Child
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#111827' }}>
                              {survey.childName}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Deadline Info */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: 2,
                        borderTop: `1px solid ${BRAND.border}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarIcon
                          sx={{
                            color: isUrgent && survey.status !== 'completed' ? '#dc2626' : '#9ca3af',
                            fontSize: 20,
                          }}
                        />
                        <Box>
                          {survey.status === 'completed' ? (
                            <Typography variant="body2" sx={{ color: '#6b7280' }}>
                              Completed on{' '}
                              <Box component="span" sx={{ fontWeight: 600 }}>
                                {formatDate(survey.completedDate!)}
                              </Box>
                            </Typography>
                          ) : (
                            <>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                                Deadline
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  color: isUrgent ? '#dc2626' : '#111827',
                                }}
                              >
                                {formatDate(survey.deadline)}
                                {daysRemaining > 0 && (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{ ml: 1, color: '#6b7280' }}
                                  >
                                    ({daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining)
                                  </Typography>
                                )}
                                {daysRemaining < 0 && (
                                  <Typography
                                    component="span"
                                    variant="caption"
                                    sx={{ ml: 1, color: '#dc2626' }}
                                  >
                                    (Overdue)
                                  </Typography>
                                )}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>

                      {survey.status !== 'completed' && (
                        <Button
                          variant="contained"
                          onClick={() => onSurveyClick(survey.id)}
                          sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 700,
                            bgcolor: BRAND.green,
                            '&:hover': { bgcolor: '#16a34a' },
                          }}
                          endIcon={
                            <Box component="span" sx={{ fontSize: 18 }}>
                              →
                            </Box>
                          }
                        >
                          {survey.status === 'in-progress' ? 'Continue' : 'Start Survey'}
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </Box>
    </Box>
  );
};