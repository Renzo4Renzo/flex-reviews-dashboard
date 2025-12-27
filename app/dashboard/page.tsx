'use client';

import { useState, useEffect, useCallback } from 'react';
import { Container, Stack, LoadingOverlay, SimpleGrid, Grid, Box, Text, Group, Button } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';
import { useDashboardStore } from '@/lib/store/dashboardStore';
import { calculatePropertyMetrics } from '@/lib/analytics/calculateMetrics';
import { COLORS } from '@/lib/utils/designSystem';
import broadcastManager from '@/lib/utils/broadcastChannel';
import type { PropertyMetrics } from '@/types/analytics';
import type { PropertyReviews, NormalizedReview } from '@/types/review';

import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PropertyControlBar from '@/components/dashboard/PropertyControlBar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import CategoryPerformance from '@/components/dashboard/CategoryPerformance';
import TrendChart from '@/components/dashboard/TrendChart';
import SentimentDisplay from '@/components/dashboard/SentimentDisplay';
import ChannelStats from '@/components/dashboard/ChannelStats';
import CriticalIssues from '@/components/dashboard/CriticalIssues';
import FiltersModal from '@/components/dashboard/FiltersModal';
import SortButton from '@/components/dashboard/SortButton';
import { ReviewCard } from '@/components/shared/ReviewCard';

export default function DashboardPage() {
  const {
    selectedPropertyId,
    reviews,
    filters,
    sortBy,
    sortOrder,
    setSelectedProperty,
    setReviews,
    setFilters,
    setSorting,
    clearFilters,
    getFilteredReviews,
  } = useDashboardStore();

  const [properties, setProperties] = useState<PropertyReviews[]>([]);
  const [metrics, setMetrics] = useState<PropertyMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string | null>('analytics');
  const [filtersModalOpened, setFiltersModalOpened] = useState(false);

  const filteredReviews = getFilteredReviews();

  const groupReviewsByProperty = (reviews: NormalizedReview[]): PropertyReviews[] => {
    const grouped = reviews.reduce((acc, review) => {
      const { propertyId, propertyName } = review;
      if (!acc[propertyId]) {
        acc[propertyId] = {
          propertyId,
          propertyName,
          reviews: [],
        };
      }
      acc[propertyId].reviews.push(review);
      return acc;
    }, {} as Record<string, PropertyReviews>);

    return Object.values(grouped);
  };

  const fetchAllReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/reviews/hostaway');
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      if (data.status !== 'success') {
        throw new Error('API returned error');
      }

      const groupedProperties = groupReviewsByProperty(data.result);
      setProperties(groupedProperties);

      if (groupedProperties.length > 0) {
        setSelectedProperty('prop-002');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [setSelectedProperty]);

  useEffect(() => {
    fetchAllReviews();
  }, [fetchAllReviews]);

  useEffect(() => {
    if (properties.length > 0) {
      const selectedProperty = properties.find(p => p.propertyId === selectedPropertyId);
      if (selectedProperty) {
        setReviews(selectedProperty.reviews);
        const calculatedMetrics = calculatePropertyMetrics(selectedProperty.reviews);
        setMetrics(calculatedMetrics);
      }
    }
  }, [selectedPropertyId, properties, setReviews]);

  const handlePropertySelect = useCallback((propertyId: string) => {
    setSelectedProperty(propertyId);
  }, [setSelectedProperty]);

  const handleApprovalToggle = useCallback(async (reviewId: number, approved: boolean) => {
    const reviewIndex = reviews.findIndex(r => r.id === reviewId);
    if (reviewIndex === -1) return;

    const originalReviews = [...reviews];
    const updatedReviews = [...reviews];
    updatedReviews[reviewIndex] = { ...updatedReviews[reviewIndex], approved };
    setReviews(updatedReviews);

    try {
      const response = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });

      if (!response.ok) {
        throw new Error('Failed to update approval status');
      }

      const updatedMetrics = calculatePropertyMetrics(updatedReviews);
      setMetrics(updatedMetrics);

      // Broadcast approval change to other tabs AFTER successful update
      // This ensures the data store is updated before other tabs fetch
      broadcastManager.postMessage('review-updates', { type: 'approval-change', reviewId, approved });
    } catch (err) {
      console.error('Error updating approval:', err);
      setReviews(originalReviews);
    }
  }, [reviews, setReviews]);

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleSortChange = useCallback((by: 'date' | 'rating' | 'channel', order: 'asc' | 'desc') => {
    setSorting(by, order);
  }, [setSorting]);

  const handleLogout = () => {
    // TODO: Implement logout logic
    window.location.href = '/login';
  };

  if (error) {
    return (
      <Box style={{ backgroundColor: COLORS.pageBackground, minHeight: '100vh' }} py="xl">
        <Container size="xl">
          <Text c="red" ta="center">{error}</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box style={{ backgroundColor: COLORS.pageBackground, minHeight: '100vh' }}>
      <LoadingOverlay visible={loading} />

      {/* Header with Tabs and Logout */}
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        reviewsCount={filteredReviews.length}
        onLogout={handleLogout}
      />

      <Container size="xl" py="md">
        <Stack gap="lg">
          {/* Property Selector + View Public Page Button */}
          {!loading && properties.length > 0 && (
            <PropertyControlBar
              properties={properties}
              selectedId={selectedPropertyId}
              onSelect={handlePropertySelect}
            />
          )}

          {/* Analytics Tab Content */}
          {activeTab === 'analytics' && metrics && (
            <Stack gap="md">
              {/* Row 1: Three Key Metrics */}
              <StatsOverview metrics={metrics} />

              {/* Row 2: Category Performance + Channel Stats */}
              <Grid gutter="md">
                {metrics.categoryPerformance.length > 0 && (
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <CategoryPerformance categoryPerformance={metrics.categoryPerformance} />
                  </Grid.Col>
                )}

                {metrics.channelStats.length > 0 && (
                  <Grid.Col span={{ base: 12, md: 6 }}>
                    <ChannelStats channelStats={metrics.channelStats} />
                  </Grid.Col>
                )}
              </Grid>

              {/* Row 3: Rating Trends + Sentiment Analysis */}
              <Grid gutter="md">
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <TrendChart trendData={metrics.trendData} />
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 6 }}>
                  <SentimentDisplay sentiment={metrics.sentiment} />
                </Grid.Col>
              </Grid>

              {/* Row 4: Critical Issues */}
              <CriticalIssues criticalReviews={metrics.criticalReviews} />
            </Stack>
          )}

          {/* Reviews Tab Content */}
          {activeTab === 'reviews' && (
            <Stack gap="md">
              {/* Filters and Sort Controls */}
              <Group>
                <Button
                  variant="default"
                  leftSection={<IconFilter size={16} />}
                  onClick={() => setFiltersModalOpened(true)}
                >
                  Filters
                </Button>

                <SortButton
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                />
              </Group>

              {/* Reviews Grid */}
              {filteredReviews.length > 0 ? (
                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="md">
                  {filteredReviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      mode="dashboard"
                      onApprovalToggle={handleApprovalToggle}
                    />
                  ))}
                </SimpleGrid>
              ) : (
                <Text c="dimmed" ta="center" py="xl" size="sm">
                  No reviews match current filters
                </Text>
              )}
            </Stack>
          )}
        </Stack>
      </Container>

      {/* Filters Modal */}
      <FiltersModal
        opened={filtersModalOpened}
        onClose={() => setFiltersModalOpened(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
      />
    </Box>
  );
}
