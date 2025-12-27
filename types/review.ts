export interface ReviewCategory {
  category: 'cleanliness' | 'communication' | 'location' | 'value';
  rating: number;
}

export interface HostawayReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  channelId: number;
}

export interface NormalizedReview {
  id: number;
  type: 'host-to-guest' | 'guest-to-host';
  status: string;
  rating: number;
  publicReview: string;
  categories: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  propertyId: string;
  propertyName: string;
  channelId: number;
  channelName: string;
  approved: boolean;
}

export interface PropertyReviews {
  propertyId: string;
  propertyName: string;
  reviews: NormalizedReview[];
}
