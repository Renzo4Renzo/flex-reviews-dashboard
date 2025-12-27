export interface CategoryPerformance {
  category: string;
  avgRating: number;
  delta30d: number;
  status: 'critical' | 'warning' | 'good';
}

export interface TrendDataPoint {
  month: string;
  avgRating: number;
  cleanliness: number;
  communication: number;
  location: number;
  value: number;
  count: number;
}

export interface ChannelStats {
  channelId: number;
  channelName: string;
  avgRating: number;
  count: number;
  status: 'critical' | 'warning' | 'good';
}

export interface KeywordMatch {
  phrase: string;
  count: number;
  reviewIds: number[];
}

export interface SentimentData {
  negative: KeywordMatch[];
  positive: KeywordMatch[];
  actionItems: string[];
}

export interface CriticalReview {
  id: number;
  date: string;
  channelName: string;
  guestName: string;
  rating: number;
  worstCategory: { category: string; rating: number };
  excerpt: string;
  fullReview: string;
  approved: boolean;
}

export interface PropertyMetrics {
  propertyId: string;
  propertyName: string;
  totalReviews: number;
  approvedReviews: number;
  avgRating: number;
  ratingDelta: number;
  categoryPerformance: CategoryPerformance[];
  trendData: TrendDataPoint[];
  channelStats: ChannelStats[];
  sentiment: SentimentData;
  criticalReviews: CriticalReview[];
}
