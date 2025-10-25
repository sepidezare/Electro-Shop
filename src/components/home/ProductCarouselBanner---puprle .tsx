"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCardTwo";
import Link from "next/link";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

export default function ProductCarouselBanner() {
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

  const featuredProducts = products.slice(0, 12);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-gray-200 rounded-lg h-96 animate-pulse"></div>
          <div className="lg:col-span-2">
            <div className="grid grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
      {/* <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-jamjuree">
            Special Offers
          </h2>
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
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch h-full">
        {/* Enhanced Banner Section */}
        <div className="h-full group">
          <div className="bg-gradient-to-br from-gray-900 via-indigo-700 to-purple-900 rounded-2xl h-full flex flex-col justify-between p-8 text-white relative overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20">
            {/* Background Image with Overlay */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-4"
              style={{
                backgroundImage: "url(/images/home/banner/soorati.jpg)",
              }}
            ></div>

            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-20 translate-x-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-16 translate-y-16 animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-xl"></div>

            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></div>
                <span className="text-sm font-medium text-white/90">
                  Limited Time Offer
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-3">
                <h3 className="text-4xl font-bold font-jamjuree tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  Exclusive Deals
                </h3>
                <p className="text-blue-100/90 text-lg leading-relaxed max-w-md font-light">
                  Up to <span className="font-bold text-white">50% OFF</span> on
                  premium selections. Limited quantities available.
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-4">
                <li className="flex items-center text-white/90 group/item hover:text-white transition-colors duration-300">
                  <svg
                    className="w-5 h-5 mr-3 text-green-400 group-hover/item:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">
                    Free shipping on orders over $50
                  </span>
                </li>
                <li className="flex items-center text-white/90 group/item hover:text-white transition-colors duration-300">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-400 group-hover/item:scale-110 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="font-medium">
                    30-day hassle-free returns
                  </span>
                </li>
              </ul>

              {/* CTA Button */}
              <button className="mt-4 px-8 py-3.5 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-white/10 flex items-center gap-2 group/btn">
                <span>Shop Now</span>
                <svg
                  className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>

            {/* Decorative Corner Accents */}
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/30 rounded-tr-2xl"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/30 rounded-bl-2xl"></div>
          </div>
        </div>
        {/* Swiper Carousel Section */}
        <div className="lg:col-span-3 h-full">
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found.</p>
            </div>
          ) : (
            <div className="relative group">
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={24}
                slidesPerView={4}
                slidesPerGroup={4} // Slide exactly 4 products at a time
                navigation={{
                  nextEl: ".custom-next",
                  prevEl: ".custom-prev",
                }}
                pagination={{
                  clickable: true,
                  el: ".custom-pagination",
                }}
                loop={featuredProducts.length > 4}
                className="relative pb-12"
                breakpoints={{
                  320: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                    spaceBetween: 16,
                  },
                  640: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 24,
                  },
                }}
              >
                {featuredProducts.map((product) => (
                  <SwiperSlide key={product._id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows - Positioned inside the carousel container */}
              <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 hover:bg-white border border-gray-200 hover:border-blue-500 rounded-full shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:-translate-x-2 lg:group-hover:translate-x-0 backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors"
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

              <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 hover:bg-white border border-gray-200 hover:border-gray-500 rounded-full shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-x-2 lg:group-hover:translate-x-0 backdrop-blur-sm">
                <svg
                  className="w-6 h-6 text-gray-700 hover:text-blue-600 transition-colors"
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
            </div>
          )}
        </div>
      </div>

      {/* Add custom styles for pagination */}
      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 0.7;
          transition: all 0.3s ease;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #3b82f6;
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }

        /* Ensure arrows are always visible on mobile */
        @media (max-width: 1024px) {
          .custom-prev,
          .custom-next {
            opacity: 1 !important;
            transform: translateX(0) !important;
          }
        }
      `}</style>
    </section>
  );
}
