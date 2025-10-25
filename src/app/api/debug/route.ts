// /api/debug/search-test/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongoDb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category') || '68f31ad39db6460620fab3c5'; // Mobile category

    const client = await clientPromise;
    const db = client.db();

    console.log('🎯 Testing with category ID:', categoryId);

    // Test different query approaches
    const approaches = [
      { name: 'Direct string match', query: { categories: categoryId } },
      { name: '$in operator', query: { categories: { $in: [categoryId] } } },
      { name: '$eq operator', query: { categories: { $eq: categoryId } } }
    ];

    const results: any = {};

    for (const approach of approaches) {
      console.log(`Testing: ${approach.name}`, approach.query);
      const products = await db.collection('products')
        .find(approach.query)
        .toArray();
      
      results[approach.name] = {
        query: approach.query,
        count: products.length,
        products: products.map(p => ({
          name: p.name,
          categories: p.categories
        }))
      };
    }

    // Also test what happens when we get ALL products
    const allProducts = await db.collection('products').find({}).toArray();
    results.allProducts = {
      count: allProducts.length,
      products: allProducts.map(p => ({
        name: p.name,
        categories: p.categories
      }))
    };

    return NextResponse.json(results);
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json({ error: 'Debug failed' }, { status: 500 });
  }
}