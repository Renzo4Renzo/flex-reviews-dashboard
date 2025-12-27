'use client';

import { Group, Button } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import PropertySelector from './PropertySelector';
import type { PropertyReviews } from '@/types/review';

interface PropertyControlBarProps {
  properties: PropertyReviews[];
  selectedId: string;
  onSelect: (propertyId: string) => void;
}

export default function PropertyControlBar({
  properties,
  selectedId,
  onSelect
}: PropertyControlBarProps) {
  const handleViewPublicPage = () => {
    window.open(`/property/${selectedId}`, '_blank');
  };

  return (
    <Group gap="md" wrap="wrap" align="flex-end" style={{ width: '100%' }}>
      <div style={{ flex: '1 1 70%', minWidth: '250px' }}>
        <PropertySelector
          properties={properties}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
      <div style={{ flex: '0 1 auto', minWidth: '180px' }}>
        <Button
          rightSection={<IconExternalLink size={16} />}
          onClick={handleViewPublicPage}
          size="md"
          style={{
            backgroundColor: '#284E4C',
            color: 'white'
          }}
        >
          View Public Page
        </Button>
      </div>
    </Group>
  );
}
