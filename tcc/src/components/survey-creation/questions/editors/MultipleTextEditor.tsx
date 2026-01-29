'use client';

import * as React from 'react';
import { Box, Button, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

type Item = {
  name: string;
  title: string;
  inputType?: string; // ✅ optional
};

type Props = {
  element: any; // SurveyJS "multipletext" element JSON
  onPatch: (patch: Partial<any>) => void;
};

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Date.now());

function normalizeItems(items: any[] | undefined): Item[] {
  if (!Array.isArray(items)) return [];
  return items.map((it, idx) => ({
    name: String(it?.name ?? `item${idx + 1}`),
    title: String(it?.title ?? `Item ${idx + 1}`),
    inputType: typeof it?.inputType === 'string' ? it.inputType : undefined,
  }));
}

export function MultipleTextEditor({ element, onPatch }: Props) {
  const kind = String(element?.kind ?? '');
  const isDateRange = kind === 'date_range';

  const items = normalizeItems(element?.items);

  const patchItems = (nextItems: Item[]) => {
    const fixed: Item[] = isDateRange
      ? nextItems.map((it) => ({ ...it, inputType: 'date' }))
      : nextItems;

    onPatch({ items: fixed });
  };

  const addItem = () => {
    const next: Item[] = items.slice();
    const n = next.length + 1;

    next.push({
      name: `${isDateRange ? 'date' : 'item'}_${uid().slice(0, 6)}`,
      title: isDateRange ? (n === 1 ? 'Start date' : 'End date') : `Item ${n}`,
      inputType: isDateRange ? 'date' : undefined, // ✅ always present but can be undefined
    });

    patchItems(next);
  };

  const removeItem = (name: string) => {
    const next = items.filter((it) => it.name !== name);
    patchItems(next);
  };

  const updateItem = (name: string, patch: Partial<Item>) => {
    const next: Item[] = items.map((it) => (it.name === name ? { ...it, ...patch } : it));
    patchItems(next);
  };

  React.useEffect(() => {
    if (items.length) return;

    if (isDateRange) {
      patchItems([
        { name: 'startDate', title: 'Start date', inputType: 'date' },
        { name: 'endDate', title: 'End date', inputType: 'date' },
      ]);
      return;
    }

    patchItems([
      { name: 'item1', title: 'Item 1' },
      { name: 'item2', title: 'Item 2' },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDateRange]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>
        {isDateRange ? 'Date range fields' : 'Fields'}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {items.map((it) => (
          <Box
            key={it.name}
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 160px' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <TextField
              label="Label"
              value={it.title}
              onChange={(e) => updateItem(it.name, { title: e.target.value })}
              fullWidth
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <TextField
                label="Key"
                value={it.name}
                disabled
                sx={{
                  display: { xs: 'none', md: 'block' },
                  '& .MuiOutlinedInput-root': { borderRadius: 2.5 },
                }}
              />
              <IconButton onClick={() => removeItem(it.name)} aria-label="remove item">
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>

      <Button startIcon={<AddIcon />} onClick={addItem} sx={{ mt: 1, textTransform: 'none' }}>
        Add field
      </Button>

      {isDateRange && (
        <Typography sx={{ mt: 1, color: 'text.secondary', fontSize: 13 }}>
          Tip: input type is locked to date for date range.
        </Typography>
      )}
    </Box>
  );
}
