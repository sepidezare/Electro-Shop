// app/api/public/products/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoDb';
import { categoryService } from '@/lib/CategoryService';

export async function GET(request: Request) {
  try {
    await categoryService.initialize(); // Ensure categories are loaded
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const categories = searchParams.get('categories');
    const featured = searchParams.get('featured');
    const todayOffer = searchParams.get('todayOffer');
    const limit = parseInt(searchParams.get('limit') || '20');
    const page = parseInt(searchParams.get('page') || '1');
    const inStock = searchParams.get('inStock');
    
    // Build filter object
    const filter: Record<string, unknown> = {};

    
    // Category filtering - convert name/slug to ID if needed
    if (category) {
      const foundCategory = categoryService.findCategory(category);
      if (foundCategory) {
        filter.categories = foundCategory._id;
      } else {
        // If no category found, use the original value (might be an ID)
        filter.categories = category;
      }
    }
    
    // Multiple categories filtering
    if (categories) {
      const categoryArray = categories.split(',');
      const categoryIds = categoryArray.map(cat => {
        const found = categoryService.findCategory(cat);
        return found ? found._id : cat;
      });
      filter.categories = { $in: categoryIds };
    }
    
    // ... rest of your existing filters
    if (featured === 'true') filter.featuredProduct = true;
    if (todayOffer === 'true') filter.todayOffer = true;
    if (inStock === 'true') filter.inStock = true;
    else if (inStock === 'false') filter.inStock = false;

    const client = await clientPromise;
    const db = client.db(); 
    const skip = (page - 1) * limit;
    
    const products = await db
      .collection('products')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const totalCount = await db.collection('products').countDocuments(filter);

    const serializedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString(),
    }));

    return NextResponse.json({
      products: serializedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}