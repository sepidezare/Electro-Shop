// src/types/cart.ts
import { Product, ProductVariant } from "./product";

export interface CartItem {
  product: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    image: string;
    inStock: boolean;
    stockQuantity?: number;
    type: "simple" | "variable";
  };
  variant?: {
    _id: string;
    name?: string;
    price: number;
    discountPrice?: number;
    inStock: boolean;
    stockQuantity: number;
    image?: string;
    attributes?: Array<{ name: string; value: string }>;
  };
  quantity: number;
}

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

// Helper function to create a storage-safe cart item
export const createStorageSafeCartItem = (
  product: Product, 
  variant?: ProductVariant, 
  quantity: number = 1
): CartItem => {
  return {
    product: {
      _id: product._id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.image,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || 0,
      type: product.type,
    },
    variant: variant ? {
      _id: variant._id,
      name: variant.name,
      price: variant.price,
      discountPrice: variant.discountPrice,
      inStock: variant.inStock,
      stockQuantity: variant.stockQuantity,
      image: variant.image,
      attributes: variant.attributes,
    } : undefined,
    quantity,
  };
};