// src/app/api/public/products/[slug]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongoDb';
import { ObjectId } from 'mongodb';
import { Product } from '../../../../../types/product';

export async function GET(
  request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    console.log('🔍 GET Product API: Fetching product with slug:', slug);

    const client = await clientPromise;
    const db = client.db();

    const product = await db.collection('products').findOne({ slug });

    if (!product) {
      console.warn(`⚠️ Product not found for slug: ${slug}`);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const categoryNames: string[] = [];
    if (product.categories && Array.isArray(product.categories)) {
      for (const categoryId of product.categories) {
        if (ObjectId.isValid(categoryId)) {
          const category = await db.collection('categories').findOne({
            _id: new ObjectId(categoryId),
          });
          if (category) categoryNames.push(category.name);
        }
      }
    }

    const serializedProduct: Product = {
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      categories: product.categories || [],
      categoryNames,
      image: product.image,
      inStock: product.inStock,
      rating: product.rating || 0,
      additionalMedia: product.additionalMedia || [],
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
      variants: (product.variants || []).map((variant: any) => ({
        ...variant,
        _id: variant._id?.toString?.() || '',
      })),
      todayOffer: product.todayOffer || false,
      featuredProduct: product.featuredProduct || false,
      slug: product.slug || '',
      createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : "",
      updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : "",
    };

    console.log('✅ GET Product API: Successfully fetched product');
    return NextResponse.json(serializedProduct);
  } catch (error) {
    console.error('❌ GET Product API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
