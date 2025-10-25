// src/lib/api.ts
import { Product } from "@/types/product";

export async function getSimilarProducts(
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/products/${productId}/similar?limit=${limit}`,
      { 
        next: { revalidate: 3600 } // Cache for 1 hour
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch similar products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/public/products/slug/${slug}`,
      { 
        next: { revalidate: 3600 } 
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}