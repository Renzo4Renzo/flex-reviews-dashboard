import { NextResponse } from 'next/server';
import { reviewsStore } from '@/lib/data/reviewsStore';

export async function GET() {
  try {
    const reviews = reviewsStore.getAllReviews();

    return NextResponse.json({
      success: true,
      reviews,
      count: reviews.length,
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
