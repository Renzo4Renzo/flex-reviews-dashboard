import { Card, Stack, Group, Text, Progress, Badge } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconMinus } from '@tabler/icons-react';
import { CategoryPerformance as CategoryPerformanceType } from '@/types/analytics';
import { getStatusColor, getDeltaColor, formatDelta, formatCategoryName } from '@/lib/utils/helpers';
import { COLORS, FONT_WEIGHTS } from '@/lib/utils/designSystem';
import InfoTooltip from '@/components/shared/InfoTooltip';

interface CategoryPerformanceProps {
  categoryPerformance: CategoryPerformanceType[];
}

const getDeltaIcon = (delta: number) => {
  if (delta > 0) return IconArrowUp;
  if (delta < 0) return IconArrowDown;
  return IconMinus;
};

export default function CategoryPerformance({ categoryPerformance }: CategoryPerformanceProps) {
  const sortedCategories = [...categoryPerformance].sort((a, b) => a.avgRating - b.avgRating);

  return (
    <Card shadow="sm" padding="md" withBorder style={{ backgroundColor: COLORS.white, height: '100%' }}>
      <Group justify="space-between" mb="sm">
        <Text size="md" fw={FONT_WEIGHTS.semibold} c={COLORS.textPrimary}>
          Category Performance
        </Text>
        <InfoTooltip text="Average ratings for each category (Cleanliness, Communication, Location, Value). Lower-rated categories appear first to highlight areas for improvement." />
      </Group>
      <Stack gap="sm">
        {sortedCategories.map((category) => {
          const DeltaIcon = getDeltaIcon(category.delta30d);

          return (
            <div key={category.category}>
              <Group justify="space-between" mb={4}>
                <Text size="xs" fw={FONT_WEIGHTS.medium} tt="capitalize" c={COLORS.textPrimary}>
                  {formatCategoryName(category.category)}
                </Text>
                <Group gap={4}>
                  <Text size="xs" fw={FONT_WEIGHTS.semibold} c={COLORS.textPrimary}>
                    {category.avgRating.toFixed(1)}
                  </Text>
                  {category.delta30d !== 0 && (
                    <Badge
                      color={getDeltaColor(category.delta30d)}
                      variant="light"
                      size="xs"
                      leftSection={<DeltaIcon size={10} />}
                    >
                      {formatDelta(category.delta30d)}
                    </Badge>
                  )}
                </Group>
              </Group>
              <Progress
                value={(category.avgRating / 10) * 100}
                color={getStatusColor(category.status)}
                size="sm"
              />
            </div>
          );
        })}
      </Stack>
    </Card>
  );
}
