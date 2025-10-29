import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoDb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); 
    
    // Get all unique categories
    const categories = await db
      .collection('products')
      .distinct('category');
    
    // Also check if category is in a different field
    const categoryNames = await db
      .collection('products')
      .distinct('category.name');
    
    // Get sample products to see their structure
    const sampleProducts = await db
      .collection('products')
      .find({})
      .project({ name: 1, category: 1, productCategory: 1, type: 1 })
      .limit(10)
      .toArray();

    return NextResponse.json({
      availableCategories: categories,
      categoryNames: categoryNames,
      sampleProducts: sampleProducts.map(p => ({
        name: p.name,
        category: p.category,
        productCategory: p.productCategory,
        type: p.type,
        _id: p._id.toString()
      }))
    });
  } catch (error) {
    console.error('Error debugging categories:', error);
    return NextResponse.json(
      { error: 'Failed to debug categories' },
      { status: 500 }
    );
  }
}