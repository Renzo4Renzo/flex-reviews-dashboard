import { NextResponse } from 'next/server';
import { reviewsStore } from '@/lib/data/reviewsStore';

export async function GET() {
  try {
    const reviews = reviewsStore.getAllReviews();

    // Return Hostaway API format: { status, result, count, offset }
    return NextResponse.json({
      status: 'success',
      result: reviews,
      count: reviews.length,
      offset: null,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
