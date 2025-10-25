// src/context/CartContext.tsx (simplified version)
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Product, ProductVariant } from "@/types/product";
import { CartItem, CartContextType } from "@/types/cart";

const CART_STORAGE_KEY = "shopping-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to get cart from localStorage
const getStoredCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return [];
  }
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cartItems: CartItem[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = getStoredCart();
    setCartItems(storedCart);
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(cartItems);
    }
  }, [cartItems, isInitialized]);

  const addToCart = (
    product: Product,
    variant?: ProductVariant,
    quantity: number = 1
  ) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) =>
        variant
          ? item.variant?._id === variant._id &&
            item.product._id === product._id
          : item.product._id === product._id && !item.variant
      );

      if (existingItem) {
        return prevItems.map((item) =>
          (
            variant
              ? item.variant?._id === variant._id &&
                item.product._id === product._id
              : item.product._id === product._id && !item.variant
          )
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Create storage-safe cart item directly without helper function
        const newCartItem: CartItem = {
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
          variant: variant
            ? {
                _id: variant._id,
                name: variant.name,
                price: variant.price,
                discountPrice: variant.discountPrice,
                inStock: variant.inStock,
                stockQuantity: variant.stockQuantity,
                image: variant.image,
                attributes: variant.attributes,
              }
            : undefined,
          quantity,
        };

        return [...prevItems, newCartItem];
      }
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) =>
        variantId
          ? !(item.product._id === productId && item.variant?._id === variantId)
          : !(item.product._id === productId && !item.variant)
      )
    );
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    variantId?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        (
          variantId
            ? item.variant?._id === variantId && item.product._id === productId
            : item.product._id === productId && !item.variant
        )
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.variant?.price || item.product.price;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
