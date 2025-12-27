'use client';

import { Card, Badge, Group, Text, Switch, Stack } from '@mantine/core';
import { NormalizedReview } from '@/types/review';
import { formatDate } from '@/lib/utils/dateHelpers';
import { getRatingColor } from '@/lib/utils/helpers';
import { COLORS, FONT_WEIGHTS } from '@/lib/utils/designSystem';

interface ReviewCardProps {
  review: NormalizedReview;
  mode: 'dashboard' | 'public';
  onApprovalToggle?: (id: number, approved: boolean) => void;
}

export function ReviewCard({ review, mode, onApprovalToggle }: ReviewCardProps) {
  const handleApprovalChange = (checked: boolean) => {
    if (onApprovalToggle) {
      onApprovalToggle(review.id, checked);
    }
  };

  return (
    <Card
      shadow="sm"
      padding="md"
      withBorder
      style={{
        backgroundColor: COLORS.white,
        height: mode === 'public' ? '200px' : '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack gap="sm" style={{ height: '100%' }}>
        {/* Header Section */}
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="xs">
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text fw={FONT_WEIGHTS.semibold} size="sm" c={COLORS.textPrimary} style={{ wordBreak: 'break-word' }}>
              {review.guestName}
            </Text>
            <Text size="xs" c="dimmed">
              {formatDate(review.submittedAt)} • {review.channelName}
            </Text>
          </div>
          <Badge color={getRatingColor(review.rating)} size="sm">
            ⭐ {review.rating.toFixed(1)}
          </Badge>
        </Group>

        {/* Approval Toggle - Dashboard Only */}
        {mode === 'dashboard' && (
          <Switch
            checked={review.approved}
            onChange={(event) => handleApprovalChange(event.currentTarget.checked)}
            label={review.approved ? 'Approved' : 'Not Approved'}
            color="green"
            size="xs"
          />
        )}

        {/* Review Text */}
        <Text
          size="xs"
          c={COLORS.textPrimary}
          style={{
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {review.publicReview}
        </Text>

        {/* Category Badges */}
        <Group gap={4}>
          {review.categories.map((category) => (
            <Badge
              key={category.category}
              variant="outline"
              size="xs"
              color={getRatingColor(category.rating)}
            >
              {category.category.replace('_', ' ')}: {category.rating}
            </Badge>
          ))}
        </Group>
      </Stack>
    </Card>
  );
}
