'use client';

import { Stack, Title, Text, Grid, Group, Box, Card, Modal } from '@mantine/core';
import { PropertyDetails } from '@/lib/data/propertyDetails';
import { NormalizedReview } from '@/types/review';
import { useState } from 'react';
import ReviewsSection from './ReviewsSection';

interface PropertyInfoProps {
  details: PropertyDetails;
  reviews: NormalizedReview[];
}

const COLORS = {
  white: '#FFFFFF',
  background: '#f5f5f5',
  sectionBg: '#f8f9fa',
  border: '#e0e0e0',
  textDimmed: '#868e96',
  link: '#228be6'
};

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <Card
      withBorder
      padding="xl"
      radius="md"
      style={{
        backgroundColor: COLORS.white,
        borderColor: COLORS.border
      }}
    >
      {children}
    </Card>
  );
}

export default function PropertyInfo({ details, reviews }: PropertyInfoProps) {
  const { description, amenities, policies } = details;
  const [amenitiesModalOpen, setAmenitiesModalOpen] = useState(false);

  return (
    <>
      <Stack gap="lg">
        {/* Guest Reviews */}
        <SectionCard>
          <ReviewsSection reviews={reviews} />
        </SectionCard>

        {/* About This Property */}
        <SectionCard>
          <Title order={2} size="h3" mb="md">
            About this property
          </Title>
          <Text style={{ lineHeight: 1.7 }} c="dark">
            {description}
          </Text>
        </SectionCard>

        {/* Amenities */}
        <SectionCard>
          <Group justify="space-between" mb="md">
            <Title order={2} size="h3">
              Amenities
            </Title>
            <Text
              size="sm"
              c="#000"
              style={{
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
              onClick={() => setAmenitiesModalOpen(true)}
            >
              View all amenities
            </Text>
          </Group>
          <Grid gutter="md">
            {amenities.slice(0, 6).map((amenity, index) => (
              <Grid.Col key={index} span={{ base: 6, sm: 4 }}>
                <Group gap="xs">
                  <Text size="lg">{amenity.icon}</Text>
                  <Text size="sm">{amenity.name}</Text>
                </Group>
              </Grid.Col>
            ))}
          </Grid>
        </SectionCard>

        {/* Stay Policies - Now BEFORE Location */}
        <SectionCard>
          <Title order={2} size="h3" mb="lg">
            Stay Policies
          </Title>
          <Stack gap="md">
            {/* Check-in & Check-out - Grey background section */}
            <Box p="md" style={{ backgroundColor: COLORS.sectionBg, borderRadius: 8 }}>
              <Group gap="xs" mb="md">
                <Text size="sm">🕐</Text>
                <Text size="sm" fw={600}>
                  Check-in & Check-out
                </Text>
              </Group>
              <Grid gutter="md">
                <Grid.Col span={6}>
                  <Box p="md" style={{ backgroundColor: COLORS.white, borderRadius: 8 }}>
                    <Text size="xs" c={COLORS.textDimmed} mb={4}>
                      Check-in Time
                    </Text>
                    <Text size="sm" fw={500}>
                      {policies.checkIn}
                    </Text>
                  </Box>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Box p="md" style={{ backgroundColor: COLORS.white, borderRadius: 8 }}>
                    <Text size="xs" c={COLORS.textDimmed} mb={4}>
                      Check-out Time
                    </Text>
                    <Text size="sm" fw={500}>
                      {policies.checkOut}
                    </Text>
                  </Box>
                </Grid.Col>
              </Grid>
            </Box>

            {/* House Rules - Grey background section */}
            <Box p="md" style={{ backgroundColor: COLORS.sectionBg, borderRadius: 8 }}>
              <Group gap="xs" mb="md">
                <Text size="sm">📋</Text>
                <Text size="sm" fw={600}>
                  House Rules
                </Text>
              </Group>
              <Grid gutter="md">
                {policies.houseRules.slice(0, 4).map((rule, index) => (
                  <Grid.Col key={index} span={6}>
                    <Box p="md" style={{ backgroundColor: COLORS.white, borderRadius: 8 }}>
                      <Group gap="xs">
                        <Text size="sm">🚫</Text>
                        <Text size="sm">{rule}</Text>
                      </Group>
                    </Box>
                  </Grid.Col>
                ))}
              </Grid>
            </Box>

            {/* Cancellation Policy - Grey background section */}
            <Box p="md" style={{ backgroundColor: COLORS.sectionBg, borderRadius: 8 }}>
              <Group gap="xs" mb="sm">
                <Text size="sm">📅</Text>
                <Text size="sm" fw={600}>
                  Cancellation Policy
                </Text>
              </Group>
              <Text size="sm" c={COLORS.textDimmed}>
                {policies.cancellation}
              </Text>
            </Box>
          </Stack>
        </SectionCard>

        {/* Location - Now AFTER Stay Policies */}
        <SectionCard>
          <Title order={2} size="h3" mb="md">
            Location
          </Title>
          <Box
            style={{
              width: '100%',
              height: 300,
              backgroundColor: COLORS.background,
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `
                  linear-gradient(rgba(200, 200, 200, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(200, 200, 200, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
            <Box style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
              <Text size="4rem" style={{ lineHeight: 1 }}>
                📍
              </Text>
              <Text size="sm" fw={600} mt="xs">
                {details.propertyName}
              </Text>
              <Text size="xs" c={COLORS.textDimmed}>
                Interactive map in production
              </Text>
            </Box>
          </Box>
        </SectionCard>
      </Stack>

      {/* Amenities Modal - Matching screenshot 9 exactly */}
      <Modal
        opened={amenitiesModalOpen}
        onClose={() => setAmenitiesModalOpen(false)}
        title="All amenities"
        size="lg"
        centered
        styles={{
          title: { fontWeight: 600, fontSize: '1.25rem', color: '#000' },
          body: { padding: '1.5rem 1.5rem 1rem' }
        }}
      >
        <Stack gap={0}>
          {/* Internet & office */}
          <Box pb="md" style={{ borderBottom: '1px solid #e9ecef' }}>
            <Group gap="xs" mb="md">
              <Text size="sm">📶</Text>
              <Text size="sm" fw={600} c="#495057">Internet & office</Text>
            </Group>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Internet</Text></Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Wireless</Text></Group>
              </Grid.Col>
            </Grid>
          </Box>

          {/* Kitchen & dining */}
          <Box py="md" style={{ borderBottom: '1px solid #e9ecef' }}>
            <Group gap="xs" mb="md">
              <Text size="sm">🍴</Text>
              <Text size="sm" fw={600} c="#495057">Kitchen & dining</Text>
            </Group>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Stack gap="xs">
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Kitchen</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Microwave</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Electric Kettle</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Refrigerator</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Dining Table</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Wine Glasses</Text></Group>
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack gap="xs">
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Toaster</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Oven</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Stove</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Kitchen Utensils</Text></Group>
                  <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Freezer</Text></Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Box>

          {/* Bedroom & laundry */}
          <Box pt="md">
            <Group gap="xs" mb="md">
              <Text size="sm">🛏️</Text>
              <Text size="sm" fw={600} c="#495057">Bedroom & laundry</Text>
            </Group>
            <Grid gutter="md">
              <Grid.Col span={6}>
                <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Washing Machine</Text></Group>
              </Grid.Col>
              <Grid.Col span={6}>
                <Group gap="xs"><Text size="sm" c="#495057">•</Text><Text size="sm" c="#495057">Hangers</Text></Group>
              </Grid.Col>
            </Grid>
          </Box>
        </Stack>
      </Modal>
    </>
  );
}
