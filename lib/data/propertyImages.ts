/**
 * Property Images Data
 *
 * Uses Unsplash Source API for high-quality apartment/interior images
 * Format: https://source.unsplash.com/{width}x{height}/?{keywords},{seed}
 *
 * The seed parameter ensures consistent images per property across page loads
 */

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
}

export interface PropertyImagesData {
  propertyId: string;
  images: PropertyImage[];
}

/**
 * Property image mappings
 * Each property has 3 unique high-quality images from Unsplash using specific photo IDs
 */
export const PROPERTY_IMAGES: Record<string, PropertyImage[]> = {
  'prop-001': [
    {
      id: 'shoreditch-1',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop',
      alt: 'Shoreditch Heights Studio - Modern Living Space'
    },
    {
      id: 'shoreditch-2',
      url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
      alt: 'Shoreditch Heights Studio - Bedroom'
    },
    {
      id: 'shoreditch-3',
      url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop',
      alt: 'Shoreditch Heights Studio - Kitchen'
    }
  ],
  'prop-002': [
    {
      id: 'camden-1',
      url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&h=800&fit=crop',
      alt: 'Camden Loft - Spacious Loft Living'
    },
    {
      id: 'camden-2',
      url: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop',
      alt: 'Camden Loft - Modern Interior'
    },
    {
      id: 'camden-3',
      url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop',
      alt: 'Camden Loft - Kitchen Area'
    }
  ],
  'prop-003': [
    {
      id: 'brixton-1',
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop',
      alt: 'Brixton Apartment - Cozy Living Room'
    },
    {
      id: 'brixton-2',
      url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
      alt: 'Brixton Apartment - Bedroom'
    },
    {
      id: 'brixton-3',
      url: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&h=400&fit=crop',
      alt: 'Brixton Apartment - Dining Area'
    }
  ]
};

/**
 * Get images for a specific property
 */
export function getPropertyImages(propertyId: string): PropertyImage[] {
  return PROPERTY_IMAGES[propertyId] || [];
}

/**
 * Get all property images data
 */
export function getAllPropertyImages(): PropertyImagesData[] {
  return Object.entries(PROPERTY_IMAGES).map(([propertyId, images]) => ({
    propertyId,
    images
  }));
}
