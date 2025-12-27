'use client';

import { Card, Badge, Group, Text, Switch, Stack } from '@mantine/core';
import { NormalizedReview } from '@/types/review';
import { formatDate } from '@/lib/utils/dateHelpers';

interface ReviewCardProps {
  review: NormalizedReview;
  mode: 'dashboard' | 'public';
  onApprovalToggle?: (id: number, approved: boolean) => void;
}

const getRatingColor = (rating: number): string => {
  if (rating < 7) return 'red';
  if (rating < 8) return 'yellow';
  return 'green';
};

const getCategoryColor = (rating: number): string => {
  if (rating < 7) return 'red';
  if (rating < 8) return 'yellow';
  return 'green';
};

export function ReviewCard({ review, mode, onApprovalToggle }: ReviewCardProps) {
  const handleApprovalChange = (checked: boolean) => {
    if (onApprovalToggle) {
      onApprovalToggle(review.id, checked);
    }
  };

  return (
    <Card shadow="sm" padding="lg" withBorder>
      <Stack gap="md">
        <Group justify="space-between" wrap="nowrap">
          <div>
            <Text fw={600} size="lg">
              {review.guestName}
            </Text>
            <Text size="sm" c="dimmed">
              {formatDate(review.submittedAt)} • {review.channelName}
            </Text>
          </div>
          <Group gap="xs">
            <Badge color={getRatingColor(review.rating)}>
              ⭐ {review.rating.toFixed(1)}
            </Badge>
            {mode === 'dashboard' && (
              <Switch
                checked={review.approved}
                onChange={(event) => handleApprovalChange(event.currentTarget.checked)}
                label={review.approved ? 'Approved' : 'Pending'}
                color="green"
              />
            )}
          </Group>
        </Group>

        <Text size="sm" style={{ lineHeight: 1.6 }}>
          {review.publicReview}
        </Text>

        <Group gap="xs">
          {review.categories.map((category) => (
            <Badge
              key={category.category}
              variant="outline"
              size="sm"
              color={getCategoryColor(category.rating)}
            >
              {category.category.replace('_', ' ')}: {category.rating}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}
