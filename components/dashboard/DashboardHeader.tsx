'use client';

import { Group, Tabs, Button, Box } from '@mantine/core';
import { IconChartBar, IconList, IconLogout } from '@tabler/icons-react';
import { COLORS, FONT_WEIGHTS } from '@/lib/utils/designSystem';

interface DashboardHeaderProps {
  activeTab: string | null;
  onTabChange: (value: string | null) => void;
  reviewsCount: number;
  onLogout: () => void;
}

export default function DashboardHeader({
  activeTab,
  onTabChange,
  reviewsCount,
  onLogout
}: DashboardHeaderProps) {
  return (
    <Box
      style={{
        backgroundColor: COLORS.white,
        borderBottom: '1px solid #e9ecef',
        padding: '0.75rem 0',
      }}
    >
      <Group justify="space-between" px={{ base: 'sm', sm: 'xl' }} gap="xs">
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="pills"
        >
          <Tabs.List>
            <Tabs.Tab
              value="analytics"
              c={COLORS.textPrimary}
              style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
            >
              <Box component="span" visibleFrom="sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconChartBar size={16} />
                Analytics
              </Box>
              <Box component="span" hiddenFrom="sm">Analytics</Box>
            </Tabs.Tab>
            <Tabs.Tab
              value="reviews"
              c={COLORS.textPrimary}
              style={{ fontSize: '0.875rem', padding: '0.5rem 0.75rem' }}
            >
              <Box component="span" visibleFrom="sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconList size={16} />
                Reviews ({reviewsCount})
              </Box>
              <Box component="span" hiddenFrom="sm">Reviews</Box>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Button
          variant="outline"
          color="red"
          leftSection={<IconLogout size={14} />}
          onClick={onLogout}
          size="xs"
          style={{ fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
        >
          Logout
        </Button>
      </Group>
    </Box>
  );
}
