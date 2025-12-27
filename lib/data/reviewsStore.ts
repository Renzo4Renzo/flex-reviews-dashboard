import { PropertyReviews, NormalizedReview, HostawayReview } from '@/types/review';
import { normalizeReview } from '@/lib/utils/normalizeReview';
import rawMockData from '@/data/mock-reviews.json';

interface HostawayApiResponse {
  status: string;
  result: HostawayReview[];
  count: number;
  offset: number | null;
}

// Property mapping based on listingName patterns
const PROPERTY_MAP: Record<string, { id: string; name: string }> = {
  'Shoreditch Heights Studio': { id: 'prop-001', name: 'Shoreditch Heights Studio' },
  'Camden Loft': { id: 'prop-002', name: 'Camden Loft' },
  'Brixton Apartment': { id: 'prop-003', name: 'Brixton Apartment' },
};

class ReviewsDataStore {
  private data: PropertyReviews[] | null = null;

  initialize(): void {
    if (this.data) return;

    const apiResponse = rawMockData as HostawayApiResponse;
    const reviews = apiResponse.result;

    // Group reviews by property based on listingName
    const propertyMap = new Map<string, NormalizedReview[]>();

    reviews.forEach((review) => {
      const propertyInfo = PROPERTY_MAP[review.listingName];
      if (!propertyInfo) {
        console.warn(`Unknown property: ${review.listingName}`);
        return;
      }

      const normalized = normalizeReview(
        review,
        propertyInfo.id,
        propertyInfo.name
      );

      if (!propertyMap.has(propertyInfo.id)) {
        propertyMap.set(propertyInfo.id, []);
      }
      propertyMap.get(propertyInfo.id)!.push(normalized);
    });

    // Convert map to PropertyReviews array
    this.data = Array.from(propertyMap.entries()).map(([propertyId, reviews]) => ({
      propertyId,
      propertyName: PROPERTY_MAP[reviews[0].listingName].name,
      reviews,
    }));
  }

  getAll(): PropertyReviews[] {
    this.initialize();
    return this.data!;
  }

  getByProperty(propertyId: string): PropertyReviews | undefined {
    this.initialize();
    return this.data!.find((p) => p.propertyId === propertyId);
  }

  getAllReviews(): NormalizedReview[] {
    this.initialize();
    return this.data!.flatMap((property) => property.reviews);
  }

  updateReviewApproval(reviewId: number, approved: boolean): NormalizedReview | null {
    this.initialize();

    for (const property of this.data!) {
      const review = property.reviews.find((r) => r.id === reviewId);
      if (review) {
        review.approved = approved;
        return review;
      }
    }

    return null;
  }

  getApprovedByProperty(propertyId: string): NormalizedReview[] {
    const property = this.getByProperty(propertyId);
    if (!property) return [];

    return property.reviews
      .filter((review) => review.approved)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }
}

export const reviewsStore = new ReviewsDataStore();
