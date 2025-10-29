"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types/category";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

export default function CategoryCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/public/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/shop?category=${categorySlug}`);
  };

  if (loading) {
    return (
      <section className="px-4 bg-white">
        <div className="mx-auto">
          <div className="flex overflow-hidden gap-4 justify-center">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-32 h-32 bg-gray-200 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 bg-white">
        <div className="mx-auto text-center text-red-600">
          <p>Error loading categories: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-5 px-4 bg-white">
      <div className="mx-auto">
        <div className="relative">
          <Swiper
            modules={[Navigation]}
            navigation={{
              nextEl: ".category-swiper-button-next",
              prevEl: ".category-swiper-button-prev",
            }}
            spaceBetween={0}
            slidesPerView={2}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 0,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 0,
              },
            }}
            className="category-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.slug)}
                  className="group w-full p-3 text-left cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center hover:transform hover:scale-105 transition-all duration-300">
                    {/* Circular Card */}
                    <div className="relative w-30 h-30 mb-4 rounded-full overflow-hidden bg-gray-50 border-4 border-white shadow-lg group-hover:shadow-xl group-hover:border-blue-100 transition-all duration-300">
                      {category.image ? (
                        <div className="w-full h-full flex items-center justify-center p-3">
                          <div className="relative w-22 h-22">
                            <Image
                              src={category.image}
                              alt={category.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xl">📦</span>
                        </div>
                      )}

                      {/* Hover overlay */}
                      <div className="absolute inset-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-full" />
                    </div>

                    {/* Category Info */}
                    <div className="max-w-full">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors font-jamjuree">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </button>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button
            className="category-swiper-button-prev cursor-pointer absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Previous categories"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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
            className="category-swiper-button-next cursor-pointer absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-300"
            aria-label="Next categories"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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
      </div>
    </section>
  );
}
