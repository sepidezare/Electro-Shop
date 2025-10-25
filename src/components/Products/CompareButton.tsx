// src/components/Products/CompareButton.tsx
"use client";

import { useComparison } from "@/context/ComparisonContext";
import { Product } from "@/types/product";

interface CompareButtonProps {
  product: Product;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  circle?: boolean;
}

export default function CompareButton({
  product,
  size = "md",
  showText = true,
  circle = false,
}: CompareButtonProps) {
  const { addToComparison, removeFromComparison, isInComparison, canAddMore } =
    useComparison();

  const isCompared = isInComparison(product._id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    if (isCompared) {
      removeFromComparison(product._id);
    } else {
      if (canAddMore) {
        addToComparison(product);
      } else {
        alert(`You can only compare up to 4 products at a time.`);
      }
    }
  };

  return (
    <button
      className="cursor-pointer"
      onClick={handleClick}
      disabled={!canAddMore && !isCompared}
      aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
      title={isCompared ? "Remove from comparison" : "Add to comparison"}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {isCompared ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        )}
      </svg>
      {!circle && showText && <span>{isCompared ? "Added" : "Compare"}</span>}
    </button>
  );
}
