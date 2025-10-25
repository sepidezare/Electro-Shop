// src/components/Products/VariantSelector.tsx
"use client";

import { ProductVariant } from "@/types/product";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant | undefined;
  onSelectVariant: (variant: ProductVariant) => void;
}

export default function VariantSelector({
  variants,
  selectedVariant,
  onSelectVariant,
}: VariantSelectorProps) {
  console.log("VariantSelector Props:", {
    variants,
    selectedVariant,
  });

  if (!variants || variants.length === 0) {
    console.log("No variants to display");
    return null;
  }

  // Since your variants don't have attributes, we'll use the variant name as the option
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Select Variant</h3>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => (
          <button
            key={variant._id}
            type="button"
            className={`px-4 py-1 border-2 rounded-lg font-medium transition-all ${
              selectedVariant?._id === variant._id
                ? "border-blue-600 bg-blue-600 text-white shadow-md"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
            } ${!variant.inStock ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => variant.inStock && onSelectVariant(variant)}
            disabled={!variant.inStock}
          >
            <div className="text-center">
              <div className="font-semibold">{variant.name}</div>
              <div className="text-sm mt-1"></div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected variant details */}
      {selectedVariant && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Selected Variant</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-blue-700">Name:</span>{" "}
              {selectedVariant.name}
            </div>
            <div>
              <span className="text-blue-700">Price:</span> $
              {selectedVariant.price.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
