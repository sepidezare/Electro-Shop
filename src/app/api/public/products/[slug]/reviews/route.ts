import { NextRequest, NextResponse } from 'next/server';
import { ReviewSubmission, ProductReview } from '@/types/product';
import fs from 'fs';
import path from 'path';

// Path to the reviews JSON file
const reviewsFilePath = path.join(process.cwd(), 'data', 'reviews.json');

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(reviewsFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Read reviews from file
const readReviews = (): ProductReview[] => {
  try {
    ensureDataDirectory();
    if (fs.existsSync(reviewsFilePath)) {
      const data = fs.readFileSync(reviewsFilePath, 'utf8');
      return JSON.parse(data) as ProductReview[];
    }
  } catch (error) {
    console.error('Error reading reviews file:', error);
  }
  return [];
};

// Write reviews to file
const writeReviews = (reviews: ProductReview[]) => {
  try {
    ensureDataDirectory();
    fs.writeFileSync(reviewsFilePath, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error('Error writing reviews file:', error);
  }
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: productSlug } = await params;
    const reviewData: ReviewSubmission = await request.json();

    // Validate the review data
    if (!reviewData.rating || !reviewData.comment || !reviewData.username || !reviewData.email) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create the review object with userId (you can generate one or use a placeholder)
    const newReview: ProductReview = {
      id: Date.now().toString(),
      ...reviewData,
      userId: reviewData.userId || `user-${Date.now()}`, // Add userId, use existing or generate one
      createdAt: new Date().toISOString(),
      verified: true,
      helpful: 0,
      productSlug: productSlug
    };

    // Read existing reviews, add new one, and save back to file
    const reviews = readReviews();
    reviews.push(newReview);
    writeReviews(reviews);

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Failed to submit review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: productSlug } = await params;

    // Read reviews from file and filter by product slug
    const reviews = readReviews();
    const productReviews = reviews.filter((review: ProductReview) => review.productSlug === productSlug);

    return NextResponse.json(productReviews);
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}