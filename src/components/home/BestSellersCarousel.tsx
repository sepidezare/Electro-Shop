"use client";

import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import ProductCard from "./LatestProductCard";
import Link from "next/link";

export default function BestSellerCarousel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);
  const [slidesToMove, setSlidesToMove] = useState(2); // Number of slides to move
  const carouselRef = useRef<HTMLDivElement>(null);

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

  // Calculate items per view based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1);
        setSlidesToMove(1); // Move 1 slide on mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2);
        setSlidesToMove(2); // Move 2 slides on tablet
      } else if (window.innerWidth < 1280) {
        setItemsPerView(4);
        setSlidesToMove(2); // Move 2 slides on desktop
      } else {
        setItemsPerView(5);
        setSlidesToMove(3); // Move 3 slides on large desktop
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  // Duplicate products for seamless looping
  const duplicatedProducts = [...products, ...products, ...products];

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const nextIndex = prev + slidesToMove;
      // When reaching the end of original products, reset to beginning seamlessly
      if (nextIndex >= products.length) {
        return 0;
      }
      return nextIndex;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const prevIndex = prev - slidesToMove;
      // When going before the start, go to the end
      if (prevIndex < 0) {
        return products.length - 1;
      }
      return prevIndex;
    });
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index % products.length);
  };

  if (loading) {
    return (
      <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
      <section className="mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          <p>Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with title on left and See All on right */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-jamjuree">
            Best Sellers
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl">
            Discover our Latest amazing collection of products with great deals
            and discounts
          </p>
        </div>

        <Link
          href="/products"
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
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

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Carousel Container */}
          <div className="relative overflow-hidden">
            <div
              ref={carouselRef}
              className="flex transition-transform duration-1200 ease-in-out gap-6"
              style={{
                transform: `translateX(-${
                  currentIndex * (100 / itemsPerView)
                }%)`,
              }}
            >
              {duplicatedProducts.map((product, index) => (
                <div
                  key={`${product._id}-${index}`}
                  className="flex-shrink-0"
                  style={{
                    width: `calc(${100 / itemsPerView}% - ${
                      (6 * (itemsPerView - 1)) / itemsPerView
                    }rem)`,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          {/* Navigation Buttons - Always show if there are products */}
          {products.length > 0 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all z-10"
                aria-label="Previous products"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all z-10"
                aria-label="Next products"
              >
                <svg
                  className="w-5 h-5 text-gray-700"
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
              </button>
            </>
          )}
          {/* Dots Indicator
          {products.length > 0 && (
            <div className="flex justify-center mt-8 space-x-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentIndex === index
                      ? "bg-blue-600 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )} */}
        </div>
      )}
    </section>
  );
}
