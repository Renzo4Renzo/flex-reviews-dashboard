'use client';

import { Container, Stack, Text, Title, Button, Grid, Box, LoadingOverlay, Group } from '@mantine/core';
import { IconUsers, IconBed, IconBath } from '@tabler/icons-react';
import PropertyPageLayout from '@/components/property/PropertyPageLayout';
import ImageGallery from '@/components/property/ImageGallery';
import PropertyInfo from '@/components/property/PropertyInfo';
import BookingPanel from '@/components/property/BookingPanel';
import { getPropertyImages } from '@/lib/data/propertyImages';
import { getPropertyDetails } from '@/lib/data/propertyDetails';
import broadcastManager from '@/lib/utils/broadcastChannel';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { NormalizedReview } from '@/types/review';

const COLORS = {
  pageBackground: '#F8F7F5',
  white: '#FFFFFF'
};

interface PropertyData {
  propertyName: string;
  reviews: NormalizedReview[];
  count: number;
}

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;
  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const subscriptionSetup = useRef(false);

  const propertyDetails = getPropertyDetails(id);
  const images = getPropertyImages(id);

  useEffect(() => {
    async function fetchPropertyData() {
      try {
        const response = await fetch(`/api/reviews/public/${id}`);

        if (!response.ok) {
          setPropertyData(null);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (!data.success) {
          setPropertyData(null);
          setLoading(false);
          return;
        }

        setPropertyData({
          propertyName: data.propertyName,
          reviews: data.reviews,
          count: data.count
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property data:', error);
        setPropertyData(null);
        setLoading(false);
      }
    }

    fetchPropertyData();
  }, [id]);


  // Listen for approval changes from dashboard (cross-tab communication)
  useEffect(() => {
    // Prevent double subscription in React Strict Mode
    if (subscriptionSetup.current) return;
    subscriptionSetup.current = true;

    const unsubscribe = broadcastManager.subscribe('review-updates', async (event) => {
      if (event.data.type === 'approval-change') {
        const { reviewId, approved } = event.data;

        // If unapproving, remove from list
        if (!approved) {
          setPropertyData(prev => {
            if (!prev) return prev;
            return {
              ...prev,
              reviews: prev.reviews.filter(review => review.id !== reviewId),
              count: prev.count - 1
            };
          });
          return;
        }

        // If approving, fetch fresh data to get the newly approved review
        try {
          const response = await fetch(`/api/reviews/public/${id}`);
          if (response.ok) {
            const data = await response.json();
            if (data.success) {
              setPropertyData({
                propertyName: data.propertyName,
                reviews: data.reviews,
                count: data.count
              });
            }
          }
        } catch (error) {
          console.error('Failed to refresh reviews:', error);
        }
      }
    });

    return () => {
      subscriptionSetup.current = false;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only create listener once


  if (loading) {
    return (
      <PropertyPageLayout>
        <Box style={{ position: 'relative', minHeight: 400, backgroundColor: COLORS.pageBackground }}>
          <LoadingOverlay visible={true} />
        </Box>
      </PropertyPageLayout>
    );
  }

  if (!propertyData || !propertyDetails) {
    return (
      <PropertyPageLayout>
        <Box style={{ backgroundColor: COLORS.pageBackground }} py="xl">
          <Container size="xl">
            <Stack gap="md" align="center" style={{ textAlign: 'center', paddingTop: 60 }}>
              <Title order={2}>Property Not Found</Title>
              <Text c="dimmed">
                The property you&apos;re looking for doesn&apos;t exist or has been removed.
              </Text>
              <Button component="a" href="/" variant="outline" mt="md">
                Back to Home
              </Button>
            </Stack>
          </Container>
        </Box>
      </PropertyPageLayout>
    );
  }

  return (
    <PropertyPageLayout>
      <Box style={{ backgroundColor: COLORS.pageBackground, minHeight: '100vh' }}>
        {/* Content Container */}
        <Container size="xl" py="xl">
          <Stack gap="xl">
            {/* Image Gallery - Same width as content */}
            <Box>
              <ImageGallery images={images} propertyName={propertyData.propertyName} />
            </Box>
            {/* Property Title and Stats */}
            <Box>
              <Title order={1} mb="sm" style={{ fontSize: '1.75rem', fontWeight: 600, color: '#000' }}>
                {propertyData.propertyName}
              </Title>

              {/* Quick Stats with Icons */}
              <Group gap="lg">
                <Group gap="xs">
                  <IconUsers size={16} stroke={1.5} color="#868e96" />
                  <Text size="sm" c="dimmed">{propertyDetails.capacity.guests} Guests</Text>
                </Group>

                <Group gap="xs">
                  <IconBed size={16} stroke={1.5} color="#868e96" />
                  <Text size="sm" c="dimmed">{propertyDetails.capacity.bedrooms} Bedrooms</Text>
                </Group>

                <Group gap="xs">
                  <IconBath size={16} stroke={1.5} color="#868e96" />
                  <Text size="sm" c="dimmed">{propertyDetails.capacity.bathrooms} Bathrooms</Text>
                </Group>
              </Group>
            </Box>

            {/* Two-Column Layout */}
            <Grid gutter="xl">
              {/* Left Column: Property Information */}
              <Grid.Col span={{ base: 12, lg: 8 }}>
                <PropertyInfo details={propertyDetails} reviews={propertyData.reviews} />
              </Grid.Col>

              {/* Right Column: Booking Panel (Sticky) */}
              <Grid.Col span={{ base: 12, lg: 4 }}>
                <BookingPanel details={propertyDetails} />
              </Grid.Col>
            </Grid>
          </Stack>
        </Container>
      </Box>
    </PropertyPageLayout>
  );
}
