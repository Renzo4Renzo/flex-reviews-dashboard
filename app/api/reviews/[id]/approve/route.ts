import { NextResponse } from 'next/server';
import { reviewsStore } from '@/lib/data/reviewsStore';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { approved } = await request.json();

    if (typeof approved !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'approved must be a boolean' },
        { status: 400 }
      );
    }

    const { id } = await params;
    const reviewId = parseInt(id, 10);
    const updatedReview = reviewsStore.updateReviewApproval(reviewId, approved);

    if (!updatedReview) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      review: updatedReview,
    });
  } catch (error) {
    console.error('Error updating review approval:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update review approval' },
      { status: 500 }
    );
  }
}
