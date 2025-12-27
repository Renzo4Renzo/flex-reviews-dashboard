import { HostawayReview, NormalizedReview, ReviewCategory } from '@/types/review';
import { getChannelName } from './channelMapping';

function calculateAverageFromCategories(categories: ReviewCategory[]): number {
  if (categories.length === 0) return 0;

  const sum = categories.reduce((acc, cat) => acc + cat.rating, 0);
  const average = sum / categories.length;

  return Math.round(average * 10) / 10;
}

export function normalizeReview(
  review: HostawayReview,
  propertyId: string,
  propertyName: string
): NormalizedReview {
  const rating = review.rating ?? calculateAverageFromCategories(review.reviewCategory);

  return {
    ...review,
    rating,
    propertyId,
    propertyName,
    categories: review.reviewCategory,
    channelName: getChannelName(review.channelId),
    approved: false,
  };
}
