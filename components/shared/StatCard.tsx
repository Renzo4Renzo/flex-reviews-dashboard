import { Card, Text, Badge, Group, Stack } from '@mantine/core';
import { IconArrowUp, IconArrowDown, IconMinus } from '@tabler/icons-react';

interface StatCardProps {
  title: string;
  value: string | number;
  delta?: number;
  description?: string;
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

export function StatCard({ title, value, delta, description }: StatCardProps) {
  return (
    <Card shadow="sm" padding="lg" withBorder>
      <Stack gap="xs">
        <Text size="sm" c="dimmed" tt="uppercase" fw={700}>
          {title}
        </Text>

        <Group align="baseline" gap="sm">
          <Text size="xl" fw={700}>
            {value}
          </Text>
          {delta !== undefined && delta !== 0 && (
            <Badge
              color={getDeltaColor(delta)}
              variant="light"
              size="sm"
              leftSection={(() => {
                const Icon = getDeltaIcon(delta);
                return <Icon size={14} />;
              })()}
            >
              {delta > 0 ? '+' : ''}{delta.toFixed(1)}
            </Badge>
          )}
        </Group>

        {description && (
          <Text size="xs" c="dimmed">
            {description}
          </Text>
        )}
      </Stack>
    </Card>
  );
}
