'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import Image from 'next/image';
import Link from 'next/link';

export default function TrendingTechCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/public/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        
        // Trending logic without rating dependency
        const trendingProducts = data
          .filter((product: Product) => 
            product.FeaturedProduct || 
            product.todayOffer ||
            product.discountPrice
          )
          .sort((a: Product, b: Product) => {
            // Sort by featured status first, then by discount
            if (a.FeaturedProduct && !b.FeaturedProduct) return -1;
            if (!a.FeaturedProduct && b.FeaturedProduct) return 1;
            if (a.discountPrice && !b.discountPrice) return -1;
            if (!a.discountPrice && b.discountPrice) return 1;
            return 0;
          })
          .slice(0, 5);
        
        // If no products meet the criteria, just take the first 5
        const finalProducts = trendingProducts.length > 0 ? trendingProducts : data.slice(0, 5);
        setProducts(finalProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const nextSlide = () => {
    if (products.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    if (products.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse bg-gray-200 rounded-2xl h-96"></div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          <p>Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500">No trending products available at the moment.</p>
        </div>
      </section>
    );
  }

  const currentProduct = products[currentIndex];

  return (
    <section className="bg-gradient-to-r from-blue-50 to-purple-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">🔥 Trending Tech</h2>
            <p className="text-gray-600 mt-2">Most loved by our community</p>
          </div>
          
          <Link 
            href="/products" 
            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
          >
            See All Products
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="relative h-80 rounded-xl overflow-hidden">
              <Image
                src={currentProduct.image}
                alt={currentProduct.name}
                fill
                className="object-contain"
                priority
              />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {currentProduct.todayOffer && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Today's Offer
                  </span>
                )}
                {currentProduct.FeaturedProduct && (
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                )}
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Trending
                </span>
              </div>
              {currentProduct.discountPrice && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Save ${(currentProduct.price - currentProduct.discountPrice).toFixed(2)}
                </div>
              )}
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentProduct.name}</h3>
                <p className="text-gray-600 line-clamp-3">
                  {currentProduct.description}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                {currentProduct.discountPrice ? (
                  <>
                    <p className="text-3xl font-bold text-blue-600">${currentProduct.discountPrice}</p>
                    <p className="text-xl text-gray-500 line-through">${currentProduct.price}</p>
                  </>
                ) : (
                  <p className="text-3xl font-bold text-blue-600">${currentProduct.price}</p>
                )}
              </div>
              
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Add to Cart
                </button>
                <button className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </div>
          
          {products.length > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t">
              <div className="flex space-x-2">
                {products.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <div className="text-sm text-gray-500">
                {currentIndex + 1} of {products.length}
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow border"
                >
                  ←
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white shadow hover:shadow-md transition-shadow border"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}