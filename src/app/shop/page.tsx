//src/app/shop/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import SortDropdown from "@/app/components/Shop/SortDropdown";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

// Lazy load heavy components
const ProductCardLazy = dynamic(
  () => import("@/app//components/Products/ProductCard"),
  {
    loading: () => <ProductCardSkeleton />,
  }
);

const FilterSidebarLazy = dynamic(
  () => import("@/app/components/Shop/FilterSidebar"),
  {
    loading: () => <FilterSidebarSkeleton />,
  }
);

// Skeleton components
const ProductCardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
    <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3 mt-4"></div>
    </div>
  </div>
);

const FilterSidebarSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Constants
const ITEMS_PER_PAGE = 20;
const PRICE_RANGE_MAX = 2000;

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    PRICE_RANGE_MAX,
  ]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [todayOfferOnly, setTodayOfferOnly] = useState(false);

  // Sort state
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // UI states
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartNotification, setShowCartNotification] = useState(false);

  // Lazy loading state
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Get URL search parameters
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get("category");

  // Memoized data fetching
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/public/products"),
        fetch("/api/public/categories"),
      ]);

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [productsData, categoriesData] = await Promise.all([
        productsResponse.json(),
        categoriesResponse.json(),
      ]);

      // Handle both response formats for products
      const productsArray = productsData.products || productsData;

      if (!Array.isArray(productsArray)) {
        throw new Error("Invalid products data format");
      }

      setProducts(productsArray);
      setCategories(categoriesData);

      // Log first product to see its structure
      if (productsArray.length > 0) {
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);
  // Fetch products and categories
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle category parameter from URL
  useEffect(() => {
    if (categoryParam && categories.length > 0) {
      // Recursive function to find category by slug in the entire tree
      const findCategoryBySlug = (
        cats: Category[],
        slug: string
      ): Category | null => {
        for (const cat of cats) {
          if (cat.slug === slug) return cat;
          if (cat.children && cat.children.length > 0) {
            const found = findCategoryBySlug(cat.children, slug);
            if (found) return found;
          }
        }
        return null;
      };

      const category = findCategoryBySlug(categories, categoryParam);
      console.log("Found category:", category, "for slug:", categoryParam);

      if (category) {
        setSelectedCategories([category.id]);
      } else {
        console.warn(`Category with slug "${categoryParam}" not found`);
        // Clear selection if category not found
        setSelectedCategories([]);
      }
    } else if (!categoryParam) {
      // Clear selection when no category param
      setSelectedCategories([]);
    }
  }, [categoryParam, categories]);

  // Memoized category name helper
  const getCategoryName = useCallback(
    (categoryId: string) => {
      // First, try to find the category directly
      const category = categories.find((cat) => cat.id === categoryId);
      if (category) return category.name;

      // If not found, search through all children recursively
      const findCategoryInChildren = (cats: Category[]): string | null => {
        for (const cat of cats) {
          if (cat.id === categoryId) return cat.name;
          if (cat.children && cat.children.length > 0) {
            const found = findCategoryInChildren(cat.children);
            if (found) return found;
          }
        }
        return null;
      };

      const foundName = findCategoryInChildren(categories);
      return foundName || categoryId; // Fallback to ID if not found
    },
    [categories]
  );

  // Define sortable field types
  type SortableField = string | number | boolean;

  // Memoized filter and sort logic
  const applyFiltersAndSorting = useCallback(
    (
      productsToFilter: Product[],
      selectedCategories: string[],
      priceRange: [number, number],
      inStockOnly: boolean,
      featuredOnly: boolean,
      todayOfferOnly: boolean,
      sortBy: string,
      sortOrder: "asc" | "desc"
    ) => {
      // Add safety check for products
      if (!productsToFilter || !Array.isArray(productsToFilter)) {
        console.warn("No products to filter");
        return [];
      }

      let result = [...productsToFilter];

      // Category filter
      if (selectedCategories.length > 0) {
        result = result.filter((product) =>
          product.categories?.some((productCategory) =>
            selectedCategories.some(
              (selectedCategory) =>
                productCategory.toLowerCase() === selectedCategory.toLowerCase()
            )
          )
        );
      }

      // Price range filter
      result = result.filter(
        (product) =>
          product.price >= priceRange[0] && product.price <= priceRange[1]
      );

      // In stock filter
      if (inStockOnly) {
        result = result.filter((product) => product.inStock);
      }

      // Featured filter
      if (featuredOnly) {
        result = result.filter((product) => product.featuredProduct);
      }

      // Today's offer filter
      if (todayOfferOnly) {
        result = result.filter((product) => product.todayOffer);
      }

      // Apply sorting
      return result.sort((a, b) => {
        let aValue: SortableField;
        let bValue: SortableField;

        switch (sortBy) {
          case "name":
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
          case "price":
            aValue = a.discountPrice || a.price;
            bValue = b.discountPrice || b.price;
            break;
          case "rating":
            aValue = a.rating || 0;
            bValue = b.rating || 0;
            break;
          case "featured":
            aValue = a.featuredProduct ? 1 : 0;
            bValue = b.featuredProduct ? 1 : 0;
            break;
          default:
            // Default to name sorting if unknown sortBy
            aValue = a.name.toLowerCase();
            bValue = b.name.toLowerCase();
            break;
        }

        if (sortOrder === "asc") {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    },
    []
  );

  // Apply filters and sorting with memoization
  useEffect(() => {
    const filtered = applyFiltersAndSorting(
      products,
      selectedCategories,
      priceRange,
      inStockOnly,
      featuredOnly,
      todayOfferOnly,
      sortBy,
      sortOrder
    );

    setFilteredProducts(filtered);
    // Reset visible count when filters change
    setVisibleCount(ITEMS_PER_PAGE);
  }, [
    products,
    selectedCategories,
    priceRange,
    inStockOnly,
    featuredOnly,
    todayOfferOnly,
    sortBy,
    sortOrder,
    applyFiltersAndSorting,
  ]);

  // Lazy load products
  useEffect(() => {
    setVisibleProducts(filteredProducts.slice(0, visibleCount));
  }, [filteredProducts, visibleCount]);

  // Load more products
  const loadMore = useCallback(async () => {
    setIsLoadingMore(true);

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    setIsLoadingMore(false);
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (visibleCount >= filteredProducts.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById("load-more-sentinel");
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [visibleCount, filteredProducts.length, isLoadingMore, loadMore]);

  // Memoized add to cart function
  const handleAddToCart = useCallback((product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product._id === product._id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });

    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  }, []);

  // Memoized clear filters
  const clearAllFilters = useCallback(() => {
    setSelectedCategories([]);
    setPriceRange([0, PRICE_RANGE_MAX]);
    setInStockOnly(false);
    setFeaturedOnly(false);
    setTodayOfferOnly(false);
    setSortBy("name");
    setSortOrder("asc");
  }, []);

  // Memoized cart item count
  const cartItemCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  // Memoized active filters
  const activeFilters = useMemo(
    () => ({
      hasCategoryFilters: selectedCategories.length > 0,
      hasStockFilter: inStockOnly,
      hasFeaturedFilter: featuredOnly,
      hasOfferFilter: todayOfferOnly,
      hasPriceFilter: priceRange[0] > 0 || priceRange[1] < PRICE_RANGE_MAX,
      hasAnyFilter:
        selectedCategories.length > 0 ||
        inStockOnly ||
        featuredOnly ||
        todayOfferOnly ||
        priceRange[0] > 0 ||
        priceRange[1] < PRICE_RANGE_MAX,
    }),
    [selectedCategories, inStockOnly, featuredOnly, todayOfferOnly, priceRange]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="flex flex-col xl:flex-row gap-8">
              <div className="xl:w-80 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded-lg h-80"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-right">
          ✅ Product added to cart!
        </div>
      )}

      {/* Mobile filter dialog */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="fixed inset-0 bg-black/25 bg-opacity-25"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-white shadow-xl">
            <FilterSidebarLazy
              categories={categories}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              featuredOnly={featuredOnly}
              setFeaturedOnly={setFeaturedOnly}
              todayOfferOnly={todayOfferOnly}
              setTodayOfferOnly={setTodayOfferOnly}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Desktop Filters */}
          <div className="xl:w-80 flex-shrink-0">
            <div className="hidden xl:block">
              <FilterSidebarLazy
                categories={categories}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                featuredOnly={featuredOnly}
                setFeaturedOnly={setFeaturedOnly}
                todayOfferOnly={todayOfferOnly}
                setTodayOfferOnly={setTodayOfferOnly}
              />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="xl:hidden bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Filters
                </button>
                <p className="text-sm text-gray-600">
                  Showing {visibleProducts.length} of {filteredProducts.length}{" "}
                  products
                  {filteredProducts.length > visibleProducts.length &&
                    ` (${
                      filteredProducts.length - visibleProducts.length
                    } more loading...)`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {activeFilters.hasAnyFilter && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all filters
                  </button>
                )}
                <SortDropdown
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.hasAnyFilter && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map((categoryId) => (
                  <span
                    key={categoryId}
                    className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                  >
                    {getCategoryName(categoryId)}
                    <button
                      onClick={() =>
                        setSelectedCategories((prev) =>
                          prev.filter((id) => id !== categoryId)
                        )
                      }
                      className="hover:text-blue-600 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {inStockOnly && (
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    In Stock Only
                    <button
                      onClick={() => setInStockOnly(false)}
                      className="hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {featuredOnly && (
                  <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    Featured
                    <button
                      onClick={() => setFeaturedOnly(false)}
                      className="hover:text-purple-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {todayOfferOnly && (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                    Today&apos;s Offer
                    <button
                      onClick={() => setTodayOfferOnly(false)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid with Lazy Loading */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {visibleProducts.map((product) => (
                    <ProductCardLazy key={product._id} product={product} />
                  ))}
                </div>

                {/* Load More Sentinel for Infinite Scroll */}
                {visibleCount < filteredProducts.length && (
                  <div
                    id="load-more-sentinel"
                    className="flex justify-center mt-8"
                  >
                    <button
                      onClick={loadMore}
                      disabled={isLoadingMore}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoadingMore ? "Loading..." : "Load More Products"}
                    </button>
                  </div>
                )}

                {/* Loading indicator */}
                {isLoadingMore && (
                  <div className="flex justify-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
