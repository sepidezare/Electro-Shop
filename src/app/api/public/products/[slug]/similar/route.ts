// src/app/api/public/products/[slug]/similar/route.ts
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoDb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const productsCollection = db.collection('products');
    
    // Find the current product by slug
    const currentProduct = await productsCollection.findOne({
      slug: params.slug
    });

    if (!currentProduct) {
      return NextResponse.json([], { status: 404 });
    }

    const currentCategoryIds = Array.isArray(currentProduct.categories) 
      ? currentProduct.categories 
      : [];

    if (currentCategoryIds.length === 0) {
      return NextResponse.json([]);
    }

    // Try both ObjectId and string formats for categories
    const categoryObjectIds = currentCategoryIds
      .map(id => {
        try {
          return new ObjectId(id);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    const query = {
      $and: [
        { slug: { $ne: params.slug } },
        { inStock: true },
        {
          $or: [
            { categories: { $in: categoryObjectIds } },
            { categories: { $in: currentCategoryIds } }
          ]
        }
      ]
    };

    const similarProducts = await productsCollection
      .find(query)
      .project({ 
        name: 1, 
        slug: 1, 
        categories: 1, 
        categoryNames: 1, 
        inStock: 1,
        image: 1,
        price: 1,           // Add this
        discountPrice: 1,   // Add this
        brand: 1,           // Add this
        stockQuantity: 1    // Add this if needed
      })
      .limit(8) // Limit results
      .toArray();

    console.log(`Found ${similarProducts.length} similar products`);

    // Convert ObjectId to string for serialization
    const serializedProducts = similarProducts.map(product => ({
      ...product,
      _id: product._id.toString(),
      categories: product.categories?.map((cat: any) => cat.toString()) || []
    }));

    return NextResponse.json(serializedProducts);
    
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return NextResponse.json([], { status: 500 });
  }
}