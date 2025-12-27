'use client';

import { Box, Image, SimpleGrid, Button } from '@mantine/core';
import { PropertyImage } from '@/lib/data/propertyImages';

interface ImageGalleryProps {
  images: PropertyImage[];
  propertyName: string;
}

/**
 * Image Gallery Component matching Flex Living grid layout
 * Grid layout: Large image on left, 2x2 smaller images on right
 */
export default function ImageGallery({ images }: ImageGalleryProps) {
  if (images.length === 0) {
    return (
      <Box
        style={{
          height: 400,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8
        }}
      >
        No images available
      </Box>
    );
  }

  // Main image is first image, rest are thumbnails
  const mainImage = images[0];
  const thumbnails = images.slice(1); // Show all remaining images

  return (
    <Box pos="relative">
      <SimpleGrid cols={2} spacing="xs">
        {/* Large main image on the left */}
        <Box style={{ gridRow: 'span 2' }}>
          <Image
            src={mainImage.url}
            alt={mainImage.alt}
            h={400}
            fit="cover"
            radius="md"
          />
        </Box>

        {/* Smaller images on the right - adapt to available images */}
        {thumbnails.map((image) => (
          <Image
            key={image.id}
            src={image.url}
            alt={image.alt}
            h={195}
            fit="cover"
            radius="md"
          />
        ))}
      </SimpleGrid>

      {/* View all photos button */}
      <Button
        pos="absolute"
        bottom={16}
        right={16}
        variant="white"
        size="sm"
        style={{
          backgroundColor: 'white',
          color: '#000',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          fontWeight: 500
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: '8px' }}>
          <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
        </svg>
        View all photos
      </Button>
    </Box>
  );
}
