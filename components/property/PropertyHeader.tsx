import { Stack, Title, Text, Badge, Group } from '@mantine/core';

interface PropertyHeaderProps {
  propertyName: string;
  avgRating: number;
  totalReviews: number;
}

export default function PropertyHeader({ propertyName, avgRating, totalReviews }: PropertyHeaderProps) {
  return (
    <Stack gap="md">
      <Title order={1} size="h2">
        {propertyName}
      </Title>

      <Group gap="sm">
        <Badge size="xl" color="yellow">
          ⭐ {avgRating.toFixed(1)}
        </Badge>
        <Text c="dimmed">
          Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
        </Text>
      </Group>
    </Stack>
  );
}
