'use client';

import { Select } from '@mantine/core';
import { PropertyReviews } from '@/types/review';
import { useMemo } from 'react';

interface PropertySelectorProps {
  properties: PropertyReviews[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function PropertySelector({ properties, selectedId, onSelect }: PropertySelectorProps) {
  const selectData = useMemo(() => {
    return properties.map((property) => ({
      value: property.propertyId,
      label: property.propertyName,
    }));
  }, [properties]);

  const handleChange = (value: string | null) => {
    if (value) {
      onSelect(value);
    }
  };

  return (
    <Select
      placeholder="Select Property"
      data={selectData}
      value={selectedId}
      onChange={handleChange}
      searchable
      clearable={false}
      size="md"
      styles={{
        input: { fontWeight: 500, color: 'black' },
        option: { color: 'black' },
        dropdown: { color: 'black' },
      }}
    />
  );
}
