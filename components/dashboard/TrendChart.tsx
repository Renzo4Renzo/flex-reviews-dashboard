'use client';

import { Card, Text, Group } from '@mantine/core';
import { LineChart } from '@mantine/charts';
import { TrendDataPoint } from '@/types/analytics';
import { COLORS, FONT_WEIGHTS } from '@/lib/utils/designSystem';
import InfoTooltip from '@/components/shared/InfoTooltip';

interface TrendChartProps {
  trendData: TrendDataPoint[];
}

export default function TrendChart({ trendData }: TrendChartProps) {
  const validData = trendData.filter((point) => point.count > 0);

  return (
    <Card shadow="sm" padding="md" withBorder style={{ backgroundColor: COLORS.white }}>
      <Group justify="space-between" mb="sm">
        <Text size="md" fw={FONT_WEIGHTS.semibold} c={COLORS.textPrimary}>
          Rating Trends
        </Text>
        <InfoTooltip text="Track how your ratings change over time across different categories. Helps identify seasonal patterns and improvement trends." />
      </Group>

      {validData.length === 0 ? (
        <Text c="dimmed" size="sm">Not enough data for trend chart</Text>
      ) : (
        <LineChart
          h={240}
          data={validData}
          dataKey="month"
          series={[
            { name: 'avgRating', label: 'Overall', color: 'blue' },
            { name: 'cleanliness', label: 'Cleanliness', color: 'teal' },
            { name: 'communication', label: 'Communication', color: 'violet' },
            { name: 'location', label: 'Location', color: 'green' },
            { name: 'value', label: 'Value', color: 'orange' },
          ]}
          curveType="monotone"
          withLegend
          withTooltip
          withDots={true}
          yAxisProps={{ domain: [0, 10] }}
        />
      )}
    </Card>
  );
}
