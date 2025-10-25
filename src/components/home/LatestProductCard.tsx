// src/components/Products/ProductCard.tsx
"use client";

import { Product, ProductVariant } from "@/types/product";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import QuickViewModal from "../Products/QuickViewModal";
import { useCart } from "@/context/CartContext";
import { getProductPriceRange, formatPriceRange } from "@/utils/ProductUtils";
import CompareButton from "../Products/CompareButton";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const { addToCart } = useCart();

  const priceRange = getProductPriceRange(product);
  const hasMultiplePrices = priceRange.min !== priceRange.max;

  // Log product data for debugging
  console.log("ProductCard product:", {
    id: product._id,
    slug: product.slug,
    name: product.name,
  });

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add to wishlist:", product._id);
    // Add your wishlist logic here
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleAddToCartWithDetails = (
    product: Product,
    variant?: ProductVariant,
    quantity: number = 1
  ) => {
    addToCart(product, variant, quantity);
  };

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.type === "variable") {
      // For variable products, show quick view to select variants
      setShowQuickView(true);
      return;
    }

    // For simple products, add directly to cart
    addToCart(product, undefined, 1);
  };

  return (
    <>
      <div
        className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-3 sm:p-4 md:p-6 flex flex-col h-full relative group/card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Action Icons - Top Right */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {/* Wishlist Icon */}
          <div
            className={`relative transition-all duration-300 transform
                ${
                  isHovered
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
            style={{ transitionDelay: "100ms" }}
          >
            {/* The button itself controls tooltip visibility */}
            <button
              onClick={handleWishlist}
              className="relative flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm 
                 hover:bg-gray-50 transition-all duration-300 hover:scale-110 group"
              aria-label="Add to wishlist"
            >
              <svg
                className="w-4 h-4 text-gray-700 group-hover:text-red-500 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>

              {/* Tooltip - only appears on icon hover */}
              <div
                className="absolute right-full top-1/2 transform -translate-y-1/2 ml-2 
                      opacity-0 group-hover:opacity-100 pointer-events-none 
                      transition-all duration-200 z-50"
              >
                <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  Add to wishlist
                  <div
                    className="absolute right-full top-1/2 transform -translate-y-1/2 
                          border-4 border-transparent border-r-gray-900"
                  ></div>
                </div>
              </div>
            </button>
          </div>

          {/* Compare Button */}
          <div
            className={`relative transition-all duration-300 transform
                ${
                  isHovered
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div
              className="relative flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm 
                 hover:bg-gray-50 transition-all duration-300 hover:scale-110 group"
            >
              <CompareButton
                product={product}
                size="sm"
                showText={false}
                circle={true}
              />

              {/* Tooltip */}
              <div
                className="absolute right-full top-1/2 transform -translate-y-1/2 ml-2 
                      opacity-0 group-hover:opacity-100 pointer-events-none 
                      transition-all duration-200 z-50"
              >
                <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  Compare product
                  <div
                    className="absolute right-full top-1/2 transform -translate-y-1/2 
                          border-4 border-transparent border-r-gray-900"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick View Icon */}
          <div
            className={`relative transition-all duration-300 transform
                ${
                  isHovered
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
            style={{ transitionDelay: "300ms" }}
          >
            <button
              onClick={handleQuickView}
              className="relative flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm 
                 hover:bg-gray-50 transition-all duration-300 hover:scale-110 group"
              aria-label="Quick view"
            >
              <svg
                className="w-4 h-4 text-gray-700 group-hover:text-green-500 transition-all duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>

              {/* Tooltip */}
              <div
                className="absolute right-full top-1/2 transform -translate-y-1/2 ml-2 
                      opacity-0 group-hover:opacity-100 pointer-events-none 
                      transition-all duration-200 z-50"
              >
                <div className="bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                  Quick view
                  <div
                    className="absolute right-full top-1/2 transform -translate-y-1/2 
                          border-4 border-transparent border-r-gray-900"
                  ></div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Product Image */}
        <div className="relative w-full h-32 sm:h-40 md:h-48 bg-gray-100 rounded-lg mb-3 sm:mb-4 flex items-center justify-center overflow-hidden">
          <Link
            href={
              product.slug
                ? `/products/${product.slug}`
                : `/products/${product._id}`
            }
            className="w-full h-full flex items-center justify-center"
            aria-label={`View details for ${product.name}`}
          >
            <Image
              src={product.image || "/images/fallback.jpg"}
              alt={product.name}
              width={192}
              height={192}
              className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </Link>

          {/* Add to Cart Button - Appears on Hover Over Image */}
          <div
            className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 transition-all duration-300 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <button
              onClick={handleAddToCartClick}
              disabled={!product.inStock}
              className={`w-full
                px-4 py-2 rounded-lg font-medium transition-all duration-300
                whitespace-nowrap text-sm shadow-lg
                transform hover:scale-105 active:scale-95
                ${
                  product.inStock
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {product.inStock
                ? product.type === "variable"
                  ? "View Options"
                  : "Add to Cart"
                : "Out of Stock"}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-grow">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2">
            <Link
              href={
                product.slug
                  ? `/products/${product.slug}`
                  : `/products/${product._id}`
              }
              className="hover:text-blue-600 transition-colors duration-300"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 md:mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-auto">
          <div className="text-center sm:text-left">
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {formatPriceRange(priceRange.min, priceRange.max)}
            </span>
            {hasMultiplePrices && product.type === "variable" && (
              <p className="text-xs text-gray-500 mt-1">
                {product.variants?.length} options available
              </p>
            )}
          </div>
        </div>

        {/* Product Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.todayOffer && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Today&apos;s Offer
            </span>
          )}
          {product.featuredProduct && (
            <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
          {hasMultiplePrices && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              From ${priceRange.min.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
        onAddToCart={handleAddToCartWithDetails}
      />
    </>
  );
}
