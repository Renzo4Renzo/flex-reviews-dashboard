import dayjs from 'dayjs';
import { NormalizedReview } from '@/types/review';

export function formatDate(date: string): string {
  return dayjs(date).format('MMM DD, YYYY');
}

export function formatDateShort(date: string): string {
  return dayjs(date).format('MMM DD');
}

export function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = dayjs().subtract(days, 'day').toDate();
  return { start, end };
}

export function isWithinRange(
  date: string,
  start: Date | null,
  end: Date | null
): boolean {
  if (!start && !end) return true;
  if (!start || !end) return true;

  const checkDate = dayjs(date);
  return checkDate.isAfter(dayjs(start)) && checkDate.isBefore(dayjs(end));
}

export function groupByMonth(reviews: NormalizedReview[]): Map<string, NormalizedReview[]> {
  const grouped = new Map<string, NormalizedReview[]>();

  reviews.forEach((review) => {
    const monthKey = dayjs(review.submittedAt).format('YYYY-MM');
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }
    grouped.get(monthKey)!.push(review);
  });

  return grouped;
}

export function getLast6Months(): string[] {
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    months.push(dayjs().subtract(i, 'month').format('YYYY-MM'));
  }
  return months;
}
