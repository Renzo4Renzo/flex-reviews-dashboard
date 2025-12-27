/**
 * Property Details Data
 *
 * Contains all property information for the public-facing pages
 * In production, this would come from a database
 */

export interface PropertyAmenity {
  icon: string;
  name: string;
}

export interface PropertyDetails {
  propertyId: string;
  propertyName: string;
  description: string;
  pricePerNight: number;
  pricePerMonth: number;
  monthlyDiscount: number;
  cleaningFee: number;
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  minimumStay: number;
  amenities: PropertyAmenity[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    houseRules: string[];
  };
}

export const PROPERTY_DETAILS: Record<string, PropertyDetails> = {
  'prop-001': {
    propertyId: 'prop-001',
    propertyName: 'Shoreditch Heights Studio',
    description:
      'Experience the vibrant heart of East London from this stunning modern studio in Shoreditch. This beautifully designed space offers contemporary living with all the amenities you need for a comfortable stay. The studio features high ceilings, large windows flooding the space with natural light, and a sleek open-plan layout perfect for both work and relaxation. Located just moments from trendy cafes, restaurants, and the buzzing nightlife of Shoreditch, you\'ll have everything you need right at your doorstep.',
    pricePerNight: 185,
    pricePerMonth: 4440, // 24 * 185 = 4440 with 20% discount
    monthlyDiscount: 0.2,
    cleaningFee: 60,
    capacity: {
      guests: 2,
      bedrooms: 1,
      beds: 1,
      bathrooms: 1
    },
    minimumStay: 7,
    amenities: [
      { icon: '📶', name: 'High-Speed WiFi' },
      { icon: '🍳', name: 'Full Kitchen' },
      { icon: '🧺', name: 'Washing Machine' },
      { icon: '📺', name: 'Smart TV' },
      { icon: '💨', name: 'Air Conditioning' },
      { icon: '🔥', name: 'Central Heating' },
      { icon: '🛁', name: 'Hair Dryer' },
      { icon: '🧴', name: 'Toiletries' },
      { icon: '🏢', name: 'Workspace' },
      { icon: '🔒', name: 'Self Check-In' },
      { icon: '☕', name: 'Coffee Machine' },
      { icon: '🍽️', name: 'Dishware & Cutlery' }
    ],
    policies: {
      checkIn: 'After 3:00 PM',
      checkOut: 'Before 11:00 AM',
      cancellation: 'Free cancellation up to 7 days before check-in',
      houseRules: [
        'No smoking inside the property',
        'No parties or events',
        'Quiet hours: 10 PM - 8 AM',
        'Maximum 2 guests'
      ]
    }
  },
  'prop-002': {
    propertyId: 'prop-002',
    propertyName: 'Camden Loft',
    description:
      'Discover urban living at its finest in this spacious industrial-chic loft in Camden. Featuring exposed brick walls, soaring ceilings, and an open-plan design, this property perfectly blends character with comfort. The loft offers a dedicated workspace, making it ideal for both short and long-term stays. Located in the heart of Camden, you\'re steps away from the famous markets, live music venues, and Regent\'s Canal. Note: We\'re currently addressing some maintenance issues to improve guest experience.',
    pricePerNight: 220,
    pricePerMonth: 5280, // 24 * 220 = 5280 with 20% discount
    monthlyDiscount: 0.2,
    cleaningFee: 80,
    capacity: {
      guests: 4,
      bedrooms: 2,
      beds: 2,
      bathrooms: 1
    },
    minimumStay: 14,
    amenities: [
      { icon: '📶', name: 'WiFi' }, // Note: Recent reviews mention connectivity issues
      { icon: '🍳', name: 'Kitchen' },
      { icon: '🧺', name: 'Washer/Dryer' },
      { icon: '📺', name: 'TV' },
      { icon: '🔥', name: 'Heating' },
      { icon: '🛁', name: 'Bathtub' },
      { icon: '🏢', name: 'Desk Space' },
      { icon: '🔒', name: 'Keypad Entry' },
      { icon: '☕', name: 'Coffee Maker' },
      { icon: '🍽️', name: 'Kitchen Essentials' },
      { icon: '🧹', name: 'Cleaning Supplies' },
      { icon: '👔', name: 'Iron & Board' }
    ],
    policies: {
      checkIn: 'After 4:00 PM',
      checkOut: 'Before 10:00 AM',
      cancellation: 'Free cancellation up to 14 days before check-in',
      houseRules: [
        'No smoking',
        'No pets allowed',
        'No parties',
        'Respect the neighbors',
        'Maximum 4 guests'
      ]
    }
  },
  'prop-003': {
    propertyId: 'prop-003',
    propertyName: 'Brixton Apartment',
    description:
      'Immerse yourself in the vibrant, multicultural atmosphere of Brixton from this charming apartment. This property offers an authentic London experience with a perfect blend of local character and modern comfort. The apartment features a cozy living space, comfortable bedroom, and a well-equipped kitchen. Located in one of London\'s most culturally rich neighborhoods, you\'ll have access to incredible street food, live music, independent shops, and the famous Brixton Village. Perfect for travelers seeking a genuine local experience.',
    pricePerNight: 165,
    pricePerMonth: 3960, // 24 * 165 = 3960 with 20% discount
    monthlyDiscount: 0.2,
    cleaningFee: 55,
    capacity: {
      guests: 3,
      bedrooms: 1,
      beds: 2,
      bathrooms: 1
    },
    minimumStay: 10,
    amenities: [
      { icon: '📶', name: 'WiFi' },
      { icon: '🍳', name: 'Kitchen' },
      { icon: '🧺', name: 'Washing Machine' },
      { icon: '📺', name: 'Television' },
      { icon: '🔥', name: 'Heating' },
      { icon: '🛁', name: 'Shower' },
      { icon: '💨', name: 'Fan' },
      { icon: '🔒', name: 'Lockbox' },
      { icon: '☕', name: 'Tea & Coffee' },
      { icon: '🍽️', name: 'Cookware' },
      { icon: '🧴', name: 'Basic Toiletries' },
      { icon: '👔', name: 'Clothes Hangers' }
    ],
    policies: {
      checkIn: 'After 3:00 PM',
      checkOut: 'Before 11:00 AM',
      cancellation: 'Free cancellation up to 10 days before check-in',
      houseRules: [
        'No smoking indoors',
        'No parties or large gatherings',
        'Keep noise to a minimum after 10 PM',
        'Maximum 3 guests',
        'Please treat the space with respect'
      ]
    }
  }
};

/**
 * Get details for a specific property
 */
export function getPropertyDetails(propertyId: string): PropertyDetails | undefined {
  return PROPERTY_DETAILS[propertyId];
}

/**
 * Get all property details
 */
export function getAllPropertyDetails(): PropertyDetails[] {
  return Object.values(PROPERTY_DETAILS);
}
