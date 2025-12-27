import { create } from 'zustand';
import { NormalizedReview } from '@/types/review';
import dayjs from 'dayjs';

interface FilterState {
  channels: string[];
  categories: string[];
  dateRange: [Date | null, Date | null];
  ratingRange: [number, number];
}

interface DashboardState {
  selectedPropertyId: string;
  reviews: NormalizedReview[];
  filters: FilterState;
  sortBy: 'date' | 'rating' | 'channel';
  sortOrder: 'asc' | 'desc';
  setSelectedProperty: (id: string) => void;
  setReviews: (reviews: NormalizedReview[]) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  setSorting: (by: 'date' | 'rating' | 'channel', order: 'asc' | 'desc') => void;
  clearFilters: () => void;
  getFilteredReviews: () => NormalizedReview[];
}

const initialFilters: FilterState = {
  channels: [],
  categories: [],
  dateRange: [null, null],
  ratingRange: [1, 10],
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  selectedPropertyId: 'prop-001',
  reviews: [],
  filters: initialFilters,
  sortBy: 'date',
  sortOrder: 'desc',

  setSelectedProperty: (id) => set({ selectedPropertyId: id }),

  setReviews: (reviews) => set({ reviews }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  setSorting: (by, order) => set({ sortBy: by, sortOrder: order }),

  clearFilters: () => set({ filters: initialFilters }),

  getFilteredReviews: () => {
    const { reviews, filters, sortBy, sortOrder } = get();

    let filtered = [...reviews];

    // Apply channel filter
    if (filters.channels.length > 0) {
      filtered = filtered.filter((review) =>
        filters.channels.includes(review.channelName)
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter((review) =>
        review.categories.some((cat) => filters.categories.includes(cat.category))
      );
    }

    // Apply date range filter
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const [startDate, endDate] = filters.dateRange;
      filtered = filtered.filter((review) => {
        const reviewDate = dayjs(review.submittedAt);
        return (
          reviewDate.isAfter(dayjs(startDate).startOf('day')) &&
          reviewDate.isBefore(dayjs(endDate).endOf('day'))
        );
      });
    }

    // Apply rating range filter
    filtered = filtered.filter(
      (review) =>
        review.rating >= filters.ratingRange[0] &&
        review.rating <= filters.ratingRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'date') {
        comparison = dayjs(a.submittedAt).unix() - dayjs(b.submittedAt).unix();
      } else if (sortBy === 'rating') {
        comparison = a.rating - b.rating;
      } else if (sortBy === 'channel') {
        comparison = a.channelName.localeCompare(b.channelName);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  },
}));
