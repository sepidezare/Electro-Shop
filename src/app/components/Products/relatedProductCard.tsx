// // src/components/Products/ProductCard.tsx
// "use client";

// import { Product } from "@/types/product";
// import Link from "next/link";
// import Image from "next/image";

// interface ProductCardProps {
//   product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//   const displayPrice =
//     product.discountPrice && product.discountPrice < product.price
//       ? product.discountPrice
//       : product.price;

//   const isDiscounted =
//     product.discountPrice && product.discountPrice < product.price;
//   const discountPercentage = isDiscounted
//     ? Math.round(
//         ((product.price - product.discountPrice) / product.price) * 100
//       )
//     : 0;

//   return (
//     <div className="group bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
//       <Link href={`/products/${product.slug}`}>
//         <div className="relative aspect-square overflow-hidden rounded-t-lg">
//           <Image
//             src={
//               typeof product.image === "string"
//                 ? product.image
//                 : product.image.url
//             }
//             alt={product.name}
//             fill
//             className="object-cover group-hover:scale-105 transition-transform duration-300"
//             sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
//           />
//           {isDiscounted && (
//             <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
//               {discountPercentage}% OFF
//             </div>
//           )}
//           {!product.inStock && (
//             <div className="absolute inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//               <span className="text-white font-semibold bg-gray-900 bg-opacity-75 px-3 py-1 rounded">
//                 Out of Stock
//               </span>
//             </div>
//           )}
//         </div>

//         <div className="p-4">
//           <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
//             {product.name}
//           </h3>

//           {product.brand && (
//             <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
//           )}

//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               {isDiscounted ? (
//                 <>
//                   <span className="text-lg font-bold text-gray-900">
//                     ${displayPrice.toFixed(2)}
//                   </span>
//                   <span className="text-sm line-through text-gray-500">
//                     ${product.price.toFixed(2)}
//                   </span>
//                 </>
//               ) : (
//                 <span className="text-lg font-bold text-gray-900">
//                   ${displayPrice.toFixed(2)}
//                 </span>
//               )}
//             </div>

//             {product.rating && (
//               <div className="flex items-center space-x-1">
//                 <svg
//                   className="w-4 h-4 text-yellow-400"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                 </svg>
//                 <span className="text-sm text-gray-600">
//                   {product.rating.toFixed(1)}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }
