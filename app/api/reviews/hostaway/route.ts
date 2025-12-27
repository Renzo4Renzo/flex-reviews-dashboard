import { NextResponse } from 'next/server';
import { reviewsStore } from '@/lib/data/reviewsStore';

export async function GET() {
  try {
    // NOTE: In production, this would call the real Hostaway API:
    // const response = await fetch('https://api.hostaway.com/v1/reviews', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.HOSTAWAY_ACCESS_TOKEN}`,
    //   },
    // });
    // const hostawayData = await response.json();
    //
    // For this assessment, using mock data as the sandbox API contains no reviews
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
