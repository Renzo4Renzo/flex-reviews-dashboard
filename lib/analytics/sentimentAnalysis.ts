import { NormalizedReview } from '@/types/review';
import { SentimentData, KeywordMatch } from '@/types/analytics';

const NEGATIVE_KEYWORDS = [
  'dirty',
  'filthy',
  'unclean',
  'mold',
  'moldy',
  'noisy',
  'loud',
  'noise',
  'broken',
  'not working',
  'damaged',
  'expensive',
  'overpriced',
  'not worth',
  'slow wifi',
  'bad wifi',
  'no wifi',
  'uncomfortable',
  'small',
  'tiny',
  'rude',
  'unresponsive',
  'unhelpful',
  'smell',
  'smelly',
  'odor',
];

const POSITIVE_KEYWORDS = [
  'clean',
  'spotless',
  'pristine',
  'comfortable',
  'cozy',
  'spacious',
  'location',
  'convenient',
  'central',
  'responsive',
  'helpful',
  'friendly',
  'quiet',
  'peaceful',
  'value',
  'worth',
  'great price',
  'modern',
  'updated',
  'nice',
];

export function extractKeywords(
  reviews: string[],
  targetKeywords: string[]
): KeywordMatch[] {
  const keywordCounts = new Map<string, { count: number; reviewIds: number[] }>();

  reviews.forEach((review, index) => {
    const lowerReview = review.toLowerCase();

    targetKeywords.forEach((keyword) => {
      if (lowerReview.includes(keyword)) {
        const current = keywordCounts.get(keyword) || { count: 0, reviewIds: [] };
        keywordCounts.set(keyword, {
          count: current.count + 1,
          reviewIds: [...current.reviewIds, index],
        });
      }
    });
  });

  const matches: KeywordMatch[] = Array.from(keywordCounts.entries()).map(
    ([phrase, data]) => ({
      phrase,
      count: data.count,
      reviewIds: data.reviewIds,
    })
  );

  return matches.sort((a, b) => b.count - a.count).slice(0, 5);
}

function generateActionItems(keywords: KeywordMatch[]): string[] {
  const actions: string[] = [];

  keywords.forEach(({ phrase, count }) => {
    if (count < 3) return;

    if (['dirty', 'clean', 'mold', 'filthy', 'unclean', 'smell', 'odor'].some((w) => phrase.includes(w))) {
      actions.push(`Address cleanliness complaints: ${count} reviews mention "${phrase}"`);
    } else if (['noisy', 'noise', 'loud'].some((w) => phrase.includes(w))) {
      actions.push(`Investigate noise insulation: ${count} reviews mention "${phrase}"`);
    } else if (['expensive', 'price', 'worth', 'overpriced'].some((w) => phrase.includes(w))) {
      actions.push(`Review pricing strategy: ${count} reviews mention "${phrase}"`);
    } else if (phrase.includes('wifi')) {
      actions.push(`Upgrade internet: ${count} reviews mention "${phrase}"`);
    } else if (['broken', 'damaged', 'not working'].some((w) => phrase.includes(w))) {
      actions.push(`Conduct repairs: ${count} reviews mention "${phrase}"`);
    }
  });

  return actions.slice(0, 5);
}

export function analyzeSentiment(reviews: NormalizedReview[]): SentimentData {
  const negativeReviews = reviews.filter((r) => r.rating < 7);
  const positiveReviews = reviews.filter((r) => r.rating > 8);

  const negativeTexts = negativeReviews.map((r) => r.publicReview);
  const positiveTexts = positiveReviews.map((r) => r.publicReview);

  const negative = extractKeywords(negativeTexts, NEGATIVE_KEYWORDS);
  const positive = extractKeywords(positiveTexts, POSITIVE_KEYWORDS);

  const actionItems = generateActionItems(negative);

  return {
    negative,
    positive,
    actionItems,
  };
}
