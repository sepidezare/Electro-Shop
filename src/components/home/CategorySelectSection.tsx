'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

export default function SmartPicksGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/public/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Extract unique categories from products
  const categories = ['all', ...new Set(products.flatMap(p => p.categories))];
  const filteredProducts = selectedCategory === 'all' 
    ? products.slice(0, 8)
    : products.filter(p => p.categories.includes(selectedCategory)).slice(0, 8);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="animate-pulse bg-gray-200 h-8 w-64 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-4 w-96 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          <p>Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">🎯 Smart Picks</h2>
            <p className="text-gray-600 mt-2">
              Curated selection based on popular categories
            </p>
          </div>
          
          <Link 
            href="/products" 
            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            Browse All
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category === 'all' ? 'All Categories' : category}
            </button>
          ))}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-1">
                    {product.todayOffer && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Offer
                      </span>
                    )}
                    {product.FeaturedProduct && (
                      <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Featured
                      </span>
                    )}
                  </div>
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-yellow-400 text-sm">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-gray-500 text-sm">({product.rating})</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {product.discountPrice ? (
                      <>
                        <p className="text-lg font-bold text-blue-600">${product.discountPrice}</p>
                        <p className="text-sm text-gray-500 line-through">${product.price}</p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-blue-600">${product.price}</p>
                    )}
                  </div>
                  
                  <div className="space-y-1 mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.categories.slice(0, 2).map((category, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button 
                    disabled={!product.inStock}
                    className={`w-full py-2 rounded-lg transition-colors text-sm font-semibold ${
                      product.inStock
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}