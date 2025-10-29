"use client";

import { CartItem as CartItemType } from "@/types/cart";

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
}

export default function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
}: CartItemProps) {
  const { product, quantity } = item;

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <span className="text-gray-400 text-xs">🖼️</span>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{product.name}</h4>
          <p className="text-gray-600">${product.price}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quantity Controls */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => onUpdateQuantity(product._id, quantity - 1)}
            className="px-3 py-1 hover:bg-gray-100 transition-colors"
          >
            -
          </button>
          <span className="px-3 py-1 border-x border-gray-300">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(product._id, quantity + 1)}
            className="px-3 py-1 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>

        {/* Total Price */}
        <span className="font-semibold text-gray-900 w-20 text-right">
          ${(product.price * quantity).toFixed(2)}
        </span>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(product._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
