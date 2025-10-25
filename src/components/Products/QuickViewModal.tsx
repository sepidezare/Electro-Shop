// src/components/Products/QuickViewModal.tsx
"use client";

import { Product, ProductVariant } from "@/types/product";
import { useEffect, useState, useRef } from "react"; // Added useRef
import { getProductPriceRange } from "@/utils/ProductUtils";
import Link from "next/link";
import Portal from "../UI/portal";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ) => void;
}

export default function QuickViewModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: QuickViewModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(undefined);
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState(1);

  const modalRef = useRef<HTMLDivElement>(null); // Ref for the modal content

  const priceRange = getProductPriceRange(product);
  const hasMultiplePrices = priceRange.min !== priceRange.max;

  // Helper functions for price calculations
  const getCurrentPrice = (): number => {
    if (selectedVariant) {
      return selectedVariant.discountPrice || selectedVariant.price;
    }
    return product.discountPrice || product.price;
  };

  const getOriginalPrice = (): number | null => {
    if (selectedVariant) {
      return selectedVariant.discountPrice ? selectedVariant.price : null;
    }
    return product.discountPrice ? product.price : null;
  };

  const isInStock = (): boolean => {
    if (selectedVariant) {
      return selectedVariant.inStock;
    }
    return product.inStock;
  };

  // Handle variant selection (if it's a variable product)
  useEffect(() => {
    if (product.type === "variable" && product.variants && product.attributes) {
      const matchingVariant = product.variants.find((variant) => {
        if (!variant.attributes) return false;

        return product.attributes?.every((attr) => {
          const selectedValue = selectedAttributes[attr.name];
          const variantValue = variant.attributes?.find(
            (a) => a.name === attr.name
          )?.value;
          return selectedValue === variantValue;
        });
      });

      setSelectedVariant(matchingVariant || undefined);
    }
  }, [selectedAttributes, product]);

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const handleAddToCartWithVariant = () => {
    if (product.type === "variable" && !selectedVariant) {
      alert("Please select product options");
      return;
    }

    onAddToCart(
      product,
      product.type === "variable" ? selectedVariant : undefined,
      quantity
    );
    onClose();
  };

  // Close modal on Escape key press and handle body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      setIsVisible(true);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Improved click outside handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    // Check if click is outside the modal content
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen && !isVisible) return null;

  return (
    <Portal>
      <div
        className={`
          fixed inset-0 z-50 flex items-center justify-center p-4
          transition-all duration-300 ease-out
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
        onClick={handleBackdropClick}
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black transition-all duration-300 ease-out
            ${isVisible ? "opacity-50" : "opacity-0"}
          `}
        />

        {/* Modal Content */}
        <div
          ref={modalRef}
          className={`
            relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-auto 
            max-h-[90vh] overflow-y-auto transform transition-all duration-500 ease-out
            ${
              isVisible
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 translate-y-8"
            }
          `}
          // Stop propagation to prevent backdrop click when clicking inside modal
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Quick View</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 
                         hover:scale-110 active:scale-95"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6"
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
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Product Image */}
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <img
                  src={
                    selectedVariant?.image ||
                    product.image ||
                    "/images/fallback.jpg"
                  }
                  alt={product.name}
                  className="w-full h-64 object-contain transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {product.name}
                </h3>

                {/* Price Display */}
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold text-gray-900">
                    {hasMultiplePrices && product.type === "variable"
                      ? selectedVariant
                        ? `$${getCurrentPrice().toFixed(2)}`
                        : `From $${priceRange.min.toFixed(2)}`
                      : `$${getCurrentPrice().toFixed(2)}`}
                  </span>

                  {/* Show original price and discount for simple products or selected variants */}
                  {((product.type === "simple" && getOriginalPrice()) ||
                    (product.type === "variable" &&
                      selectedVariant &&
                      getOriginalPrice())) && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${getOriginalPrice()!.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                        Save $
                        {(getOriginalPrice()! - getCurrentPrice()).toFixed(2)}
                      </span>
                    </>
                  )}
                </div>

                {/* Show price range for variable products without selection */}
                {hasMultiplePrices &&
                  product.type === "variable" &&
                  !selectedVariant && (
                    <p className="text-sm text-gray-600">
                      Price range: ${priceRange.min.toFixed(2)} - $
                      {priceRange.max.toFixed(2)}
                    </p>
                  )}

                {/* Variant Selection for Variable Products */}
                {product.type === "variable" && product.attributes && (
                  <div className="space-y-4">
                    {product.attributes.map((attribute) => (
                      <div key={attribute.name}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {attribute.name}:
                          {selectedAttributes[attribute.name] && (
                            <span className="font-semibold ml-2">
                              {selectedAttributes[attribute.name]}
                            </span>
                          )}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {attribute.values.map((value) => {
                            const isSelected =
                              selectedAttributes[attribute.name] === value;
                            const isAvailable = product.variants?.some(
                              (variant) => {
                                const variantValue = variant.attributes?.find(
                                  (a) => a.name === attribute.name
                                )?.value;
                                return variantValue === value;
                              }
                            );

                            return (
                              <button
                                key={value}
                                onClick={() =>
                                  handleAttributeChange(attribute.name, value)
                                }
                                disabled={!isAvailable}
                                className={`
                                  px-3 py-2 border rounded-lg text-sm font-medium transition-all duration-200
                                  ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-50 text-blue-700"
                                      : "border-gray-300 text-gray-700 hover:border-gray-400"
                                  }
                                  ${
                                    !isAvailable
                                      ? "opacity-50 cursor-not-allowed line-through"
                                      : "cursor-pointer"
                                  }
                                `}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Stock Status */}
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full transition-colors duration-300 ${
                      isInStock() ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-sm text-gray-600">
                    {isInStock()
                      ? selectedVariant
                        ? `In Stock (${selectedVariant.stockQuantity} available)`
                        : `In Stock (${product.stockQuantity} available)`
                      : "Out of Stock"}
                  </span>
                </div>

                {/* Quantity and Add to Cart */}
                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <span className="px-4 py-2 border-l border-r border-gray-300 font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCartWithVariant}
                    disabled={
                      !isInStock() ||
                      (product.type === "variable" && !selectedVariant)
                    }
                    className={`
                      flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-300
                      transform hover:scale-105 active:scale-95
                      ${
                        isInStock() &&
                        (product.type === "simple" || selectedVariant)
                          ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }
                    `}
                  >
                    {!isInStock()
                      ? "Out of Stock"
                      : product.type === "variable" && !selectedVariant
                      ? "Select Options"
                      : "Add to Cart"}
                  </button>
                </div>

                {/* View Details Link */}
                <Link
                  href={
                    product.slug
                      ? `/products/${product.slug}`
                      : `/products/${product._id}`
                  }
                  className="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm"
                  onClick={onClose}
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
}
