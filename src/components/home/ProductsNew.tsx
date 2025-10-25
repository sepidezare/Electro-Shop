'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/types/category';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/public/categories');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse bg-gray-200 h-8 w-64 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-40 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          <p>Error loading categories: {error}</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">No categories available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🛍️ Shop by Category
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of electronic categories and find exactly what you're looking for
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group"
            >
              <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group-hover:transform group-hover:scale-105">
                <div className="relative h-32 overflow-hidden">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <div className="text-2xl">📱</div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>
                
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-gray-500 text-sm line-clamp-2 mb-2">
                      {category.description}
                    </p>
                  )}
                  {category.productCount !== undefined && (
                    <p className="text-xs text-blue-600 font-medium">
                      {category.productCount} products
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Categories Section */}
        {categories.filter(cat => !cat.parentId).length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Featured Categories
              </h3>
              <p className="text-gray-600">Our most popular categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories
                .filter(category => !category.parentId)
                .slice(0, 3)
                .map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                      <div className="relative h-48 overflow-hidden">
                        {category.image ? (
                          <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                            <div className="text-4xl">💻</div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-white/90 text-sm line-clamp-2">
                              {category.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-2">
                            {category.productCount !== undefined && (
                              <span className="text-white/80 text-sm">
                                {category.productCount} products
                              </span>
                            )}
                            <span className="text-white text-sm font-semibold bg-blue-600 px-3 py-1 rounded-full">
                              Explore →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            View All Categories
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}