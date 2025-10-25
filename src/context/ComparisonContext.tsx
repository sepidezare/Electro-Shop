// src/context/ComparisonContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/types/product";

interface ComparisonContextType {
  comparisonProducts: Product[];
  addToComparison: (product: Product) => void;
  removeFromComparison: (productId: string) => void;
  clearComparison: () => void;
  isInComparison: (productId: string) => boolean;
  canAddMore: boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined
);

const MAX_COMPARISON_ITEMS = 4;
const STORAGE_KEY = "product-comparison";

export function ComparisonProvider({ children }: { children: ReactNode }) {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setComparisonProducts(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Error loading comparison data from localStorage:", error);
      setComparisonProducts([]);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever comparisonProducts changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonProducts));
      } catch (error) {
        console.error("Error saving comparison data to localStorage:", error);
      }
    }
  }, [comparisonProducts, isInitialized]);

  const addToComparison = (product: Product) => {
    setComparisonProducts((prev) => {
      // Check if product already exists
      if (prev.find((p) => p._id === product._id)) {
        return prev;
      }
      // Check if we've reached the limit
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        return prev;
      }
      return [...prev, product];
    });
  };

  const removeFromComparison = (productId: string) => {
    setComparisonProducts((prev) => prev.filter((p) => p._id !== productId));
  };

  const clearComparison = () => {
    setComparisonProducts([]);
  };

  const isInComparison = (productId: string) => {
    return comparisonProducts.some((p) => p._id === productId);
  };

  const canAddMore = comparisonProducts.length < MAX_COMPARISON_ITEMS;

  // Don't render until initialized to avoid hydration mismatch
  if (!isInitialized) {
    return null;
  }

  return (
    <ComparisonContext.Provider
      value={{
        comparisonProducts,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
        canAddMore,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
}

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (context === undefined) {
    throw new Error("useComparison must be used within a ComparisonProvider");
  }
  return context;
}
