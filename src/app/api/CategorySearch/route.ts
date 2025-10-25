// /api/CategorySearch/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongoDb';

export async function GET(request: Request) {
  try {
    console.log('🔍 === CATEGORY SEARCH API CALLED ===');
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categoriesParam = searchParams.get('categories') || '';

    console.log('📥 Request parameters:', { query, categoriesParam });

    const client = await clientPromise;
    const db = client.db();

    if (!query.trim() && !categoriesParam) {
      console.log('❌ No search criteria provided');
      return NextResponse.json([]);
    }

    // Build search filters for products
    const productFilters: any = {};

    // Text search for products
    if (query.trim()) {
      productFilters.$or = [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ];
    }

    // Multiple categories filter
    if (categoriesParam) {
      const categoryIds = categoriesParam.split(',');
      console.log('🎯 Applying category filters:', categoryIds);
      
      if (categoryIds.length > 0) {
        productFilters.categories = { $in: categoryIds };
      }
    }

    console.log('🔍 Final MongoDB query:', JSON.stringify(productFilters, null, 2));

    // Search products with filters
    const products = await db.collection('products')
      .find(productFilters)
      .limit(20)
      .toArray();

    console.log('📦 Found products:', products.length);
    
    // Log each product with its categories for verification
    products.forEach((product, index) => {
      const categoryIds = categoriesParam ? categoriesParam.split(',') : [];
      const hasRequestedCategories = product.categories && categoryIds.some(catId => 
        product.categories.includes(catId)
      );
      console.log(`  ${index + 1}. "${product.name}"`);
      console.log(`     Categories: ${JSON.stringify(product.categories)}`);
      console.log(`     Has requested categories: ${hasRequestedCategories}`);
      console.log(`     ---`);
    });

    // Get all categories for mapping
    const allCategories = await db.collection('categories').find({}).toArray();
    const categoryMap = new Map();
    allCategories.forEach(cat => {
      categoryMap.set(cat._id.toString(), cat.name);
      categoryMap.set(cat.id, cat.name);
    });

    console.log('🗂️ Category mapping:', Object.fromEntries(categoryMap));

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

    const results = [...formattedProducts];
    
    console.log('✅ Final results count:', results.length);
    console.log('=== CATEGORY SEARCH API COMPLETE ===\n');
    
    return NextResponse.json(results);
  } catch (error) {
    console.error('❌ Search error:', error);
    return NextResponse.json([], { status: 500 });
  }
}