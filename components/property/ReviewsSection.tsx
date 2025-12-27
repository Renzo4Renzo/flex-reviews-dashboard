'use client';

import { useState, useMemo } from 'react';
import { Stack, Title, Text, Box, Select, Group, Badge } from '@mantine/core';
import { ReviewCard } from '@/components/shared/ReviewCard';
import { NormalizedReview } from '@/types/review';

interface ReviewsSectionProps {
  reviews: NormalizedReview[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');

  const categoryAverages = useMemo(() => {
    if (reviews.length === 0) return [];

    const categories = ['cleanliness', 'communication', 'location', 'value'] as const;
    return categories.map((category) => {
      const ratings = reviews.flatMap(r =>
        r.categories.filter(c => c.category === category).map(c => c.rating)
      );
      const avg = ratings.reduce((sum, val) => sum + val, 0) / ratings.length;
      return { category, avg };
    });
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    if (sortBy === 'recent') {
      return sorted.sort((a, b) =>
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    } else {
      return sorted.sort((a, b) => b.rating - a.rating);
    }
  }, [reviews, sortBy]);

  if (reviews.length === 0) {
    return (
      <Stack gap="lg">
        <Title order={2} size="h3">Guest Reviews</Title>
        <Text c="dimmed" ta="center" py="xl">
          No reviews yet for this property
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Group justify="space-between" align="center">
        <div>
          <Title order={2} size="h3">Guest Reviews</Title>
          <Group gap="xs" mt="xs">
            {categoryAverages.map(({ category, avg }) => (
              <Badge key={category} variant="light" size="sm">
                {category.charAt(0).toUpperCase() + category.slice(1)}: {avg.toFixed(1)}
              </Badge>
            ))}
          </Group>
        </div>

        <Select
          data={[
            { value: 'recent', label: 'Most Recent' },
            { value: 'highest', label: 'Highest Rated' },
          ]}
          value={sortBy}
          onChange={(value) => value && setSortBy(value as 'recent' | 'highest')}
          style={{ width: 180 }}
          styles={{
            input: {
              color: '#000',
              fontWeight: 500,
            },
            option: {
              color: '#000',
            },
          }}
        />
      </Group>

      <Box
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <Group
          gap="lg"
          wrap="nowrap"
          style={{
            paddingBottom: '1rem',
          }}
        >
          {sortedReviews.map((review) => (
            <Box
              key={review.id}
              style={{
                minWidth: '300px',
                maxWidth: '300px',
                flexShrink: 0,
              }}
            >
              <ReviewCard
                review={review}
                mode="public"
              />
            </Box>
          ))}
        </Group>
      </Box>
    </Stack>
  );
}
