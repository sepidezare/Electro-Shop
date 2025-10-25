import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongoDb';
import { ObjectId } from 'mongodb';

// Define types for MongoDB filters
interface ProductFilters {
  $or?: Array<{
    name?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
  categories?: { $in: string[] };
}

// Define MongoDB product document type
interface ProductDocument {
  _id: ObjectId;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  inStock: boolean;
  rating?: number;
  todayOffer?: boolean;
  FeaturedProduct?: boolean;
  categories?: string[];
}

// Define category document type
interface CategoryDocument {
  _id: ObjectId;
  id?: string;
  name: string;
}

// Define response product type
interface FormattedProduct {
  id: string;
  type: 'product';
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  inStock: boolean;
  rating?: number;
  todayOffer?: boolean;
  FeaturedProduct?: boolean;
  categories: string[];
  categoryNames: string[];
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const categoriesParam = searchParams.get('categories') || ''
    const client = await clientPromise;
    const db = client.db();
    if (!query.trim() && !categoriesParam) {
      return NextResponse.json([]);
    }

    // Build search filters for products with proper typing
    const productFilters: ProductFilters = {};

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
      if (categoryIds.length > 0) {
        productFilters.categories = { $in: categoryIds };
      }
    }

    // Search products with filters
    const products = await db.collection<ProductDocument>('products')
      .find(productFilters)
      .limit(20)
      .toArray();
    // Log each product with its categories for verification
    products.forEach((product, index) => {
      const categoryIds = categoriesParam ? categoriesParam.split(',') : [];
      const hasRequestedCategories = product.categories && categoryIds.some(catId => 
        product.categories?.includes(catId)
      );
    });

    // Get all categories for mapping
    const allCategories = await db.collection<CategoryDocument>('categories').find({}).toArray();
    const categoryMap = new Map<string, string>();
    allCategories.forEach(cat => {
      categoryMap.set(cat._id.toString(), cat.name);
      if (cat.id) {
        categoryMap.set(cat.id, cat.name);
      }
    });
    // Format products with category names
    const formattedProducts: FormattedProduct[] = products.map(product => ({
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
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}