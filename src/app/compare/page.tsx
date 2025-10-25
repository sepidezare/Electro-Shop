// src/app/compare/page.tsx
"use client";

import { useComparison } from "@/context/ComparisonContext";
import Link from "next/link";
import { Product, ProductSpecification } from "@/types/product";

// Helper function to get specification value with proper type checking
const getSpecValue = (
  specs: ProductSpecification[] | undefined,
  key: string
) => {
  if (!specs || !Array.isArray(specs)) {
    return "—";
  }
  const spec = specs.find((s) => s.key === key);
  return spec?.value || "—";
};

// Common specifications to compare
const COMMON_SPECS = [
  "Brand",
  "Model",
  "Color",
  "Size",
  "Weight",
  "Material",
  "Warranty",
  "Features",
];

export default function ComparePage() {
  const { comparisonProducts, removeFromComparison, clearComparison } =
    useComparison();

  if (comparisonProducts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              No Products to Compare
            </h2>
            <p className="text-gray-600 mb-8">
              Add products to comparison to see them side by side.
            </p>
            <Link
              href="/shop"
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get all unique specification keys from all products
  const allSpecs = Array.from(
    new Set(
      comparisonProducts.flatMap(
        (product) => product.specifications?.map((spec) => spec.key) || []
      )
    )
  );

  const specsToShow = [...new Set([...COMMON_SPECS, ...allSpecs])];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Comparison
            </h1>
            <p className="text-gray-600 mt-2">
              Comparing {comparisonProducts.length} product
              {comparisonProducts.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={clearComparison}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
            <Link
              href="/shop"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add More Products
            </Link>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 bg-gray-50 font-semibold text-gray-900 min-w-[200px]">
                    Specifications
                  </th>
                  {comparisonProducts.map((product) => (
                    <th
                      key={product._id}
                      className="text-center p-4 bg-gray-50 min-w-[250px]"
                    >
                      <div className="relative">
                        <button
                          onClick={() => removeFromComparison(product._id)}
                          className="absolute -top-2 -right-2 text-gray-400 hover:text-red-500"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-24 h-24 object-cover mx-auto mb-3 rounded-lg"
                        />
                        <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="space-y-1">
                          <p className="text-lg font-bold text-gray-900">
                            ${product.discountPrice || product.price}
                          </p>
                          {product.discountPrice &&
                            product.discountPrice < product.price && (
                              <p className="text-sm text-gray-500 line-through">
                                ${product.price}
                              </p>
                            )}
                        </div>
                        <Link
                          href={`/products/${product.slug}`}
                          className="mt-3 inline-block text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    Price
                  </td>
                  {comparisonProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          ${product.discountPrice || product.price}
                        </p>
                        {product.discountPrice &&
                          product.discountPrice < product.price && (
                            <p className="text-sm text-gray-500 line-through">
                              ${product.price}
                            </p>
                          )}
                      </div>
                    </td>
                  ))}
                </tr>
                {/* In Stock Row */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    Availability
                  </td>
                  {comparisonProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Specifications */}
                {specsToShow.map((specKey) => (
                  <tr key={specKey} className="border-b border-gray-100">
                    <td className="p-4 font-medium text-gray-700 bg-gray-50">
                      {specKey}
                    </td>
                    {comparisonProducts.map((product) => (
                      <td key={product._id} className="p-4 text-center">
                        {getSpecValue(product.specifications, specKey)}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Features */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    Features
                  </td>
                  {comparisonProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      <div className="flex flex-col space-y-1 text-sm">
                        {product.hasGuarantee && (
                          <span className="text-green-600">
                            ✓ Guarantee Included
                          </span>
                        )}
                        {product.hasChange && (
                          <span className="text-green-600">✓ Returnable</span>
                        )}
                        {product.hasReferal && (
                          <span className="text-green-600">
                            ✓ Referral Program
                          </span>
                        )}
                        {!product.hasGuarantee &&
                          !product.hasChange &&
                          !product.hasReferal && <span>—</span>}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b border-gray-100">
                  <td className="p-4 font-medium text-gray-700 bg-gray-50">
                    Rating
                  </td>
                  {comparisonProducts.map((product) => (
                    <td key={product._id} className="p-4 text-center">
                      {product.rating ? (
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span>{product.rating.toFixed(1)}</span>
                          {product.reviewCount && (
                            <span className="text-gray-500 text-sm">
                              ({product.reviewCount})
                            </span>
                          )}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
