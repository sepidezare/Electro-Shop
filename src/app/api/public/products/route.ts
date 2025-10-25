import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongoDb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('myDB'); 
    const products = await db
      .collection('products')
      .find({})
      .limit(20) 
      .toArray();

    // Convert MongoDB ObjectId to string
    const serializedProducts = products.map(product => ({
      ...product,
      _id: product._id.toString(),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}