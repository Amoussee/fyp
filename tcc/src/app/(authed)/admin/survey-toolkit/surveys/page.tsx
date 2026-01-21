import { SurveyList } from '../../../../../components/ui/surveyList'
import { Sidebar } from '../../../../../components/sidebar'
import { Box } from '@mui/material'

export default function SurveyListPage() {
  return (
    <Box sx={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <SurveyList />
        </Box>
      </Box>
    </Box>
  )
}
