"use client";

import { useMemo } from "react";
import {
  Modal,
  Stack,
  MultiSelect,
  Button,
  Group,
  Text,
  NumberInput,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { COLORS } from "@/lib/utils/designSystem";
import { useDashboardStore } from "@/lib/store/dashboardStore";

interface Filters {
  channels?: string[];
  categories?: string[];
  dateRange?: [Date | null, Date | null];
  ratingRange?: [number, number];
}

interface FiltersModalProps {
  opened: boolean;
  onClose: () => void;
  filters: {
    channels: string[];
    categories: string[];
    dateRange: [Date | null, Date | null];
    ratingRange: [number, number];
  };
  onFilterChange: (filters: Filters) => void;
  onClearFilters: () => void;
}

export default function FiltersModal({
  opened,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
}: FiltersModalProps) {
  const { reviews } = useDashboardStore();

  const channelOptions = useMemo(() => {
    if (reviews.length === 0) return [];
    const uniqueChannels = new Set<string>();
    for (const review of reviews) {
      uniqueChannels.add(review.channelName);
    }
    return Array.from(uniqueChannels)
      .sort()
      .map((channel) => ({
        value: channel,
        label: channel,
      }));
  }, [reviews]);

  const categoryOptions = [
    { value: "cleanliness", label: "Cleanliness" },
    { value: "communication", label: "Communication" },
    { value: "location", label: "Location" },
    { value: "value", label: "Value" },
  ];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Filter Reviews"
      size="md"
      styles={{
        title: {
          fontWeight: 600,
          fontSize: "1.125rem",
          color: COLORS.textPrimary,
        },
      }}
    >
      <Stack gap="md">
        <MultiSelect
          label="Channels"
          placeholder="Select channels"
          data={channelOptions}
          value={filters.channels}
          onChange={(value) => onFilterChange({ channels: value })}
          clearable
          c={COLORS.textPrimary}
          styles={{
            label: { color: COLORS.textPrimary },
            input: { color: COLORS.textPrimary },
            option: { color: COLORS.textPrimary },
            dropdown: { color: COLORS.textPrimary },
          }}
        />

        <MultiSelect
          label="Categories"
          placeholder="Select categories"
          data={categoryOptions}
          value={filters.categories}
          onChange={(value) => onFilterChange({ categories: value })}
          clearable
          c={COLORS.textPrimary}
          styles={{
            label: { color: COLORS.textPrimary },
            input: { color: COLORS.textPrimary },
            option: { color: COLORS.textPrimary },
            dropdown: { color: COLORS.textPrimary },
          }}
        />

        <DatePickerInput
          type="range"
          label="Date Range"
          placeholder="Pick date range"
          value={filters.dateRange}
          onChange={(value) => onFilterChange({ dateRange: value })}
          clearable
          c={COLORS.textPrimary}
          styles={{
            label: { color: COLORS.textPrimary },
            input: { color: COLORS.textPrimary },
            calendarHeader: { color: COLORS.textPrimary },
            calendarHeaderLevel: { color: COLORS.textPrimary },
          }}
        />

        <div>
          <Text size="sm" fw={500} c={COLORS.textPrimary} mb="xs">
            Rating Range
          </Text>
          <Group grow>
            <NumberInput
              label="Min"
              min={1}
              max={10}
              value={filters.ratingRange[0]}
              onChange={(value) => {
                const newMin = typeof value === 'number' ? value : 1;
                const newMax = filters.ratingRange[1];
                if (newMin <= newMax) {
                  onFilterChange({ ratingRange: [newMin, newMax] });
                }
              }}
              c={COLORS.textPrimary}
              styles={{
                label: { color: COLORS.textPrimary },
                input: { color: COLORS.textPrimary },
              }}
            />
            <NumberInput
              label="Max"
              min={1}
              max={10}
              value={filters.ratingRange[1]}
              onChange={(value) => {
                const newMax = typeof value === 'number' ? value : 10;
                const newMin = filters.ratingRange[0];
                if (newMax >= newMin) {
                  onFilterChange({ ratingRange: [newMin, newMax] });
                }
              }}
              c={COLORS.textPrimary}
              styles={{
                label: { color: COLORS.textPrimary },
                input: { color: COLORS.textPrimary },
              }}
            />
          </Group>
        </div>

        <Button
          variant="subtle"
          color="gray"
          onClick={() => {
            onClearFilters();
          }}
          fullWidth
          mt="md"
        >
          Clear Filters
        </Button>
      </Stack>
    </Modal>
  );
}
