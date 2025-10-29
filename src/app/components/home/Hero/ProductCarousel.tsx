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
  "2": "#55E688",
  "1": "#E6C255",
  "3": "#55E6DF",
};

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;

    const distance = touchStartX - touchEndX;

    if (Math.abs(distance) > 50) {
      if (distance > 0) {
        // Swiped left → next slide
        goToNext();
      } else {
        // Swiped right → previous slide
        goToPrevious();
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

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
  const currentBgColor = "#FFD454";

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
      className="group rounded-lg shadow-lg p-6 h-[50vh] lg:h-[70vh] transition-colors duration-500 relative"
      style={{ backgroundColor: currentBgColor }}
    >
      <h2 className="text-xl font-bold text-gray-800 lg:mb-4">
        Featured Products
      </h2>

      <div className="relative mb-4 flex flex-row lg:flex-col items-center gap-4">
        {/* Image Section */}
        <div
          className={`w-1/2 lg:w-full lg:h-auto transition-opacity duration-500 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src={currentProduct.image}
            alt={currentProduct.name}
            className="w-full max-h-70 object-contain rounded-lg"
          />
        </div>

        {/* Text Section */}
        <div className="w-1/2 lg:w-full text-left">
          <h3 className="font-semibold text-gray-800 mb-1">
            {currentProduct.name}
          </h3>
          <p className="text-gray-800 mb-1">{currentProduct.description}</p>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-red-600">
              ${currentProduct.discountPrice ?? currentProduct.price}
            </span>

            {currentProduct.discountPrice &&
              currentProduct.price > currentProduct.discountPrice && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ${currentProduct.price}
                  </span>
                  {discount && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs font-semibold">
                      -{discount}%
                    </span>
                  )}
                </>
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
      <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-1.5">
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
            className={`cursor-pointer h-1.5 rounded rounded-pill transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-4"
                : "bg-white/50 w-1.5 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
