"use client";

import { Product } from "@/types/product";
import { getProductPriceRange } from "@/utils/ProductUtils";

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (value: "asc" | "desc") => void;
}

// In your shop page or sorting utility, update the sort functions:
const sortProducts = (
  products: Product[],
  sortBy: string,
  sortOrder: "asc" | "desc"
) => {
  return [...products].sort((a, b) => {
    let aValue: number, bValue: number;

    switch (sortBy) {
      case "price":
        // Use minimum price for sorting variable products
        const aPriceRange = getProductPriceRange(a);
        const bPriceRange = getProductPriceRange(b);
        aValue = aPriceRange.min;
        bValue = bPriceRange.min;
        break;
      case "rating":
        // Handle undefined ratings by providing default values
        aValue = a.rating || 0;
        bValue = b.rating || 0;
        break;
      case "name":
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      default:
        return 0;
    }

    if (sortOrder === "asc") {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });
};

export default function SortDropdown({
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}: SortDropdownProps) {
  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "price", label: "Price" },
    { value: "rating", label: "Rating" },
    { value: "featured", label: "Featured" },
  ];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">Sort by:</span>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <button
        onClick={toggleSortOrder}
        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        title={sortOrder === "asc" ? "Ascending" : "Descending"}
      >
        {sortOrder === "asc" ? "↑" : "↓"}
      </button>
    </div>
  );
}
