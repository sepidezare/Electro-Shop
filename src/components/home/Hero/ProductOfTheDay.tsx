"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface ProductOfTheDayProps {
  product: Product;
}

export default function ProductOfTheDay({ product }: ProductOfTheDayProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const seconds = prev.seconds - 1;
        if (seconds >= 0) {
          return { ...prev, seconds };
        }

        const minutes = prev.minutes - 1;
        if (minutes >= 0) {
          return { ...prev, minutes, seconds: 59 };
        }

        const hours = prev.hours - 1;
        if (hours >= 0) {
          return { hours, minutes: 59, seconds: 59 };
        }

        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate discount percentage
  const calculateDiscount = (product: Product): number | null => {
    if (product.discountPrice && product.price > product.discountPrice) {
      return Math.round(
        ((product.price - product.discountPrice) / product.price) * 100
      );
    }
    return null;
  };

  const discount = calculateDiscount(product);

  return (
    <div className="bg-white rounded-lg px-3 py-5 h-[570px] border border-[#FFE48F] border-2 ">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-red-600 mb-2">
          Product of The Day
        </h2>
        <p className="text-gray-600 text-sm text-bold">
          Special price only valid today!
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-45 h-45 object-cover rounded-lg"
        />
      </div>

      <div className="text-center mb-4">
        <h3 className="text-md font-semibold text-gray-800 mb-2">
          {product.name}
        </h3>
        <div className="flex flex-col items-center gap-1">
          {" "}
          {/* Changed to column layout */}
          {product.discountPrice && product.price > product.discountPrice && (
            <span className="text-[1rem] text-gray-500 line-through">
              ${product.price}
            </span>
          )}
          <span className="text-[1.5rem] font-bold text-red-600">
            ${product.price}
          </span>
          {/* {product.originalPrice && product.originalPrice > product.price && discount && (
        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-semibold">
          -{discount}%
        </span>
      )} */}
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg p-4">
        <div className="text-center mb-2">
          <span className="text-sm font-semibold text-gray-700">
            Offer ends in:
          </span>
        </div>
        <div className="flex justify-center gap-3">
          <div className="text-center">
            <div className="bg-red-600 text-white rounded-lg py-2 px-2 min-w-12">
              <span className="text-md font-bold">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs text-gray-600 mt-1 block">Hours</span>
          </div>
          <div className="text-center">
            <div className="bg-red-600 text-white rounded-lg py-2 px-2 min-w-12">
              <span className="text-md font-bold">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs text-gray-600 mt-1 block">Minutes</span>
          </div>
          <div className="text-center">
            <div className="bg-red-600 text-white rounded-lg py-2 px-2 min-w-12">
              <span className="text-md font-bold">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs text-gray-600 mt-1 block">Seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
}
