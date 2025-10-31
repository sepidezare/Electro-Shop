import clientPromise from '@/lib/mongoDb';
import { NextResponse } from 'next/server';

export async function POST(): Promise<NextResponse> {
  try {
    const client = await clientPromise;
    const db = client.db('test-db'); // Replace with your DB name
    
    const result = await db.collection('test-collection').insertOne({
      message: 'Hello from Vercel!',
      timestamp: new Date(),
      randomId: Math.random().toString(36).substring(7)
    });

    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId,
      message: 'Data added successfully!' 
    });
  } catch (error) {
    console.error('MongoDB error:', error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}