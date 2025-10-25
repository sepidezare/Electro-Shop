// src/app/api/public/products/test/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('✅ TEST API ROUTE CALLED');
  return NextResponse.json({ message: 'Test API is working!', timestamp: new Date().toISOString() });
}