import { NextResponse } from 'next/server';
import { reviewsStore } from '@/lib/data/reviewsStore';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId } = await params;
    const property = reviewsStore.getByProperty(propertyId);

    if (!property) {
      return NextResponse.json(
        { success: false, error: 'Property not found' },
        { status: 404 }
      );
    }

    const approvedReviews = reviewsStore.getApprovedByProperty(propertyId);

    return NextResponse.json({
      success: true,
      propertyName: property.propertyName,
      reviews: approvedReviews,
      count: approvedReviews.length,
    });
  } catch (error) {
    console.error('Error fetching public reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
