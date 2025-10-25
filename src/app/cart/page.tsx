// src/app/cart/page.tsx
"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemsCount,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <svg
              className="w-24 h-24 text-gray-400 mx-auto mb-6"
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
            <p className="text-gray-600 text-lg mb-6">Your cart is empty</p>
            <Link
              href="/shop"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">
          Your Cart ({getCartItemsCount()} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {cartItems.map((item) => {
                const itemPrice = item.variant?.price || item.product.price;
                const itemImage = item.variant?.image || item.product.image;
                const productLink = `/products/${
                  item.product.slug || item.product._id
                }`;

                return (
                  <div
                    key={
                      item.variant
                        ? `${item.product._id}-${item.variant._id}`
                        : item.product._id
                    }
                    className="flex items-center p-6 border-b border-gray-200 last:border-b-0"
                  >
                    {/* Product Image as Link */}
                    <Link
                      href={productLink}
                      className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity duration-200"
                    >
                      <img
                        src={itemImage || "/images/fallback.jpg"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 ml-6">
                      {/* Product Title as Link */}
                      <Link href={productLink} className="group">
                        <h3 className="text-md font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-200">
                          {item.product.name}
                        </h3>
                      </Link>

                      {/* Show variant attributes if available */}
                      {item.variant?.attributes &&
                        item.variant.attributes.length > 0 && (
                          <p className="text-sm text-gray-600 mb-2">
                            {item.variant.attributes
                              .map((attr) => `${attr.name}: ${attr.value}`)
                              .join(", ")}
                          </p>
                        )}
                      <p className="text-lg font-bold text-gray-900">
                        ${itemPrice.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product._id,
                              item.quantity - 1,
                              item.variant?._id
                            )
                          }
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          <span className="text-sm">−</span>
                        </button>

                        <span className="w-12 text-center font-medium">
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
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-200"
                        >
                          <span className="text-sm">+</span>
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() =>
                          removeFromCart(item.product._id, item.variant?._id)
                        }
                        className="text-red-500 hover:text-red-700 transition-colors duration-200 p-2"
                        title="Remove item"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ${(getCartTotal() * 0.1).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(getCartTotal() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="block w-full bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  Proceed to Checkout
                </Link>

                <Link
                  href="/shop"
                  className="block w-full bg-gray-200 text-gray-800 text-center py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
