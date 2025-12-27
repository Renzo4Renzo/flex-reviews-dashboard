import { SimpleGrid } from '@mantine/core';
import { StatCard } from '@/components/shared/StatCard';
import { PropertyMetrics } from '@/types/analytics';

interface StatsOverviewProps {
  metrics: PropertyMetrics;
}

export default function StatsOverview({ metrics }: StatsOverviewProps) {
  const approvalRate = metrics.totalReviews > 0
    ? Math.round((metrics.approvedReviews / metrics.totalReviews) * 100)
    : 0;

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
      <StatCard
        title="Average Rating"
        value={metrics.avgRating.toFixed(1)}
        delta={metrics.ratingDelta}
        description="vs last 30 days"
        info="The average star rating across all reviews for this property. Delta shows the change compared to the previous 30-day period."
      />
      <StatCard
        title="Total Reviews"
        value={metrics.totalReviews}
        description="Across all channels"
        info="The total number of reviews received from all booking channels (Airbnb, Booking.com, VRBO, etc.)."
      />
      <StatCard
        title="Public Reviews"
        value={metrics.approvedReviews}
        description={`${approvalRate}% approval rate`}
        info="Reviews that have been approved for public display on your property page. Toggle approval in the Reviews tab."
      />
    </SimpleGrid>
  );
}
