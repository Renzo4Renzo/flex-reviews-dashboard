'use client';

import { Card, Stack, Text, Button, Group, NumberInput, Box, Divider } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar, IconUsers, IconShieldCheck, IconCalendarCheck, IconMessageCircle } from '@tabler/icons-react';
import { PropertyDetails } from '@/lib/data/propertyDetails';
import { useState } from 'react';

interface BookingPanelProps {
  details: PropertyDetails;
}

const COLORS = {
  teal: '#284E4C',
  white: '#FFFFFF',
  border: '#e0e0e0',
  textDimmed: '#868e96'
};

export default function BookingPanel({ details }: BookingPanelProps) {
  const [guests, setGuests] = useState(1);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);

  const { pricePerNight, cleaningFee, capacity } = details;

  const nights =
    dateRange[0] && dateRange[1]
      ? Math.ceil((dateRange[1].getTime() - dateRange[0].getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  const subtotal = nights > 0 ? pricePerNight * nights : 0;
  const total = subtotal + cleaningFee;

  return (
    <Card
      withBorder
      padding={0}
      radius="md"
      shadow="sm"
      style={{
        position: 'sticky',
        top: 20,
        overflow: 'hidden',
        borderColor: COLORS.border
      }}
    >
      <Stack gap={0}>
        {/* Teal Header */}
        <Box p="lg" style={{ backgroundColor: COLORS.teal }}>
          <Text size="lg" fw={700} c="white" mb={4}>
            Book Your Stay
          </Text>
          <Text size="sm" c="rgba(255,255,255,0.85)">
            Select dates to see prices
          </Text>
        </Box>

        {/* White Body */}
        <Box p="lg" style={{ backgroundColor: COLORS.white }}>
          <Stack gap="md">
            <DatePickerInput
              type="range"
              placeholder="Select dates"
              value={dateRange}
              onChange={setDateRange}
              minDate={new Date()}
              clearable
              leftSection={<IconCalendar size={16} />}
              styles={{
                input: {
                  minHeight: '36px',
                  height: '36px',
                },
              }}
            />

            <NumberInput
              placeholder="Guests"
              value={guests}
              onChange={(value) => setGuests(Number(value))}
              min={1}
              max={capacity.guests}
              leftSection={<IconUsers size={16} />}
              styles={{
                input: {
                  minHeight: '36px',
                  height: '36px',
                },
              }}
            />

            <Button
              fullWidth
              size="md"
              leftSection={<IconCalendarCheck size={18} />}
              style={{
                backgroundColor: COLORS.teal,
                color: 'white'
              }}
            >
              Check availability
            </Button>

            <Button
              fullWidth
              size="sm"
              variant="outline"
              leftSection={<IconMessageCircle size={18} />}
              style={{
                borderColor: COLORS.border,
                color: COLORS.teal
              }}
            >
              Send Inquiry
            </Button>

            <Group justify="center" gap={6}>
              <IconShieldCheck size={16} color={COLORS.teal} />
              <Text size="xs" c={COLORS.textDimmed}>
                Instant booking confirmation
              </Text>
            </Group>

            {/* Price Breakdown */}
            {nights > 0 && (
              <>
                <Divider color={COLORS.border} mt="md" />
                <Stack gap="sm" mt="md">
                  <Group justify="space-between">
                    <Text size="sm" c={COLORS.textDimmed}>
                      £{pricePerNight} × {nights} nights
                    </Text>
                    <Text size="sm" fw={500}>
                      £{subtotal.toLocaleString()}
                    </Text>
                  </Group>
                  <Group justify="space-between">
                    <Text size="sm" c={COLORS.textDimmed}>Cleaning fee</Text>
                    <Text size="sm" fw={500}>
                      £{cleaningFee}
                    </Text>
                  </Group>
                  <Divider color={COLORS.border} />
                  <Group justify="space-between">
                    <Text fw={700}>Total</Text>
                    <Text fw={700} size="lg">
                      £{total.toLocaleString()}
                    </Text>
                  </Group>
                </Stack>
              </>
            )}
          </Stack>
        </Box>
      </Stack>
    </Card>
  );
}
