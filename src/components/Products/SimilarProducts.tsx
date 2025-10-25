// src/components/Products/SimilarProducts.tsx
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
interface SimilarProductsProps {
  products: Product[];
  currentProductId: string;
  isLoading?: boolean;
}

export default function SimilarProducts({
  products,
  currentProductId,
  isLoading = false,
}: SimilarProductsProps) {
  // Filter out the current product (extra safety)
  const filteredProducts = products.filter(
    (product) => product._id !== currentProductId
  );

  if (isLoading) {
    return (
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Similar Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (filteredProducts.length === 0) {
    return null; // Don't show section if no similar products
  }

  return (
    <section className="py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.slice(0, 4).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
