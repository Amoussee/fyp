import type React from 'react';
import { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  Typography,
  IconButton,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Divider,
  Chip,
  TextField,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { Dayjs } from 'dayjs';

export interface FilterConfig {
  field: string;
  label: string;
  type: 'radio' | 'checkbox' | 'alphabet' | 'dateRange' | 'text';
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export interface FilterValues {
  [key: string]: string | string[] | { start: Dayjs | null; end: Dayjs | null };
}

interface UniversalFilterProps {
  filters: FilterConfig[];
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onClear?: () => void;
}

export function UniversalFilter({ filters, values, onChange, onClear }: UniversalFilterProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleFilterChange = (
    field: string,
    value: string | string[] | { start: Dayjs | null; end: Dayjs | null },
  ) => {
    onChange({
      ...values,
      [field]: value,
    });
  };

  // const surveyFilters: FilterConfig[] = [
  //   {
  //     field: 'name',
  //     label: 'School Name',
  //     type: 'text',
  //     placeholder: 'Search by school name',
  //   },
  //   {
  //     field: 'status',
  //     label: 'Status',
  //     type: 'radio',
  //     options: [
  //       { value: 'pending', label: 'Pending' },
  //       { value: 'ready', label: 'Ready' },
  //       { value: 'closed', label: 'Closed' },
  //     ],
  //   },
  //   {
  //     field: 'type',
  //     label: 'Survey Type',
  //     type: 'checkbox',
  //     options: [
  //       { value: 'Public - Parent', label: 'Public - Parent' },
  //       { value: 'Public - Student', label: 'Public - Student' },
  //       { value: 'Parent', label: 'Parent' },
  //       { value: 'Student', label: 'Student' },
  //     ],
  //   },
  // ];

  const handleAlphabetToggle = (field: string, letter: string) => {
    const currentLetters = (values[field] as string[]) || [];
    const newLetters = currentLetters.includes(letter)
      ? currentLetters.filter((l) => l !== letter)
      : [...currentLetters, letter];
    handleFilterChange(field, newLetters);
  };

  const handleClearAll = () => {
    const clearedValues: FilterValues = {};
    filters.forEach((filter) => {
      if (filter.type === 'alphabet' || filter.type === 'checkbox') {
        clearedValues[filter.field] = [];
      } else if (filter.type === 'dateRange') {
        clearedValues[filter.field] = { start: null, end: null };
      } else {
        clearedValues[filter.field] = '';
      }
    });
    onChange(clearedValues);
    if (onClear) onClear();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    filters.forEach((filter) => {
      const value = values[filter.field];
      if (filter.type === 'alphabet' || filter.type === 'checkbox') {
        if ((value as string[])?.length > 0) count++;
      } else if (filter.type === 'dateRange') {
        const dateValue = value as { start: Dayjs | null; end: Dayjs | null };
        if (dateValue?.start || dateValue?.end) count++;
      } else if (filter.type === 'text') {
        if (value && (value as string).trim()) count++;
      } else {
        if (value) count++;
      }
    });
    return count;
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const activeFilterCount = getActiveFilterCount();

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<FilterListIcon />}
        onClick={() => setDrawerOpen(true)}
        sx={{
          borderRadius: '8px',
          borderColor: '#d1d5db',
          color: '#374151',
          textTransform: 'none',
          '&:hover': {
            borderColor: '#9ca3af',
            backgroundColor: '#f9fafb',
          },
        }}
      >
        Filter
        {activeFilterCount > 0 && (
          <Chip
            label={activeFilterCount}
            size="small"
            sx={{
              ml: 1,
              height: '20px',
              backgroundColor: '#15803d',
              color: 'white',
              fontSize: '0.7rem',
            }}
          />
        )}
      </Button>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 350, p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filters
            </Typography>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
            {filters.map((filter, index) => (
              <Box key={filter.field}>
                {index > 0 && <Divider sx={{ my: 2 }} />}

                <FormControl component="fieldset" fullWidth>
                  <FormLabel
                    component="legend"
                    sx={{ fontWeight: 600, color: '#111827', mb: 1.5, fontSize: '0.9rem' }}
                  >
                    {filter.label}
                  </FormLabel>

                  {/* Radio Button Filter */}
                  {filter.type === 'radio' && filter.options && (
                    <RadioGroup
                      value={values[filter.field] || ''}
                      onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                    >
                      {filter.options.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          value={option.value}
                          control={
                            <Radio
                              size="small"
                              sx={{ color: '#15803d', '&.Mui-checked': { color: '#15803d' } }}
                            />
                          }
                          label={option.label}
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                        />
                      ))}
                    </RadioGroup>
                  )}

                  {/* Checkbox Filter */}
                  {filter.type === 'checkbox' && filter.options && (
                    <FormGroup>
                      {filter.options.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          control={
                            <Checkbox
                              size="small"
                              checked={((values[filter.field] as string[]) || []).includes(
                                option.value,
                              )}
                              onChange={(e) => {
                                const currentValues = (values[filter.field] as string[]) || [];
                                const newValues = e.target.checked
                                  ? [...currentValues, option.value]
                                  : currentValues.filter((v) => v !== option.value);
                                handleFilterChange(filter.field, newValues);
                              }}
                              sx={{ color: '#15803d', '&.Mui-checked': { color: '#15803d' } }}
                            />
                          }
                          label={option.label}
                          sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                        />
                      ))}
                    </FormGroup>
                  )}

                  {/* Alphabet Filter */}
                  {filter.type === 'alphabet' && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {alphabet.map((letter) => (
                        <Button
                          key={letter}
                          size="small"
                          variant={
                            ((values[filter.field] as string[]) || []).includes(letter)
                              ? 'contained'
                              : 'outlined'
                          }
                          onClick={() => handleAlphabetToggle(filter.field, letter)}
                          sx={{
                            minWidth: '32px',
                            width: '32px',
                            height: '32px',
                            p: 0,
                            fontSize: '0.75rem',
                            borderRadius: '6px',
                            backgroundColor: ((values[filter.field] as string[]) || []).includes(
                              letter,
                            )
                              ? '#15803d'
                              : 'transparent',
                            color: ((values[filter.field] as string[]) || []).includes(letter)
                              ? 'white'
                              : '#6b7280',
                            borderColor: '#d1d5db',
                            '&:hover': {
                              backgroundColor: ((values[filter.field] as string[]) || []).includes(
                                letter,
                              )
                                ? '#166534'
                                : '#f3f4f6',
                              borderColor: '#9ca3af',
                            },
                          }}
                        >
                          {letter}
                        </Button>
                      ))}
                    </Box>
                  )}

                  {/* Text Input Filter */}
                  {filter.type === 'text' && (
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={filter.placeholder || 'Enter text...'}
                      value={(values[filter.field] as string) || ''}
                      onChange={(e) => handleFilterChange(filter.field, e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}

                  {/* Date Range Filter */}
                  {filter.type === 'dateRange' && (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <DatePicker
                          label="Start Date"
                          value={
                            (values[filter.field] as { start: Dayjs | null; end: Dayjs | null })
                              ?.start || null
                          }
                          onChange={(newValue) => {
                            const currentRange = (values[filter.field] as {
                              start: Dayjs | null;
                              end: Dayjs | null;
                            }) || { start: null, end: null };
                            handleFilterChange(filter.field, { ...currentRange, start: newValue });
                          }}
                          slotProps={{
                            textField: {
                              size: 'small',
                              sx: { '& .MuiOutlinedInput-root': { borderRadius: '8px' } },
                            },
                          }}
                        />
                        <DatePicker
                          label="End Date"
                          value={
                            (values[filter.field] as { start: Dayjs | null; end: Dayjs | null })
                              ?.end || null
                          }
                          onChange={(newValue) => {
                            const currentRange = (values[filter.field] as {
                              start: Dayjs | null;
                              end: Dayjs | null;
                            }) || { start: null, end: null };
                            handleFilterChange(filter.field, { ...currentRange, end: newValue });
                          }}
                          slotProps={{
                            textField: {
                              size: 'small',
                              sx: { '& .MuiOutlinedInput-root': { borderRadius: '8px' } },
                            },
                          }}
                        />
                      </Box>
                    </LocalizationProvider>
                  )}
                </FormControl>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 3, display: 'flex', gap: 1, pt: 2, borderTop: '1px solid #e5e7eb' }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearAll}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                color: '#6b7280',
                borderColor: '#d1d5db',
                '&:hover': {
                  borderColor: '#9ca3af',
                  backgroundColor: '#f9fafb',
                },
              }}
            >
              Clear All
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => setDrawerOpen(false)}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                backgroundColor: '#15803d',
                '&:hover': {
                  backgroundColor: '#166534',
                },
              }}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
