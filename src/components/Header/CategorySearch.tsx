"use client";
import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  description: string;
  parentId: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  inStock: boolean;
  rating: number;
  todayOffer?: boolean;
  FeaturedProduct?: boolean;
  categories: string[];
  categoryNames: string[];
};

type SearchResult =
  | (Product & { id: string; type: "product" })
  | (Category & {
      id: string;
      type: "category";
      price?: number;
      discountPrice?: number;
      image?: string;
      inStock?: boolean;
      rating?: number;
      todayOffer?: boolean;
      FeaturedProduct?: boolean;
      categoryNames?: string[];
    });

export default function CategorySearch() {
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/public/categories");
        const categoriesData = await res.json();
        console.log("📋 Loaded categories:", categoriesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearAllCategories = () => {
    setSelectedCategories([]);
  };

  const debouncedSearch = useCallback(
    (searchQuery: string, categories: string[]) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        console.log("🔍 Starting search with:", { searchQuery, categories });

        if (!searchQuery.trim() && categories.length === 0) {
          console.log("❌ No search criteria, clearing results");
          setResults([]);
          return;
        }

        startTransition(async () => {
          try {
            // Build query parameters
            const params = new URLSearchParams();
            if (searchQuery.trim()) {
              params.append("q", searchQuery);
            }
            if (categories.length > 0) {
              params.append("categories", categories.join(","));
            }

            const apiUrl = `/api/CategorySearch?${params.toString()}`;
            console.log("🚀 Making API request to:", apiUrl);

            const res = await fetch(apiUrl);
            if (!res.ok) {
              throw new Error(`API error: ${res.status}`);
            }

            const data = await res.json();

            console.log("✅ API response received:", {
              url: apiUrl,
              resultsCount: data.length,
              results: data,
            });

            setResults(data);
          } catch (error) {
            console.error("❌ Search error:", error);
            setResults([]);
          }
        });
      }, 300);
    },
    []
  );

  // Update search when categories change
  useEffect(() => {
    debouncedSearch(query, selectedCategories);
  }, [selectedCategories, query, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleSelect = (item: SearchResult) => {
    if (item.type === "product") {
      router.push(`/products/${item.id}`);
    } else {
      router.push(`/categories/${item.slug || item.id}`);
    }
    setQuery("");
    setResults([]);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  };

  const getDisplayCategory = (item: SearchResult) => {
    if (item.type === "category") {
      return item.name;
    }

    if (item.categoryNames && item.categoryNames.length > 0) {
      return item.categoryNames[0];
    }

    return "Uncategorized";
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search products or categories..."
            value={query}
            onChange={handleSearch}
            className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
          />

          {/* Clear search button */}
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          )}

          {isPending && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>

        {/* Multi-category Selector */}
        <div className="relative w-full sm:w-64 flex-shrink-0">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white text-left flex justify-between items-center"
          >
            <span className="truncate">
              {selectedCategories.length === 0
                ? "All Categories"
                : `${selectedCategories.length} category${
                    selectedCategories.length > 1 ? "ies" : ""
                  } selected`}
            </span>
            <span
              className={`transform transition-transform ${
                showCategoryDropdown ? "rotate-180" : ""
              }`}
            >
              ▼
            </span>
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
              <div className="p-2 border-b border-gray-100 flex justify-between items-center">
                <button
                  onClick={clearAllCategories}
                  className="text-sm text-blue-600 hover:bg-blue-50 rounded px-3 py-2"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setShowCategoryDropdown(false)}
                  className="text-gray-400 hover:text-gray-600 text-lg px-2 py-1"
                >
                  ×
                </button>
              </div>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="mr-3 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="flex-1 text-gray-900">{category.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selected Categories Pills */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedCategories.map((catId) => {
            const category = categories.find((c) => c.id === catId);
            return category ? (
              <span
                key={catId}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200"
              >
                {category.name}
                <button
                  onClick={() => toggleCategory(catId)}
                  className="ml-2 hover:text-blue-600 text-blue-800 font-bold"
                >
                  ×
                </button>
              </span>
            ) : null;
          })}
          {selectedCategories.length > 0 && (
            <button
              onClick={clearAllCategories}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Search Results */}
      {(results.length > 0 ||
        (query.length >= 2 && results.length === 0 && !isPending)) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-96 overflow-y-auto z-50">
          {/* Results Header with Close Button */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-2 flex justify-between items-center">
            <div className="text-blue-800 text-sm font-medium">
              {results.length > 0
                ? `Showing ${results.length} results ${
                    selectedCategories.length > 0
                      ? "in selected categories"
                      : ""
                  }`
                : `No results found for &quot;${query}&quot;${
                    selectedCategories.length > 0
                      ? " in selected categories"
                      : ""
                  }`}
            </div>
            <button
              onClick={() => {
                setQuery("");
                setResults([]);
              }}
              className="text-gray-400 hover:text-gray-600 text-lg px-2 py-1 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Results List */}
          {results.length > 0 && (
            <div>
              {results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="p-4 cursor-pointer hover:bg-blue-50 border-b border-gray-50 last:border-b-0 transition-colors flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    {item.type === "product" && item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    ) : (
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${
                          item.type === "product"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      >
                        {item.type === "product" ? "📦" : "📁"}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {item.name}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1 flex-wrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.type === "product"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="truncate max-w-[150px]">
                        in {getDisplayCategory(item)}
                      </span>
                    </div>

                    {item.type === "product" && (
                      <div className="mt-2 space-y-1">
                        {item.discountPrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-green-600">
                              ${item.discountPrice}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ${item.price}
                            </span>
                          </div>
                        ) : (
                          <div className="text-lg font-bold text-green-600">
                            ${item.price}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No Results Message */}
          {results.length === 0 && query.length >= 2 && !isPending && (
            <div className="p-4 text-center">
              <p className="text-gray-500">
                No results found for &quot;
                <span className="font-semibold">{query}</span>&quot;
                {selectedCategories.length > 0 && " in selected categories"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showCategoryDropdown ||
        results.length > 0 ||
        (query.length >= 2 && !isPending)) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowCategoryDropdown(false);
            if (results.length > 0 || query.length >= 2) {
              setResults([]);
              setQuery("");
            }
          }}
        />
      )}
    </div>
  );
}
