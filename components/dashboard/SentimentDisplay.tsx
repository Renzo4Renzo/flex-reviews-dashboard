import { Card, Text, Badge, Stack, Group } from '@mantine/core';
import { SentimentData } from '@/types/analytics';
import { COLORS, FONT_WEIGHTS } from '@/lib/utils/designSystem';
import InfoTooltip from '@/components/shared/InfoTooltip';

interface SentimentDisplayProps {
  sentiment: SentimentData;
}

const MAX_KEYWORDS_DISPLAY = 6;

export default function SentimentDisplay({ sentiment }: SentimentDisplayProps) {
  const topNegative = sentiment.negative.slice(0, MAX_KEYWORDS_DISPLAY);
  const topPositive = sentiment.positive.slice(0, MAX_KEYWORDS_DISPLAY);

  return (
    <Card shadow="sm" padding="md" withBorder style={{ backgroundColor: COLORS.white, height: '100%' }}>
      <Group gap={4} mb="md">
        <Text size="sm" c="black" tt="uppercase" fw={FONT_WEIGHTS.semibold} style={{ letterSpacing: '0.5px' }}>
          Sentiment Analysis
        </Text>
        <InfoTooltip text="Most frequently mentioned positive and negative keywords from guest reviews. Helps identify what guests love and what needs improvement." />
      </Group>

      <Stack gap="md">
        {/* Positive Keywords - Above */}
        <Stack gap="xs">
          <Text fw={FONT_WEIGHTS.semibold} c="green" size="sm">
            🟢 Positive Keywords
          </Text>
          {topPositive.length > 0 ? (
            <Group gap={4}>
              {topPositive.map((keyword, index) => (
                <Badge
                  key={index}
                  color="green"
                  variant="light"
                  size="sm"
                  style={{ textTransform: 'none' }}
                >
                  {keyword.phrase} ({keyword.count})
                </Badge>
              ))}
            </Group>
          ) : (
            <Text size="xs" c="dimmed">
              No positive patterns
            </Text>
          )}
        </Stack>

        {/* Negative Keywords - Below */}
        <Stack gap="xs">
          <Text fw={FONT_WEIGHTS.semibold} c="red" size="sm">
            🔴 Negative Keywords
          </Text>
          {topNegative.length > 0 ? (
            <Group gap={4}>
              {topNegative.map((keyword, index) => (
                <Badge
                  key={index}
                  color="red"
                  variant="light"
                  size="sm"
                  style={{ textTransform: 'none' }}
                >
                  {keyword.phrase} ({keyword.count})
                </Badge>
              ))}
            </Group>
          ) : (
            <Text size="xs" c="dimmed">
              No negative patterns
            </Text>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
