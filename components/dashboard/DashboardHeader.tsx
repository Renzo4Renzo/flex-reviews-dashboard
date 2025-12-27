'use client';

import { Group, Tabs, Button, Box } from '@mantine/core';
import { IconChartBar, IconList, IconLogout } from '@tabler/icons-react';

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
        backgroundColor: '#284E4C',
        borderBottom: '1px solid #1f3a38',
        padding: '0.75rem 0',
      }}
    >
      <Group justify="space-between" px={{ base: 'sm', sm: 'xl' }} gap="xs">
        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="pills"
          styles={{
            tab: {
              color: 'white',
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
            },
          }}
          classNames={{
            tab: 'dashboard-tab',
          }}
        >
          <Tabs.List>
            <Tabs.Tab value="analytics">
              <Box component="span" visibleFrom="sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconChartBar size={16} />
                Analytics
              </Box>
              <Box component="span" hiddenFrom="sm">Analytics</Box>
            </Tabs.Tab>
            <Tabs.Tab value="reviews">
              <Box component="span" visibleFrom="sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconList size={16} />
                Reviews ({reviewsCount})
              </Box>
              <Box component="span" hiddenFrom="sm">Reviews</Box>
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Button
          onClick={onLogout}
          className="dashboard-logout-btn"
          styles={{
            root: {
              color: 'white',
              fontSize: '0.875rem',
              padding: '0.5rem 0.75rem',
              borderRadius: '1000px',
              backgroundColor: 'transparent',
              border: 'none',
            },
          }}
        >
          <Box component="span" visibleFrom="sm" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <IconLogout size={16} />
            Logout
          </Box>
          <Box component="span" hiddenFrom="sm">Logout</Box>
        </Button>
      </Group>
    </Box>
  );
}
