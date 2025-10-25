import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongoDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    const client = await clientPromise;
    const db = client.db();

    if (!query.trim()) {
      return NextResponse.json([]);
    }

    // Search products
    const products = await db.collection('products')
      .find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      })
      .limit(10)
      .toArray();

    // Search categories
    const categories = await db.collection('categories')
      .find({
        name: { $regex: query, $options: 'i' }
      })
      .limit(5)
      .toArray();

    // Get all categories for mapping
    const allCategories = await db.collection('categories').find({}).toArray();
    const categoryMap = new Map();
    allCategories.forEach(cat => {
      categoryMap.set(cat._id.toString(), cat.name);
    });

    // Format products with category names
    const formattedProducts = products.map(product => ({
      id: product._id.toString(),
      type: 'product' as const,
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      inStock: product.inStock,
      rating: product.rating,
      todayOffer: product.todayOffer,
      FeaturedProduct: product.FeaturedProduct,
      categories: product.categories || [],
      categoryNames: (product.categories || []).map((catId: string) => 
        categoryMap.get(catId) || 'Uncategorized'
      )
    }));

    // Format categories
    const formattedCategories = categories.map(category => ({
      id: category._id.toString(),
      type: 'category' as const,
      name: category.name,
      slug: category.slug,
      description: category.description,
      // Include these for type compatibility
      price: undefined,
      discountPrice: undefined,
      image: category.image,
      inStock: undefined,
      rating: undefined,
      todayOffer: undefined,
      FeaturedProduct: undefined,
      categoryNames: [category.name] // Categories show their own name
    }));

    const results = [...formattedProducts, ...formattedCategories];
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([], { status: 500 });
  }
}