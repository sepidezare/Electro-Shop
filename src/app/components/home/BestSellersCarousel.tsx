"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import ProductCard from "./LatestProductCard";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

interface BestSellerCarouselProps {
  category?: string; // Can be name, slug, or ID
  title?: string;
  seeAllLink?: string;
  limit?: number;
  autoTitle?: boolean;
  description?: string;
}

export default function BestSellerCarousel({
  category,
  title,
  seeAllLink,
  limit = 8,
  autoTitle = true,
  description = "Discover our latest amazing collection of products with great deals and discounts",
}: BestSellerCarouselProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [resolvedCategory, setResolvedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Build URL with category filter if provided
        const baseUrl = "/api/public/products";
        const params = new URLSearchParams();

        if (category) params.append("category", category);
        params.append("limit", limit.toString());

        const url = `${baseUrl}?${params.toString()}`;
        console.log("Fetching products for category:", category);

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        const productsData = data.products || data;
        setProducts(Array.isArray(productsData) ? productsData : []);

        // Set resolved category for title generation
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

  // Generate proper title and links based on category
  const getDisplayTitle = () => {
    if (title) return title;
    if (resolvedCategory) {
      // Format category name (e.g., "laptop" -> "Laptop")
      return `${
        resolvedCategory.charAt(0).toUpperCase() + resolvedCategory.slice(1)
      }`;
    }
    return "Best Sellers";
  };

  const getSeeAllLink = () => {
    if (seeAllLink) return seeAllLink;
    if (resolvedCategory) {
      return `/shop?category=${encodeURIComponent(resolvedCategory)}`;
    }
    return "/shop";
  };

  const getDisplayDescription = () => {
    if (resolvedCategory) {
      return `Discover our amazing collection of ${resolvedCategory} with great deals and discounts`;
    }
    return description;
  };

  const displayTitle = getDisplayTitle();
  const displaySeeAllLink = getSeeAllLink();
  const displayDescription = getDisplayDescription();

  if (loading) {
    return (
      <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">{displayTitle}</h2>
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
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-jamjuree">
            {displayTitle}
          </h2>
          <p className="text-gray-600 mt-2 max-w-2xl">{displayDescription}</p>
        </div>

        <Link
          href={displaySeeAllLink}
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
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            slidesPerGroup={2}
            speed={800}
            breakpoints={{
              640: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                speed: 600,
              },
              1024: {
                slidesPerView: 4,
                slidesPerGroup: 3,
                speed: 700,
              },
              1280: {
                slidesPerView: 5,
                slidesPerGroup: 4,
                speed: 800,
              },
            }}
            navigation={{
              nextEl: ".custom-swiper-button-next",
              prevEl: ".custom-swiper-button-prev",
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            loop={true}
            onSwiper={setSwiperInstance}
            onNavigationNext={() => {
              if (swiperInstance) {
                swiperInstance.autoplay.stop();
              }
            }}
            onNavigationPrev={() => {
              if (swiperInstance) {
                swiperInstance.autoplay.stop();
              }
            }}
            className="!overflow-visible"
            grabCursor={true}
            resistance={true}
            resistanceRatio={0.85}
          >
            {products.map((product, index) => (
              <SwiperSlide key={`${product._id}-${index}`}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          {products.length > 0 && (
            <>
              <button
                className="custom-swiper-button-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all z-10"
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
                className="custom-swiper-button-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition-all z-10"
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
        </div>
      )}
    </section>
  );
}
