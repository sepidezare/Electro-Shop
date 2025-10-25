// src/components/Cart/CartSidebar.tsx
"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartSidebar() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  const [isVisible, setIsVisible] = useState(false);

  // Handle animation states
  useEffect(() => {
    if (isCartOpen) {
      // Show backdrop immediately, then slide in sidebar
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      // Slide out sidebar, then hide backdrop
      setIsVisible(false);
      setTimeout(() => {
        document.body.style.overflow = "unset";
      }, 300); // Match this with your transition duration
    }
  }, [isCartOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };

    if (isCartOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isCartOpen, setIsCartOpen]);

  // Don't render anything if cart is closed and animation is complete
  if (!isCartOpen && !isVisible) return null;

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-out
          ${isVisible ? "opacity-50" : "opacity-0"}
        `}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar with slide animation */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 
          flex flex-col transition-transform duration-300 ease-out
          ${isVisible ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Shopping Cart ({getCartItemsCount()})
          </h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <svg
              className="cursor-pointer w-5 h-5"
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

        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemPrice = item.variant?.price || item.product.price;
                const itemImage = item.variant?.image || item.product.image;
                const itemId = item.variant
                  ? `${item.product._id}-${item.variant._id}`
                  : item.product._id;

                return (
                  <div
                    key={itemId}
                    className="flex items-center space-x-4 bg-gray-50 rounded-lg p-3"
                  >
                    <img
                      src={itemImage || "/images/fallback.jpg"}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {item.product.name}
                      </h3>

                      {/* Show variant attributes if available */}
                      {item.variant?.attributes &&
                        item.variant.attributes.length > 0 && (
                          <p className="text-xs text-gray-600 mt-1">
                            {item.variant.attributes
                              .map((attr) => `${attr.name}: ${attr.value}`)
                              .join(", ")}
                          </p>
                        )}

                      <p className="text-sm text-gray-600">
                        ${itemPrice.toFixed(2)}
                      </p>

                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity - 1,
                              item.variant?._id
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                          <span className="text-sm">−</span>
                        </button>

                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity + 1,
                              item.variant?._id
                            )
                          }
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200"
                        >
                          <span className="text-sm">+</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <p className="text-sm font-semibold text-gray-900">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() =>
                          removeFromCart(item.product._id, item.variant?._id)
                        }
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total:</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <Link
                href="/cart"
                className="block w-full bg-blue-600 text-white text-center py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                onClick={() => setIsCartOpen(false)}
              >
                View Cart
              </Link>

              <Link
                href="/checkout"
                className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                onClick={() => setIsCartOpen(false)}
              >
                Checkout
              </Link>

              <button
                onClick={() => setIsCartOpen(false)}
                className="cursor-pointer block w-full bg-gray-200 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
