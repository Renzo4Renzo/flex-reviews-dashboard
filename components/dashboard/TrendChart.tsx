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
      <Group gap={4} mb="sm">
        <Text size="sm" c="black" tt="uppercase" fw={FONT_WEIGHTS.semibold} style={{ letterSpacing: '0.5px' }}>
          Rating Trends
        </Text>
        <InfoTooltip text="Track how your ratings change over time across different categories. Helps identify seasonal patterns and improvement trends." />
      </Group>

      {validData.length === 0 ? (
        <Text c="dimmed" size="sm">Not enough data for trend chart</Text>
      ) : (
        <div style={{ width: '100%', marginLeft: '-10px' }}>
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
            yAxisProps={{ domain: [0, 10], style: { fill: '#000' } }}
            xAxisProps={{ style: { fill: '#000' } }}
          />
        </div>
      )}
    </Card>
  );
}
