"use client";

import { useState } from "react";
import {
  Card,
  SimpleGrid,
  Group,
  Text,
  Badge,
  Button,
  Modal,
  Stack,
} from "@mantine/core";
import { CriticalReview } from "@/types/analytics";
import { formatDate } from "@/lib/utils/dateHelpers";
import { formatCategoryName } from "@/lib/utils/helpers";
import { COLORS, FONT_WEIGHTS } from "@/lib/utils/designSystem";
import InfoTooltip from "@/components/shared/InfoTooltip";

interface CriticalIssuesProps {
  criticalReviews: CriticalReview[];
}

export default function CriticalIssues({
  criticalReviews,
}: CriticalIssuesProps) {
  const [selectedReview, setSelectedReview] = useState<CriticalReview | null>(
    null
  );

  if (criticalReviews.length === 0) {
    return (
      <Card
        shadow="sm"
        padding="md"
        withBorder
        style={{ backgroundColor: COLORS.white }}
      >
        <Group gap={4} mb="sm">
          <Text size="sm" c="black" tt="uppercase" fw={FONT_WEIGHTS.semibold} style={{ letterSpacing: '0.5px' }}>
            Critical Issues
          </Text>
          <InfoTooltip text="Reviews with ratings below 5 stars or any category rated below 4. These require immediate attention to maintain property reputation." />
        </Group>
        <Text c="dimmed" size="xs">
          No critical issues in the last 30 days
        </Text>
      </Card>
    );
  }

  return (
    <Card
      shadow="sm"
      padding="md"
      withBorder
      style={{ backgroundColor: COLORS.white }}
    >
      <Group gap={4} mb="md">
        <Text size="sm" c="black" tt="uppercase" fw={FONT_WEIGHTS.semibold} style={{ letterSpacing: '0.5px' }}>
          Critical Issues
        </Text>
        <InfoTooltip text="Reviews with ratings below 5 stars or any category rated below 4. These require immediate attention to maintain property reputation." />
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
        {criticalReviews.map((review) => (
          <Card
            key={review.id}
            withBorder
            padding="sm"
            style={{ backgroundColor: COLORS.pageBackground }}
          >
            <Stack gap="xs">
              <Group justify="space-between">
                <Badge variant="outline" size="xs">
                  {review.channelName}
                </Badge>
                <Text size="xs" c="dimmed">
                  {formatDate(review.date)}
                </Text>
              </Group>

              <Text size="xs" fw={FONT_WEIGHTS.semibold} c={COLORS.textPrimary}>
                {review.guestName}
              </Text>

              <Badge
                color="red"
                variant="light"
                size="xs"
                style={{ alignSelf: "flex-start" }}
              >
                {formatCategoryName(review.worstCategory.category)}:{" "}
                {review.worstCategory.rating}/10
              </Badge>

              <Button
                size="xs"
                variant="outline"
                onClick={() => setSelectedReview(review)}
                fullWidth
              >
                View Details
              </Button>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>

      <Modal
        opened={selectedReview !== null}
        onClose={() => setSelectedReview(null)}
        title="Full Review Details"
        size="lg"
        styles={{
          title: { color: "black", fontWeight: 600 },
          body: { color: "black" },
        }}
      >
        {selectedReview && (
          <Stack gap="md">
            <Group justify="space-between">
              <div>
                <Text fw={600}>{selectedReview.guestName}</Text>
                <Text size="sm" c="black">
                  {formatDate(selectedReview.date)} •{" "}
                  {selectedReview.channelName}
                </Text>
              </div>
              <Badge
                color={selectedReview.rating < 5 ? "red" : "yellow"}
                size="lg"
              >
                ⭐ {selectedReview.rating.toFixed(1)}
              </Badge>
            </Group>

            <div>
              <Text size="sm" fw={600} mb="xs">
                Worst Category:
              </Text>
              <Badge color="red" variant="light" size="lg">
                {formatCategoryName(selectedReview.worstCategory.category)}:{" "}
                {selectedReview.worstCategory.rating}/10
              </Badge>
            </div>

            <div>
              <Text size="sm" fw={600} mb="xs">
                Full Review:
              </Text>
              <Text size="sm" style={{ lineHeight: 1.6 }}>
                {selectedReview.fullReview}
              </Text>
            </div>
          </Stack>
        )}
      </Modal>
    </Card>
  );
}
