import { Product } from '@/types/product';
import Link from 'next/link';

interface ProductCardTwoProps {
  product: Product;
}

export default function ProductCardTwo({ product }: ProductCardTwoProps) {
  const calculateDiscount = (product: Product): number | null => {
    if (product.discountPrice && product.price > product.discountPrice) {
      return Math.round(((product.price - product.discountPrice) / product.price) * 100);
    }
    return null;
  };

  const discount = calculateDiscount(product);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/products/${product._id}`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-contain"
          />
          {discount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
              -{discount}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded font-semibold">Out of Stock</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <Link href={`/products/${product._id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-blue-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${product.discountPrice || product.price}
            </span>
            {product.discountPrice && product.price > product.discountPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.price}
              </span>
            )}
          </div>
          
          <div className="flex items-center">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 ml-1">
              {product.rating}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}