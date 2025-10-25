import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongoDb';
import { ObjectId } from 'mongodb';
import { Product } from '@/types/product';

// GET single product
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await db.collection('products').findOne({ 
      _id: new ObjectId(id) 
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Convert MongoDB document to Product type
    const serializedProduct: Product = {
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      categories: product.categories || [],
      image: product.image,
      inStock: product.inStock ?? true,
      rating: product.rating || 0,
      todayOffer: product.todayOffer || false,
      featuredProduct: product.featuredProduct || false,
      type: product.type || 'simple',
      sku: product.sku || '',
      brand: product.brand || '',
      stockQuantity: product.stockQuantity || 0,
      weight: product.weight || 0,
      dimensions: product.dimensions || { width: 0, height: 0, depth: 0 },
      shippingClass: product.shippingClass || '',
      hasGuarantee: product.hasGuarantee || false,
      hasReferal: product.hasReferal || false,
      hasChange: product.hasChange || false,
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      attributes: product.attributes || [],
      specifications: product.specifications || [],
      variants: product.variants || [],
      additionalMedia: product.additionalMedia || [],
      slug: product.slug || '',
      createdAt: product.createdAt?.toISOString() || new Date().toISOString(),
      updatedAt: product.updatedAt?.toISOString() || new Date().toISOString()
    };

    return NextResponse.json(serializedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Your existing PUT logic here, using the destructured `id`
    // ... rest of your PUT implementation

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE - Delete product
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Your existing DELETE logic here, using the destructured `id`
    // ... rest of your DELETE implementation

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}