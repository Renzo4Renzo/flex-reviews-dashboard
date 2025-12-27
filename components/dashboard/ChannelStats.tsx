import { Card, Stack, Group, Text, Badge } from '@mantine/core';
import { ChannelStats as ChannelStatsType } from '@/types/analytics';
import { getStatusIcon, getStatusColor } from '@/lib/utils/helpers';
import { COLORS, FONT_WEIGHTS } from '@/lib/utils/designSystem';
import InfoTooltip from '@/components/shared/InfoTooltip';

interface ChannelStatsProps {
  channelStats: ChannelStatsType[];
}

export default function ChannelStats({ channelStats }: ChannelStatsProps) {
  return (
    <Card shadow="sm" padding="md" withBorder style={{ backgroundColor: COLORS.white, height: '100%' }}>
      <Group gap={4} mb="sm">
        <Text size="sm" c="black" tt="uppercase" fw={FONT_WEIGHTS.semibold} style={{ letterSpacing: '0.5px' }}>
          Channel Performance
        </Text>
        <InfoTooltip text="Compare performance across different booking channels (Airbnb, Booking.com, Expedia). Shows average rating and number of reviews per channel." />
      </Group>
      <Stack gap="sm">
        {channelStats.map((channel) => (
          <Group key={channel.channelId} justify="space-between">
            <Text fw={FONT_WEIGHTS.medium} size="xs" c={COLORS.textPrimary}>{channel.channelName}</Text>
            <Group gap={4}>
              <Text size="xs">{getStatusIcon(channel.status)}</Text>
              <Badge color={getStatusColor(channel.status)} variant="light" size="xs">
                {channel.avgRating.toFixed(1)}
              </Badge>
              <Text size="xs" c="dimmed">
                ({channel.count})
              </Text>
            </Group>
          </Group>
        ))}
      </Stack>
    </Card>
  );
}
