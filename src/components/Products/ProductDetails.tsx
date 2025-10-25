// src/components/Products/ProductDetails.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { Product, ProductVariant } from "@/types/product";
import ProductImageCarousel from "./ProductDetailImageCarousel";
import VariantSelector from "./VariantSelector";
import { useCart } from "@/context/CartContext";
import TabSection from "./TabSection";
import SimilarProducts from "./SimilarProducts";
import Link from "next/link";

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(product.variants?.[0] || undefined);
  const [quantity, setQuantity] = useState(1);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  // Fetch similar products
  useEffect(() => {
    async function fetchSimilarProducts() {
      try {
        setIsLoadingSimilar(true);
        const response = await fetch(
          `/api/public/products/${product.slug}/similar`
        );

        if (response.ok) {
          const data = await response.json();
          setSimilarProducts(data);
        } else {
          setSimilarProducts([]);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
        setSimilarProducts([]);
      } finally {
        setIsLoadingSimilar(false);
      }
    }

    fetchSimilarProducts();
  }, [product.slug]);

  const allImages = useMemo(() => {
    const extractImageUrl = (
      media:
        | string
        | {
            url: string;
            type: "image" | "video";
            name?: string;
            size?: number;
            mimeType?: string;
          }
    ) => {
      return typeof media === "string" ? media : media.url;
    };

    const productImages = [
      product.image,
      ...(product.additionalMedia || []),
    ].map(extractImageUrl);

    const variantImages: string[] = [];

    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((variant) => {
        if (variant.image && !productImages.includes(variant.image)) {
          variantImages.push(variant.image);
        }

        if (variant.additionalMedia) {
          variant.additionalMedia.forEach((media) => {
            const url = extractImageUrl(media);
            if (!productImages.includes(url) && !variantImages.includes(url)) {
              variantImages.push(url);
            }
          });
        }
      });
    }

    return [...productImages, ...variantImages];
  }, [product.image, product.additionalMedia, product.variants]);

  const selectedVariantImages = useMemo(() => {
    if (!selectedVariant) return [];

    const extractImageUrl = (
      media:
        | string
        | {
            url: string;
            type: "image" | "video";
            name?: string;
            size?: number;
            mimeType?: string;
          }
    ) => {
      return typeof media === "string" ? media : media.url;
    };

    const variantImages = [selectedVariant.image];

    if (selectedVariant.additionalMedia) {
      selectedVariant.additionalMedia.forEach((media) => {
        variantImages.push(extractImageUrl(media));
      });
    }

    return variantImages;
  }, [selectedVariant]);

  const handleSelectVariant = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const displayPrice = selectedVariant?.price || product.price;
  const displayDiscountPrice =
    selectedVariant?.discountPrice || product.discountPrice || 0;
  const isDiscounted =
    displayDiscountPrice > 0 && displayDiscountPrice < displayPrice;
  const discountPercentage = isDiscounted
    ? Math.round(((displayPrice - displayDiscountPrice) / displayPrice) * 100)
    : 0;

  const stockQuantity =
    selectedVariant?.stockQuantity || product.stockQuantity || 0;
  const isInStock =
    product.inStock && (!selectedVariant || selectedVariant.inStock);

  const incrementQuantity = () => {
    if (quantity < stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product.type === "variable" && !selectedVariant) {
      alert("Please select a variant");
      return;
    }

    setIsAddingToCart(true);

    // Simulate a brief loading state for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    addToCart(
      product,
      product.type === "variable" ? selectedVariant : undefined,
      quantity
    );

    setIsAddingToCart(false);
  };

  return (
    <div className="max-w-7xl mx-auto pt-10">
      {/* Product Details Section */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Carousel */}
          <div className="lg:sticky lg:top-8">
            <ProductImageCarousel
              images={allImages}
              variantImages={selectedVariantImages}
              productName={product.name}
              variantName={selectedVariant?.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="flex text-sm text-gray-500 mb-4">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/"
                    className="hover:text-gray-700 cursor-pointer transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-300">/</span>
                  <Link
                    href={`/shop?category=${encodeURIComponent(
                      (product.categoryNames?.[0] || "all").toLowerCase()
                    )}`}
                    className="hover:text-gray-700 cursor-pointer transition-colors"
                  >
                    {product.categoryNames?.[0] || "Products"}
                  </Link>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-gray-300">/</span>
                  <span className="font-medium text-gray-900 truncate max-w-[200px]">
                    {product.name}
                  </span>
                </li>
              </ol>
            </nav>

            {/* Product Name & Rating */}
            <div className="space-y-3">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(product.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating.toFixed(1)} • {product.reviews?.length || 0}{" "}
                    reviews
                  </span>
                </div>
              )}
            </div>

            {/* Show selected variant name */}
            {selectedVariant && (
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-lg">
                <span className="text-sm font-medium text-gray-600">
                  Selected:
                </span>
                <span className="text-lg font-semibold text-gray-900 capitalize">
                  {selectedVariant.name}
                </span>
              </div>
            )}

            {/* Price Section */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-4 mb-4">
                {isDiscounted ? (
                  <>
                    <span className="text-4xl font-bold text-gray-900">
                      ${displayDiscountPrice.toFixed(2)}
                    </span>
                    <span className="text-2xl line-through text-gray-500">
                      ${displayPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-800 text-sm font-bold px-3 py-1 rounded-full">
                      Save {discountPercentage}%
                    </span>
                  </>
                ) : (
                  <span className="text-4xl font-bold text-gray-900">
                    ${displayPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-6">
                {isInStock ? (
                  <div className="flex items-center text-green-600 font-medium">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span>In Stock • {stockQuantity} available</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 font-medium">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span>Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Variant Selector */}
              {product.type === "variable" &&
                product.variants &&
                product.variants.length > 0 && (
                  <div className="mb-6">
                    <VariantSelector
                      variants={product.variants}
                      selectedVariant={selectedVariant}
                      onSelectVariant={handleSelectVariant}
                    />
                  </div>
                )}

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        type="button"
                        className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white transition-colors"
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                      >
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
                            d="M20 12H4"
                          />
                        </svg>
                      </button>
                      <span className="w-12 text-center font-medium text-lg">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-white transition-colors"
                        onClick={incrementQuantity}
                        disabled={quantity >= stockQuantity}
                      >
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
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                    isInStock
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-200 shadow-lg hover:shadow-xl"
                      : "bg-gray-400 cursor-not-allowed"
                  } ${isAddingToCart ? "opacity-75 cursor-not-allowed" : ""}`}
                  disabled={!isInStock || isAddingToCart}
                  onClick={handleAddToCart}
                >
                  {isAddingToCart ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding to Cart...
                    </>
                  ) : (
                    <>
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
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {isInStock ? "Add to Cart" : "Out of Stock"}
                    </>
                  )}
                </button>

                {/* Secondary Actions */}
                <div className="flex space-x-3">
                  <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 font-medium">
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
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>Wishlist</span>
                  </button>
                  <button className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center space-x-2 font-medium">
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
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Product Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
              {product.hasGuarantee && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-green-900">
                      Guarantee
                    </div>
                    <div className="text-sm text-green-700">
                      Quality Assured
                    </div>
                  </div>
                </div>
              )}
              {product.hasChange && (
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-blue-900">
                      Easy Returns
                    </div>
                    <div className="text-sm text-blue-700">30-Day Policy</div>
                  </div>
                </div>
              )}
              {product.hasReferal && (
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-purple-900">
                      Referral Bonus
                    </div>
                    <div className="text-sm text-purple-700">Earn Rewards</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Section */}
      <div className="mt-16 px-4 sm:px-6 lg:px-8">
        <TabSection
          description={product.description}
          specifications={product.specifications || []}
          reviews={product.reviews || []}
          productName={product.name}
          rating={product.rating || 0}
          productSlug={product.slug}
        />
      </div>

      {/* Similar Products Section */}
      <div className="mt-16">
        <SimilarProducts
          products={similarProducts}
          currentProductId={product._id}
          isLoading={isLoadingSimilar}
        />
      </div>
    </div>
  );
}
