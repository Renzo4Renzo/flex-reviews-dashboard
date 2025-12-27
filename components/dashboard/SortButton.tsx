'use client';

import { Menu, Button } from '@mantine/core';
import { IconChevronDown, IconSortAscending, IconSortDescending } from '@tabler/icons-react';

interface SortButtonProps {
  sortBy: 'date' | 'rating' | 'channel';
  sortOrder: 'asc' | 'desc';
  onSortChange: (by: 'date' | 'rating' | 'channel', order: 'asc' | 'desc') => void;
}

export default function SortButton({ sortBy, sortOrder, onSortChange }: SortButtonProps) {
  const sortLabels = {
    date: 'Date',
    rating: 'Rating',
    channel: 'Channel',
  };

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button
          variant="default"
          rightSection={<IconChevronDown size={16} />}
          leftSection={sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />}
        >
          Sort: {sortLabels[sortBy]}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Sort By</Menu.Label>
        <Menu.Item
          onClick={() => onSortChange('date', sortOrder)}
          style={{ backgroundColor: sortBy === 'date' ? '#f0f0f0' : 'transparent' }}
        >
          Date
        </Menu.Item>
        <Menu.Item
          onClick={() => onSortChange('rating', sortOrder)}
          style={{ backgroundColor: sortBy === 'rating' ? '#f0f0f0' : 'transparent' }}
        >
          Rating
        </Menu.Item>
        <Menu.Item
          onClick={() => onSortChange('channel', sortOrder)}
          style={{ backgroundColor: sortBy === 'channel' ? '#f0f0f0' : 'transparent' }}
        >
          Channel
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Order</Menu.Label>
        <Menu.Item
          onClick={() => onSortChange(sortBy, 'asc')}
          leftSection={<IconSortAscending size={16} />}
          style={{ backgroundColor: sortOrder === 'asc' ? '#f0f0f0' : 'transparent' }}
        >
          Ascending
        </Menu.Item>
        <Menu.Item
          onClick={() => onSortChange(sortBy, 'desc')}
          leftSection={<IconSortDescending size={16} />}
          style={{ backgroundColor: sortOrder === 'desc' ? '#f0f0f0' : 'transparent' }}
        >
          Descending
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
