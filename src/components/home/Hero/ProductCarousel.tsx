"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface ProductCarouselProps {
  products: Product[];
}

const productBackgroundColors: { [key: string]: string } = {
  // '1': '#FFE4E6',
  // '2': '#E0F2FE',
  // '3': '#E4FFE8',
  "2": "#F3DBFF",
  "1": "#FFF2C4",
  "3": "#C4FFF3",
};

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setIsAnimating(false);
      }, 500);
    }, 20000);

    return () => clearInterval(interval);
  }, [products.length]);

  const currentProduct = products[currentIndex];
  const currentBgColor =
    productBackgroundColors[currentProduct._id] || "#ff9900";

  // Calculate discount percentage
  const calculateDiscount = (product: Product): number | null => {
    if (product.discountPrice && product.price > product.discountPrice) {
      return Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      );
    }
    return null;
  };

  const discount = calculateDiscount(currentProduct);

  const goToPrevious = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
      setIsAnimating(false);
    }, 500);
  };

  const goToNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div
      className="group rounded-lg shadow-lg p-6 h-[570px] transition-colors duration-500 relative"
      style={{ backgroundColor: currentBgColor }}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Featured Products
      </h2>

      <div className="relative h-64 mb-4">
        <div
          className={`transition-opacity duration-500 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full h-75 object-cover rounded-lg mb-3"
          />
          <h3 className="font-semibold text-gray-800 mb-1">
            {currentProduct.name}
          </h3>
          <h3 className="text-gray-800 mb-1">{currentProduct.description}</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-red-600">
              ${currentProduct.price}
            </span>
            {currentProduct.discountPrice &&
              currentProduct.price > currentProduct.discountPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${currentProduct.price}
                </span>
              )}
            {discount && (
              <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold">
                -{discount}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg"
      >
        <svg
          className="w-4 h-4 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg"
      >
        <svg
          className="w-4 h-4 text-gray-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Line Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsAnimating(false);
              }, 500);
            }}
            className={`h-1.5 rounded rounded-pill transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-4"
                : "bg-white/40 w-1.5 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
