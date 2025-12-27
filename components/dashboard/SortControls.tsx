'use client';

import { Group, Select, Button, Text } from '@mantine/core';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';

interface SortControlsProps {
  sortBy: 'date' | 'rating' | 'channel';
  sortOrder: 'asc' | 'desc';
  onSortChange: (by: 'date' | 'rating' | 'channel', order: 'asc' | 'desc') => void;
}

const SORT_OPTIONS = [
  { value: 'date', label: 'Date' },
  { value: 'rating', label: 'Rating' },
  { value: 'channel', label: 'Channel' },
];

export default function SortControls({ sortBy, sortOrder, onSortChange }: SortControlsProps) {
  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(sortBy, newOrder);
  };

  return (
    <Group gap="md">
      <Text fw={500} c="black">Sort by:</Text>

      <Select
        data={SORT_OPTIONS}
        value={sortBy}
        onChange={(value) => value && onSortChange(value as 'date' | 'rating' | 'channel', sortOrder)}
        style={{ width: 150 }}
        styles={{
          input: { color: 'black' },
          option: { color: 'black' },
          dropdown: { color: 'black' },
        }}
      />

      <Button
        variant="subtle"
        onClick={toggleSortOrder}
        leftSection={sortOrder === 'asc' ? <IconArrowUp size={16} /> : <IconArrowDown size={16} />}
        aria-label="Toggle sort order"
      >
        {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
      </Button>
    </Group>
  );
}
