"use client";
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import ProductCard from "./LatestProductCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import Link from "next/link";

export default function ProductCarouselBanner() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animateKey, setAnimateKey] = useState(0);
  const [showFilterCarousel, setShowFilterCarousel] = useState(false);
  const filterContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAnimateKey((prev) => prev + 1);
  }, [selectedCategory]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch products and categories in parallel
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch("/api/public/products"),
          fetch("/api/public/categories"),
        ]);

        if (!productsResponse.ok) {
          throw new Error(
            `Failed to fetch products: ${productsResponse.status}`
          );
        }
        if (!categoriesResponse.ok) {
          throw new Error(
            `Failed to fetch categories: ${categoriesResponse.status}`
          );
        }

        const productsData = await productsResponse.json();
        const categoriesData = await categoriesResponse.json();
        // EXTRACT PRODUCTS FROM THE RESPONSE OBJECT
        let productsArray: Product[] = [];

        if (productsData && Array.isArray(productsData.products)) {
          productsArray = productsData.products;
        } else if (Array.isArray(productsData)) {
          productsArray = productsData;
        } else {
          productsArray = [];
        }
        setProducts(productsArray);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Flatten the category tree to get ALL categories including subcategories
  const flattenCategories = (categoryTree: Category[]): Category[] => {
    // SAFE: Check if categoryTree is an array
    if (!Array.isArray(categoryTree)) {
      return [];
    }

    const flattened: Category[] = [];

    const flatten = (categories: Category[]) => {
      categories.forEach((category) => {
        flattened.push(category);
        if (
          category.children &&
          Array.isArray(category.children) &&
          category.children.length > 0
        ) {
          flatten(category.children);
        }
      });
    };

    flatten(categoryTree);
    return flattened;
  };

  // Get all flattened categories - SAFELY
  const allCategoriesFlat = Array.isArray(categories)
    ? flattenCategories(categories)
    : [];

  // Create a map of category IDs to names for easy lookup
  const categoryMap = allCategoriesFlat.reduce((acc, category) => {
    if (category && category.id) {
      acc[category.id] = category.name;
    }
    return acc;
  }, {} as Record<string, string>);
  // SAFELY Get unique category IDs from products
  const allCategoryIds = (Array.isArray(products) ? products : []).flatMap(
    (product) => product?.categories || []
  );
  const uniqueCategoryIds = Array.from(new Set(allCategoryIds)).filter(Boolean);
  // Debug: Check which category IDs from products exist in our category map
  const missingCategoryIds = uniqueCategoryIds.filter(
    (categoryId) => !categoryMap[categoryId]
  );
  // Create category options with both ID and name
  const categoryOptions = uniqueCategoryIds
    .map((categoryId) => {
      const categoryName = categoryMap[categoryId];
      return {
        id: categoryId,
        name: categoryName || `Unknown Category (${categoryId})`,
      };
    })
    .filter((category) => !category.name.startsWith("Unknown Category")); // Only show categories we can identify

  // Check if filter buttons are wrapping to multiple lines
  useEffect(() => {
    const checkWrapping = () => {
      if (filterContainerRef.current) {
        const container = filterContainerRef.current;
        const buttons = container.querySelectorAll("button");

        if (buttons.length === 0) return;

        const firstButtonTop = buttons[0].getBoundingClientRect().top;
        let hasWrapping = false;

        // Check if any button is on a different row (wrapped)
        for (let i = 1; i < buttons.length; i++) {
          const buttonTop = buttons[i].getBoundingClientRect().top;
          // If the top position differs by more than 5px, it's on a new line
          if (Math.abs(buttonTop - firstButtonTop) > 5) {
            hasWrapping = true;
            break;
          }
        }
        setShowFilterCarousel(hasWrapping);
      }
    };

    const resizeObserver = new ResizeObserver(checkWrapping);

    if (filterContainerRef.current) {
      resizeObserver.observe(filterContainerRef.current);
    }

    // Check initially and after a short delay
    const timeoutId = setTimeout(checkWrapping, 100);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timeoutId);
    };
  }, [categoryOptions]);

  // SAFELY Filter products based on selected category
  const filteredProducts =
    selectedCategory === "all"
      ? Array.isArray(products)
        ? products
        : []
      : (Array.isArray(products) ? products : []).filter(
          (product) =>
            product?.categories && product.categories.includes(selectedCategory)
        );

  const featuredProducts = filteredProducts;
  // If no categories are found, don't show the filter section
  const showCategoryFilter = categoryOptions.length > 0;

  const handleCategoryChange = (categoryId: string) => {
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedCategory(categoryId);
      setIsAnimating(false);
    }, 300);
  };

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
    <section className="mx-auto my-10 px-4 sm:px-6 lg:px-8 font-jamjuree rounded-xl">
      {/* Category Filter Section - Only show if we have categories */}
      {showCategoryFilter && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Products
              </h2>
            </div>

            {/* Show regular flex layout if no wrapping, carousel if wrapping occurs */}
            {!showFilterCarousel ? (
              <div ref={filterContainerRef} className="flex flex-wrap gap-2">
                {/* All Categories button */}
                <button
                  key="all"
                  onClick={() => handleCategoryChange("all")}
                  className={`cursor-pointer px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                    selectedCategory === "all"
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All Categories
                </button>

                {/* Category buttons */}
                {categoryOptions.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`cursor-pointer px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category.id
                        ? "bg-blue-500 text-white shadow-md"
                        : " text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            ) : (
              /* Category Filter - Swiper carousel when wrapping occurs */
              <div className="mx-auto md:mx-0 w-[90%] md:w-1/2 lg:w-[4/5] max-w-2xl">
                <Swiper
                  modules={[Navigation, Scrollbar]}
                  spaceBetween={8}
                  slidesPerView={"auto"}
                  navigation={{
                    nextEl: ".filter-swiper-button-next",
                    prevEl: ".filter-swiper-button-prev",
                  }}
                  scrollbar={{
                    hide: false,
                    draggable: true,
                  }}
                  className="filter-swiper !pb-6"
                  freeMode={true}
                  mousewheel={true}
                  resistance={true}
                  resistanceRatio={0.85}
                >
                  {/* All Categories slide */}
                  <SwiperSlide className="!w-auto">
                    <button
                      onClick={() => handleCategoryChange("all")}
                      className={`cursor-pointer px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                        selectedCategory === "all"
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      All Categories
                    </button>
                  </SwiperSlide>

                  {/* Category slides */}
                  {categoryOptions.map((category) => (
                    <SwiperSlide key={category.id} className="!w-auto">
                      <button
                        onClick={() => handleCategoryChange(category.id)}
                        className={`cursor-pointer px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                          selectedCategory === category.id
                            ? "bg-blue-500 text-white shadow-md"
                            : " text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {category.name}
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Show message if no categories are available */}
      {!showCategoryFilter && products.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-1">All products</p>
            </div>
            <div className="text-sm text-gray-500">
              No categories available for filtering
            </div>
          </div>
        </div>
      )}

      {/* Rest of your component */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* Banner Section */}
        <div className="h-full">
          <div className="border border-[#E8E8E8] bg-blue-10 shadow-[2px_2px_12px_rgba(0,0,0,0.2)] rounded-2xl h-full max-h-[390px] flex flex-col px-6 lg:px-8 text-black relative overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/20">
            {/* Background elements and content */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-300/40 to-blue-300/40 rounded-full -translate-x-16 translate-y-16"></div>
            <div className="relative z-10 content-center py-4 h-full">
              <div className="inline-flex items-center px-4 py-2 mb-4 lg:mb-7 bg-white/10 backdrop-blur-sm rounded-full border border-black/20">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-ping"></div>
                <span className="text-xs lg:text-sm font-medium text-black/90">
                  Limited Time Offer
                </span>
              </div>
              <div className="space-y-3">
                <h3 className="mb-4 text-3xl lg:tex-3xl xl:text-4xl font-bold font-jamjuree tracking-tight text-blue-400">
                  Exclusive Deals
                </h3>
                <p className="text-black text-lg leading-relaxed max-w-md font-light">
                  Up to <span className="font-bold text-black">50% OFF</span> on
                  premium selections. Limited quantities available.
                </p>
              </div>
              <Link href="/shop">
                <button className="cursor-pointer md:text-sm lg:text-md mt-4 lg:mt-7 px-4 py-3.5 bg-blue-400 text-white rounded-xl font-semibold hover:bg-blue-500 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-black/10 flex items-center gap-2 group/btn">
                  <span>Explore More</span>
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
              </Link>
            </div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-2xl"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-2xl"></div>
          </div>
        </div>

        {/* Swiper Carousel Section */}
        <div className="xl:col-span-3 md:col-span-2 col-span-1 h-full">
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12 h-full flex items-center justify-center">
              <p className="text-gray-500 text-lg">
                {selectedCategory === "all"
                  ? "No products found."
                  : `No products found in ${
                      categoryMap[selectedCategory] || selectedCategory
                    } category.`}
              </p>
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Show All Products
                </button>
              )}
            </div>
          ) : (
            <div
              key={animateKey}
              className="animate-fadeInX relative group/carousel h-full"
            >
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={16}
                slidesPerView={2}
                slidesPerGroup={2}
                speed={800}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                  verticalClass: "swiper-pagination-vertical",
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 24,
                  },
                  1024: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 24,
                  },
                  1280: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 24,
                  },
                  1536: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 24,
                  },
                }}
                loop={featuredProducts.length >= 4}
                className="!overflow-hidden h-full mb-7"
                watchOverflow={true}
                resizeObserver={true}
              >
                {featuredProducts.map((product) => (
                  <SwiperSlide key={product._id} className="!h-auto">
                    <div className="h-full">
                      <ProductCard product={product} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Navigation buttons */}
              <div className="swiper-button-prev !hidden md:!flex"></div>
              <div className="swiper-button-next !hidden md:!flex"></div>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        /* Style Swiper's default navigation buttons */
        .swiper-button-prev,
        .swiper-button-next {
          width: 48px;
          height: 48px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateX(-8px);
        }

        .swiper-button-next {
          transform: translateX(8px);
        }

        /* Filter swiper specific styles */
        .filter-swiper {
          width: 100%;
          padding-bottom: 24px;
        }

        .filter-swiper .swiper-slide {
          width: auto !important;
        }

        .filter-swiper-button-prev,
        .filter-swiper-button-next {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid #e5e7eb;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          top: 50%;
          transform: translateY(-50%);
        }

        .filter-swiper-button-prev {
          left: -10px;
        }

        .filter-swiper-button-next {
          right: -10px;
        }

        .filter-swiper-button-prev:after,
        .filter-swiper-button-next:after {
          font-size: 12px;
          color: #374151;
        }

        .filter-swiper .swiper-scrollbar {
          height: 4px;
          background: rgba(0, 0, 0, 0.1);
        }

        .filter-swiper .swiper-scrollbar-drag {
          background: #3b82f6;
        }

        /* Show on hover of the parent container */
        .group\/carousel:hover .swiper-button-prev,
        .group\/carousel:hover .swiper-button-next {
          opacity: 1;
          transform: translateX(0);
        }

        .swiper-button-prev:hover,
        .swiper-button-next:hover {
          background: white;
        }

        .swiper-button-prev:hover:after,
        .swiper-button-next:hover:after {
          color: #2563eb;
        }

        /* Always show on mobile */
        @media (max-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            display: none !important;
          }
        }

        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: #d1d5db;
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #3b82f6;
          opacity: 1;
          width: 24px;
          border-radius: 4px;
        }

        /* Ensure Product Cards have consistent height */
        .swiper-slide {
          height: auto;
        }

        .swiper-slide > div {
          height: 100%;
        }

        /* Custom animation */
        @keyframes fadeInX {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeInX {
          animation: fadeInX 0.5s ease-out;
        }
      `}</style>
    </section>
  );
}
