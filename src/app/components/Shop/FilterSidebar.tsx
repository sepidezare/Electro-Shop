"use client";

import { useState } from "react";
import { Category } from "@/types/category";

interface FilterSidebarProps {
  categories: Category[];
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStockOnly: boolean;
  setInStockOnly: (value: boolean) => void;
  featuredOnly: boolean;
  setFeaturedOnly: (value: boolean) => void;
  todayOfferOnly: boolean;
  setTodayOfferOnly: (value: boolean) => void;
  onClose?: () => void;
}

export default function FilterSidebar({
  categories,
  selectedCategories,
  setSelectedCategories,
  priceRange,
  setPriceRange,
  inStockOnly,
  setInStockOnly,
  featuredOnly,
  setFeaturedOnly,
  todayOfferOnly,
  setTodayOfferOnly,
  onClose,
}: FilterSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const hasSubcategories = (category: Category) => {
    return category.children && category.children.length > 0;
  };

  const isExpanded = (categoryId: string) => {
    return expandedCategories.has(categoryId);
  };

  const handlePriceRangeChange = (index: number, value: number) => {
    const newRange = [...priceRange] as [number, number];
    newRange[index] = value;
    setPriceRange(newRange);
  };

  const handleApplyFilters = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 1000]);
    setInStockOnly(false);
    setFeaturedOnly(false);
    setTodayOfferOnly(false);
  };
  // Recursive function to render categories with subcategories
  const renderCategory = (category: Category, level = 0) => {
    const hasChildren = hasSubcategories(category);
    const expanded = isExpanded(category.id);

    return (
      <div
        key={category.id}
        className={level > 0 ? "ml-4 border-l border-gray-200 pl-3" : ""}
      >
        <div className="flex items-center justify-between py-1">
          <label className="flex items-center flex-1">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleCategoryChange(category.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              {category.name}
              {category.productCount !== undefined && (
                <span className="text-gray-400 ml-1">
                  ({category.productCount})
                </span>
              )}
            </span>
          </label>

          {hasChildren && (
            <button
              onClick={() => toggleCategory(category.id)}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className={`w-4 h-4 transform transition-transform ${
                  expanded ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Render children if category has subcategories */}
        {hasChildren && (
          <div className={`mt-1 space-y-1 ${expanded ? "block" : "hidden"}`}>
            {category.children!.map((child) =>
              renderCategory(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  // Build hierarchical categories structure from flat list
  const buildCategoryTree = (categories: Category[]): Category[] => {
    const categoryMap = new Map();
    const rootCategories: Category[] = [];

    // First pass: create a map of all categories with empty children arrays
    categories.forEach((category) => {
      categoryMap.set(category.id, {
        ...category,
        children: category.children || [],
      });
    });

    // Second pass: build the tree structure using parentId
    categories.forEach((category) => {
      const categoryNode = categoryMap.get(category.id);

      if (category.parentId && categoryMap.has(category.parentId)) {
        // This is a child category - add it to parent's children
        const parent = categoryMap.get(category.parentId);
        parent.children.push(categoryNode);
      } else if (!category.parentId) {
        // This is a root category
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  };

  // Check if this is mobile (has onClose prop)
  const isMobile = !!onClose;

  // Build category tree
  const categoryTree =
    categories && categories.length > 0 ? buildCategoryTree(categories) : [];

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${
        isMobile ? "h-full overflow-y-auto flex flex-col" : ""
      }`}
    >
      {onClose && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>×
          </button>
        </div>
      )}

      {/* Filters Content */}
      <div className={isMobile ? "flex-1 overflow-y-auto" : ""}>
        <div className="space-y-6">
          {/* Categories Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {categoryTree.length > 0 ? (
                categoryTree.map((category) => renderCategory(category))
              ) : (
                <p className="text-sm text-gray-500">No categories available</p>
              )}
            </div>
          </div>

          {/* Price Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Price Range
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">${priceRange[0]}</span>
                <span className="text-sm text-gray-600">${priceRange[1]}</span>
              </div>
              <div className="flex space-x-4">
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) =>
                    handlePriceRangeChange(0, Number(e.target.value))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min="0"
                  max={priceRange[1]}
                />
                <span className="flex items-center text-gray-400">-</span>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) =>
                    handlePriceRangeChange(1, Number(e.target.value))
                  }
                  className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                  min={priceRange[0]}
                  max="10000"
                />
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={priceRange[1]}
                onChange={(e) =>
                  setPriceRange([priceRange[0], Number(e.target.value)])
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Availability Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Availability
            </h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>

          {/* Special Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">
              Special Offers
            </h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={featuredOnly}
                  onChange={(e) => setFeaturedOnly(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Featured Products
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={todayOfferOnly}
                  onChange={(e) => setTodayOfferOnly(e.target.checked)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Today&apos;s Offers
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Filters Button - Only show on mobile */}
      {isMobile && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              onClick={handleClearFilters}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
