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

    // Auto-approve specific reviews on startup
    this.autoApproveInitialReviews();
  }

  /**
   * Auto-approves representative reviews for each property on server startup
   * - Shoreditch Heights Studio (prop-001): 3 approvals (excellent property)
   * - Camden Loft (prop-002): 2 approvals (declining property, fewer positive)
   * - Brixton Apartment (prop-003): 4 approvals (good property with channel variation)
   */
  private autoApproveInitialReviews(): void {
    if (!this.data) return;

    // prop-001: Approve 3 high-rated reviews that showcase excellence
    const shoreditchReviews = this.data.find(p => p.propertyId === 'prop-001')?.reviews || [];
    const shoreditchToApprove = shoreditchReviews
      .filter(r => r.rating >= 9)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 3);

    shoreditchToApprove.forEach(review => {
      review.approved = true;
    });

    // prop-002: Approve 2 reviews - mix of good and critical to show decline
    const camdenReviews = this.data.find(p => p.propertyId === 'prop-002')?.reviews || [];
    const camdenGood = camdenReviews
      .filter(r => r.rating >= 7)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 1);

    const camdenCritical = camdenReviews
      .filter(r => r.rating < 7 && r.publicReview.toLowerCase().includes('clean'))
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 1);

    [...camdenGood, ...camdenCritical].forEach(review => {
      review.approved = true;
    });

    // prop-003: Approve 4 reviews showing channel polarization
    const brixtonReviews = this.data.find(p => p.propertyId === 'prop-003')?.reviews || [];
    const brixtonAirbnb = brixtonReviews
      .filter(r => r.channelName === 'Airbnb')
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);

    const brixtonOthers = brixtonReviews
      .filter(r => r.channelName !== 'Airbnb')
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 2);

    [...brixtonAirbnb, ...brixtonOthers].forEach(review => {
      review.approved = true;
    });

    console.log('✓ Auto-approved initial reviews on server startup');
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
