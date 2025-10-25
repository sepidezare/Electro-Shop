// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name;
    const extension = path.extname(originalName);
    const filename = `category-${timestamp}${extension}`;
    
    // Create the category directory path
    const categoryDir = path.join(process.cwd(), 'public', 'uploads', 'category');
    
    // Ensure the category directory exists
    if (!existsSync(categoryDir)) {
      await mkdir(categoryDir, { recursive: true });
    }

    // Save to uploads/category directory
    const filepath = path.join(categoryDir, filename);
    
    await writeFile(filepath, buffer);

    // Return the public URL
    const imageUrl = `/uploads/category/${filename}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}