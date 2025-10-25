"use client";

import { useComparison } from "@/context/ComparisonContext";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function ComparisonWidget() {
  const { comparisonProducts, clearComparison } = useComparison();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const widgetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (comparisonProducts.length > 0) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsMinimized(false);
    }
  }, [comparisonProducts.length]);

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  // 🔹 Detect clicks outside the widget
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        widgetRef.current &&
        !widgetRef.current.contains(event.target as Node)
      ) {
        setIsMinimized(true);
      }
    }

    if (isVisible && !isMinimized) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isVisible, isMinimized]);

  if (comparisonProducts.length === 0 || !isVisible) {
    return null;
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMinimize}
              className="text-blue-600 hover:text-blue-700 transition-colors"
              title="Expand"
            >
              {/* Arrow Up Icon */}
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
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <div className="relative">
              <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
                {comparisonProducts.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={widgetRef}
      className="fixed bottom-4 right-4 z-50 animate-in fade-in duration-300"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-64">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">
            Compare ({comparisonProducts.length}/4)
          </h3>
          <button
            onClick={toggleMinimize}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Minimize"
          >
            {/* Arrow Down Icon */}
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
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
          {comparisonProducts.map((product) => (
            <div
              key={product._id}
              className="flex items-center justify-between text-sm"
            >
              <span className="truncate flex-1 mr-2">{product.name}</span>
              <span className="text-gray-500 font-medium whitespace-nowrap">
                ${product.discountPrice || product.price}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <Link
            href="/compare"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-center block text-sm font-medium"
          >
            Compare Now
          </Link>
          <button
            onClick={clearComparison}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
