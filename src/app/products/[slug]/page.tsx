// src/app/products/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Product } from "@/types/product";
import ProductDetails from "@/components/Products/ProductDetails";

// Your existing fetchProduct function with better error handling
const fetchProduct = async (identifier: string): Promise<Product | null> => {
  try {
    const response = await fetch(`/api/public/products/${identifier}`);
    if (!response.ok) {
      console.log(`Product API response not OK: ${response.status}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

const fetchSimilarProducts = async (
  productSlug: string
): Promise<Product[]> => {
  try {
    const response = await fetch(
      `/api/public/products/${productSlug}/similar?limit=4`
    );
    if (!response.ok) {
      console.log("Similar products API not OK, returning empty array");
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching similar products:", error);
    return [];
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const identifier = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Make sure your product page is calling the API with the correct slug
  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);

        // Fetch main product
        const productData = await fetchProduct(identifier);
        if (!productData) {
          return;
        }

        setProduct(productData);
        const similarData = await fetchSimilarProducts(productData.slug);

        setSimilarProducts(similarData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (identifier) {
      loadProductData();
    }
  }, [identifier]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600">
            {error || "The product you're looking for doesn't exist."}
          </p>
          <a
            href="/"
            className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back Home
          </a>
        </div>
      </div>
    );
  }

  return <ProductDetails product={product} similarProducts={similarProducts} />;
}
