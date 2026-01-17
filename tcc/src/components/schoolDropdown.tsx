import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface SchoolOption {
  id: string; // Unique identifier of the school
  name: string; // Name of the school
}

interface SchoolSelectProps {
  selectedSchool: string; // Current selected school
  onChange: (school: string) => void; // Callback to notify parent of changes
}

const SchoolSelect: React.FC<SchoolSelectProps> = ({ selectedSchool, onChange }) => {
  // Mock data for testing
  const mockSchools: SchoolOption[] = [
    { id: '1', name: 'Raffles Institution' },
    { id: '2', name: 'Hwa Chong Institution' },
    { id: '3', name: 'Anglo-Chinese School (Independent)' },
    { id: '4', name: "St. Joseph's Institution" },
    { id: '5', name: 'Victoria School' },
    { id: '6', name: "Nanyang Girls' High School" },
    { id: '7', name: 'Dunman High School' },
    { id: '8', name: "Raffles Girls' School" },
  ];

  const [schools] = useState<SchoolOption[]>(mockSchools);
  // const [schools, setSchools] = useState<SchoolOption[]>(mockSchools);
  // const [selectedSchool, setSelectedSchool] = useState<string>(''); // State for selected school

  // Handle change in the dropdown
  const handleChange = (event: SelectChangeEvent<string>) => {
    const schoolName = event.target.value;
    onChange(schoolName); // Call upwards to parents
  };

  // Fetch school data from the API (commented out for now, using mock data)
  useEffect(() => {
    // Uncomment this when your API is ready
    /*
    const fetchSchools = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/schools');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: SchoolOption[] = await response.json();
        setSchools(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if API fails
        setSchools(mockSchools);
      }
    };
    fetchSchools();
    */
    // Using mock data for now
    // setSchools(mockSchools);
  }, []); // Run once on component mount

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="school-select-label">Select School</InputLabel>
        <Select
          labelId="school-select-label"
          id="school-select"
          value={selectedSchool}
          label="Select School"
          onChange={handleChange}
        >
          {schools.map((school) => (
            <MenuItem key={school.id} value={school.name}>
              {school.name} {/* Display school names */}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SchoolSelect;
