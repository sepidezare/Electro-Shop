// src/utils/productUtils.ts
import { Product } from "@/types/product";

export const getProductPriceRange = (
  product: Product
): { min: number; max: number } => {
  if (product.type === "simple") {
    const currentPrice = product.discountPrice || product.price;
    return { min: currentPrice, max: currentPrice };
  }

  if (
    product.type === "variable" &&
    product.variants &&
    product.variants.length > 0
  ) {
    const prices = product.variants.map((variant) => {
      return variant.discountPrice || variant.price;
    });

    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }

  // Fallback for products without variants
  const currentPrice = product.discountPrice || product.price;
  return { min: currentPrice, max: currentPrice };
};

export const formatPriceRange = (min: number, max: number): string => {
  if (min === max) {
    return `$${min.toFixed(2)}`;
  }
  return `$${min.toFixed(2)} - $${max.toFixed(2)}`;
};
