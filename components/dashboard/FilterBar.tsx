'use client';

import { Group, MultiSelect, Button, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { RangeSlider } from '@mantine/core';
import { FilterState } from '@/lib/store/dashboardStore';
import { getAllChannels } from '@/lib/utils/channelMapping';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}

const CATEGORY_OPTIONS = [
  { value: 'cleanliness', label: 'Cleanliness' },
  { value: 'communication', label: 'Communication' },
  { value: 'location', label: 'Location' },
  { value: 'value', label: 'Value' },
];

export default function FilterBar({ filters, onFilterChange, onClearFilters }: FilterBarProps) {
  const channelOptions = getAllChannels().map((channel) => ({
    value: String(channel.id),
    label: channel.name,
  }));

  return (
    <Stack gap="md">
      <Group gap="md" wrap="wrap">
        <MultiSelect
          label="Channels"
          placeholder="All channels"
          data={channelOptions}
          value={filters.channels}
          onChange={(value) => onFilterChange({ channels: value })}
          clearable
          searchable
          style={{ minWidth: 200 }}
          styles={{
            label: { color: 'black' },
            input: { color: 'black' },
            option: { color: 'black' },
            dropdown: { color: 'black' },
          }}
        />

        <MultiSelect
          label="Categories"
          placeholder="All categories"
          data={CATEGORY_OPTIONS}
          value={filters.categories}
          onChange={(value) => onFilterChange({ categories: value })}
          clearable
          searchable
          style={{ minWidth: 200 }}
          styles={{
            label: { color: 'black' },
            input: { color: 'black' },
            option: { color: 'black' },
            dropdown: { color: 'black' },
          }}
        />

        <DatePickerInput
          type="range"
          label="Date Range"
          placeholder="Pick dates"
          value={filters.dateRange}
          onChange={(value) => onFilterChange({ dateRange: value })}
          clearable
          style={{ minWidth: 250 }}
          styles={{
            label: { color: 'black' },
            input: { color: 'black' },
          }}
        />
      </Group>

      <div>
        <Group justify="space-between" mb="xs">
          <Text size="sm" fw={500} c="black">
            Rating Range
          </Text>
          <Text size="sm" c="black">
            {filters.ratingRange[0].toFixed(1)} - {filters.ratingRange[1].toFixed(1)}
          </Text>
        </Group>
        <RangeSlider
          min={1}
          max={10}
          step={0.5}
          minRange={0.5}
          value={filters.ratingRange}
          onChange={(value) => onFilterChange({ ratingRange: value as [number, number] })}
          marks={[
            { value: 1, label: '1' },
            { value: 5, label: '5' },
            { value: 10, label: '10' },
          ]}
          styles={{
            markLabel: { color: 'black' },
          }}
        />
      </div>

      <Button variant="subtle" color="gray" onClick={onClearFilters} size="sm">
        Clear Filters
      </Button>
    </Stack>
  );
}
