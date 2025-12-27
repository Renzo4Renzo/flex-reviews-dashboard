import { Card, Text, Badge, Group, Stack } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconMinus } from '@tabler/icons-react';
import { COLORS, FONT_WEIGHTS } from '@/lib/utils/designSystem';
import InfoTooltip from './InfoTooltip';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: number;
  description?: string;
  info?: string;
}

const getDeltaColor = (delta: number): string => {
  if (delta > 0) return 'green';
  if (delta < 0) return 'red';
  return 'gray';
};

const getDeltaIcon = (delta: number) => {
  if (delta > 0) return IconArrowUp;
  if (delta < 0) return IconArrowDown;
  return IconMinus;
};

export function StatCard({ title, value, delta, description, info }: StatCardProps) {
  return (
    <Card shadow="sm" padding="md" withBorder style={{ backgroundColor: COLORS.white }}>
      <Stack gap="xs">
        <Group gap={4}>
          <Text size="sm" c="black" tt="uppercase" fw={FONT_WEIGHTS.semibold} style={{ letterSpacing: '0.5px' }}>
            {title}
          </Text>
          {info && <InfoTooltip text={info} />}
        </Group>

        <Group align="baseline" gap="xs">
          <Text size="lg" fw={FONT_WEIGHTS.bold} c={COLORS.textPrimary}>
            {value}
          </Text>
          {delta !== undefined && delta !== 0 && (
            <Badge
              color={getDeltaColor(delta)}
              variant="light"
              size="xs"
              leftSection={(() => {
                const Icon = getDeltaIcon(delta);
                return <Icon size={12} />;
              })()}
            >
              {delta > 0 ? '+' : ''}{delta.toFixed(1)}
            </Badge>
          )}
        </Group>

        {description && (
          <Text size="xs" c="black">
            {description}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
