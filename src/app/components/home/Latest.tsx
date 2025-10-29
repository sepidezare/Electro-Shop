// "use client";

// import { useState, useEffect } from "react";
// import { Product } from "@/types/product";
// import ProductCard from "./LatestProductCard";
// import Link from "next/link";
// export default function Latest() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     async function fetchProducts() {
//       try {
//         const response = await fetch("/api/public/products");
//         if (!response.ok) {
//           throw new Error("Failed to fetch products");
//         }
//         const data = await response.json();
//         setProducts(data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "An error occurred");
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <section className="container mx-auto px-4 py-12">
//         <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {[...Array(5)].map((_, i) => (
//             <div
//               key={i}
//               className="bg-gray-200 rounded-lg h-80 animate-pulse"
//             ></div>
//           ))}
//         </div>
//       </section>
//     );
//   }

//   if (error) {
//     return (
//       <section className="container mx-auto px-4 py-12">
//         <div className="text-center text-red-500">
//           <p>Error loading products: {error}</p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="flex items-center justify-between mb-8">
//         <div className="w-[80%]">
//           <h2 className="text-3xl font-bold text-gray-900 font-jamjuree">
//             Latest Products
//           </h2>
//         </div>

//         {/* Container with bigger width for the button */}
//         <div className="w-[20%]">
//           <Link
//             href="/shop"
//             className="flex justify-end items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors w-full"
//           >
//             See All
//             <svg
//               className="w-4 h-4 ml-1"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </Link>
//         </div>
//       </div>

//       {products.length === 0 ? (
//         <div className="text-center py-12">
//           <p className="text-gray-500 text-lg">No products found.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-14">
//           {products.slice(0, 5).map((product, index) => (
//             <div
//               key={product._id}
//               className={`
//           ${index >= 4 ? "hidden xl:block" : ""}
//         `}
//             >
//               <ProductCard product={product} />
//             </div>
//           ))}
//         </div>
//       )}
//     </section>
//   );
// }
