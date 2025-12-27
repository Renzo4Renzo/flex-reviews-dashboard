import { NormalizedReview } from '@/types/review';
import {
  PropertyMetrics,
  CategoryPerformance,
  TrendDataPoint,
  ChannelStats,
  CriticalReview,
} from '@/types/analytics';
import { analyzeSentiment } from './sentimentAnalysis';
import { groupByMonth, getLast6Months } from '@/lib/utils/dateHelpers';
import dayjs from 'dayjs';

function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return Math.round((sum / numbers.length) * 10) / 10;
}

function calculateRatingDelta(reviews: NormalizedReview[]): number {
  const now = dayjs();
  const thirtyDaysAgo = now.subtract(30, 'day');
  const sixtyDaysAgo = now.subtract(60, 'day');

  const last30Days = reviews.filter((r) =>
    dayjs(r.submittedAt).isAfter(thirtyDaysAgo)
  );

  const previous30Days = reviews.filter((r) => {
    const date = dayjs(r.submittedAt);
    return date.isAfter(sixtyDaysAgo) && date.isBefore(thirtyDaysAgo);
  });

  const last30Avg = calculateAverage(last30Days.map((r) => r.rating));
  const previous30Avg = calculateAverage(previous30Days.map((r) => r.rating));

  return Math.round((last30Avg - previous30Avg) * 10) / 10;
}

function calculateCategoryPerformance(
  reviews: NormalizedReview[]
): CategoryPerformance[] {
  const categories: Array<'cleanliness' | 'communication' | 'location' | 'value'> = [
    'cleanliness',
    'communication',
    'location',
    'value',
  ];

  const now = dayjs();
  const thirtyDaysAgo = now.subtract(30, 'day');
  const sixtyDaysAgo = now.subtract(60, 'day');

  return categories.map((category) => {
    const allRatings = reviews.flatMap((review) =>
      review.categories
        .filter((cat) => cat.category === category)
        .map((cat) => cat.rating)
    );

    const last30Ratings = reviews
      .filter((r) => dayjs(r.submittedAt).isAfter(thirtyDaysAgo))
      .flatMap((review) =>
        review.categories
          .filter((cat) => cat.category === category)
          .map((cat) => cat.rating)
      );

    const previous30Ratings = reviews
      .filter((r) => {
        const date = dayjs(r.submittedAt);
        return date.isAfter(sixtyDaysAgo) && date.isBefore(thirtyDaysAgo);
      })
      .flatMap((review) =>
        review.categories
          .filter((cat) => cat.category === category)
          .map((cat) => cat.rating)
      );

    const avgRating = calculateAverage(allRatings);
    const last30Avg = calculateAverage(last30Ratings);
    const previous30Avg = calculateAverage(previous30Ratings);
    const delta30d = Math.round((last30Avg - previous30Avg) * 10) / 10;

    let status: 'critical' | 'warning' | 'good';
    if (avgRating < 7) {
      status = 'critical';
    } else if (avgRating < 8) {
      status = 'warning';
    } else {
      status = 'good';
    }

    return {
      category,
      avgRating,
      delta30d,
      status,
    };
  });
}

function calculateTrendData(reviews: NormalizedReview[]): TrendDataPoint[] {
  const last6Months = getLast6Months();
  const grouped = groupByMonth(reviews);

  return last6Months.map((month) => {
    const monthReviews = grouped.get(month) || [];

    if (monthReviews.length === 0) {
      return {
        month: dayjs(month).format('MMM'),
        avgRating: 0,
        cleanliness: 0,
        communication: 0,
        location: 0,
        value: 0,
        count: 0,
      };
    }

    const avgRating = calculateAverage(monthReviews.map((r) => r.rating));

    const getCategoryAvg = (category: 'cleanliness' | 'communication' | 'location' | 'value') => {
      const ratings = monthReviews.flatMap((review) =>
        review.categories
          .filter((cat) => cat.category === category)
          .map((cat) => cat.rating)
      );
      return calculateAverage(ratings);
    };

    return {
      month: dayjs(month).format('MMM'),
      avgRating,
      cleanliness: getCategoryAvg('cleanliness'),
      communication: getCategoryAvg('communication'),
      location: getCategoryAvg('location'),
      value: getCategoryAvg('value'),
      count: monthReviews.length,
    };
  });
}

function calculateChannelStats(reviews: NormalizedReview[]): ChannelStats[] {
  const channelGroups = new Map<number, NormalizedReview[]>();

  reviews.forEach((review) => {
    const existing = channelGroups.get(review.channelId) || [];
    channelGroups.set(review.channelId, [...existing, review]);
  });

  const stats: ChannelStats[] = Array.from(channelGroups.entries()).map(
    ([channelId, channelReviews]) => {
      const avgRating = calculateAverage(channelReviews.map((r) => r.rating));

      let status: 'critical' | 'warning' | 'good';
      if (avgRating < 7) {
        status = 'critical';
      } else if (avgRating < 8) {
        status = 'warning';
      } else {
        status = 'good';
      }

      return {
        channelId,
        channelName: channelReviews[0].channelName,
        avgRating,
        count: channelReviews.length,
        status,
      };
    }
  );

  return stats.sort((a, b) => b.avgRating - a.avgRating);
}

function findCriticalReviews(reviews: NormalizedReview[]): CriticalReview[] {
  const thirtyDaysAgo = dayjs().subtract(30, 'day');

  const critical = reviews
    .filter((review) => {
      const isRecent = dayjs(review.submittedAt).isAfter(thirtyDaysAgo);
      const hasLowRating = review.rating < 6;
      const hasLowCategory = review.categories.some((cat) => cat.rating < 5);
      return isRecent && (hasLowRating || hasLowCategory);
    })
    .map((review) => {
      const worstCategory = review.categories.reduce((worst, cat) =>
        cat.rating < worst.rating ? cat : worst
      );

      return {
        id: review.id,
        date: review.submittedAt,
        channelName: review.channelName,
        guestName: review.guestName,
        rating: review.rating,
        worstCategory: {
          category: worstCategory.category,
          rating: worstCategory.rating,
        },
        excerpt: review.publicReview.substring(0, 100),
        fullReview: review.publicReview,
        approved: review.approved,
      };
    })
    .sort((a, b) => dayjs(b.date).unix() - dayjs(a.date).unix());

  return critical.slice(0, 5);
}

export function calculatePropertyMetrics(
  reviews: NormalizedReview[]
): PropertyMetrics {
  if (reviews.length === 0) {
    return {
      propertyId: '',
      propertyName: '',
      totalReviews: 0,
      approvedReviews: 0,
      avgRating: 0,
      ratingDelta: 0,
      categoryPerformance: [],
      trendData: [],
      channelStats: [],
      sentiment: { negative: [], positive: [], actionItems: [] },
      criticalReviews: [],
    };
  }

  const propertyId = reviews[0].propertyId;
  const propertyName = reviews[0].propertyName;

  const totalReviews = reviews.length;
  const approvedReviews = reviews.filter((r) => r.approved).length;
  const avgRating = calculateAverage(reviews.map((r) => r.rating));
  const ratingDelta = calculateRatingDelta(reviews);
  const categoryPerformance = calculateCategoryPerformance(reviews);
  const trendData = calculateTrendData(reviews);
  const channelStats = calculateChannelStats(reviews);
  const sentiment = analyzeSentiment(reviews);
  const criticalReviews = findCriticalReviews(reviews);

  return {
    propertyId,
    propertyName,
    totalReviews,
    approvedReviews,
    avgRating,
    ratingDelta,
    categoryPerformance,
    trendData,
    channelStats,
    sentiment,
    criticalReviews,
  };
}
