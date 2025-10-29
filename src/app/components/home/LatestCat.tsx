"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import ProductCard from "./LatestProductCard";
import Link from "next/link";

interface LatestProps {
  category?: string; // Can be name, slug, or ID
  title?: string;
  seeAllLink?: string;
  limit?: number;
  autoTitle?: boolean;
}

export default function Latest({
  category,
  title,
  seeAllLink,
  limit = 5,
  autoTitle = true,
}: LatestProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolvedCategory, setResolvedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const baseUrl = "/api/public/products";
        const params = new URLSearchParams();

        if (category) params.append("category", category);
        params.append("limit", limit.toString());

        const url = `${baseUrl}?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();
        const productsData = data.products || data;
        setProducts(Array.isArray(productsData) ? productsData : []);

        // If we have products and autoTitle is enabled, use the first product's category name
        if (autoTitle && productsData.length > 0 && category) {
          setResolvedCategory(category);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [category, limit, autoTitle]);

  // Generate proper links based on category
  const getDisplayTitle = () => {
    if (title) return title;
    if (resolvedCategory) {
      return `New ${
        resolvedCategory.charAt(0).toUpperCase() + resolvedCategory.slice(1)
      } Products`;
    }
    return "Latest Products";
  };

  const getSeeAllLink = () => {
    if (seeAllLink) return seeAllLink;
    if (resolvedCategory) {
      return `/shop?category=${encodeURIComponent(resolvedCategory)}`;
    }
    return "/shop";
  };

  const displayTitle = getDisplayTitle();
  const displaySeeAllLink = getSeeAllLink();

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{displayTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg h-80 animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          <p>Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="w-[80%]">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-jamjuree">
            {displayTitle}
          </h2>
        </div>

        <div className="w-[20%]">
          <Link
            href={displaySeeAllLink}
            className="flex justify-end items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors w-full"
          >
            See All
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 lg:gap-14 gap-5">
          {products.slice(0, limit).map((product, index) => (
            <div
              key={product._id}
              className={`
                ${index >= 4 ? "hidden xl:block" : ""}
              `}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
