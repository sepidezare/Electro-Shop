"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCardTwo";
import Link from "next/link";

export default function ProductGridBanner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/public/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Get first 8 products for the right side
  const featuredProducts = products.slice(0, 4);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Banner loading skeleton */}
          <div className="lg:col-span-1 bg-gray-200 rounded-lg h-96 animate-pulse"></div>
          {/* Products loading skeleton */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-lg h-80 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
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
    <section className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Special Offers</h2>
          <p className="text-gray-600 mt-2">
            Limited time deals you don't want to miss
          </p>
        </div>

        <Link
          href="/products"
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          View All Products
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch h-full">
        {/* Banner Section */}
        <div className="h-full">
          <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl h-full flex flex-col justify-between p-6 text-white relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-12 translate-y-12"></div>

            {/* Main content */}
            <div className="relative z-10">
              {/* Heading */}
              <h3 className="text-7xl font-bold mb-3">Special Offers</h3>

              {/* Description */}
              <p className="text-blue-100 mb-4 text-sm leading-relaxed">
                Up to 50% off on selected items. Limited time offer!
              </p>

              {/* Feature list */}
              <ul className="space-y-2 mb-6">
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Free shipping over $50
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  30-day return policy
                </li>
                <li className="flex items-center text-sm">
                  <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
                  Premium quality guaranteed
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-2 h-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-6 h-full content-start">
            {featuredProducts.length === 0 ? (
              <div className="text-center py-12 col-span-full">
                <p className="text-gray-500 text-lg">No products found.</p>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
