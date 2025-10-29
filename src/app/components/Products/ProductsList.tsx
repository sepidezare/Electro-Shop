"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/product";

interface ProductsListProps {
  initialProducts: Product[];
}

export default function ProductsList({ initialProducts }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.image || "/images/fallback.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.src = "/images/fallback.jpg";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold text-green-600">
                    ${product.price}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                {/* Fixed category display - check what's available in your Product type */}
                {product.categories && product.categories.length > 0 && (
                  <p className="text-gray-500 text-sm">
                    Categories:{" "}
                    <span className="font-medium">
                      {Array.isArray(product.categories)
                        ? product.categories.join(", ")
                        : product.categories}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
