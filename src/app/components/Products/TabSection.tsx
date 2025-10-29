// src/components/Products/TabSection.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductSpecification, ProductReview } from "@/types/product";
import ReviewForm from "./ReviewForm";

interface TabSectionProps {
  description: string;
  specifications: ProductSpecification[];
  reviews: ProductReview[];
  productName: string;
  rating: number;
  productSlug: string;
}

export default function TabSection({
  description,
  specifications,
  reviews: initialReviews,
  productName,
  rating: initialRating,
  productSlug,
}: TabSectionProps) {
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "reviews"
  >("description");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState<ProductReview[]>(initialReviews);
  const [rating, setRating] = useState(initialRating);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchReviews = async () => {
      if (activeTab === "reviews") {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/public/products/${productSlug}/reviews`
          );
          if (response.ok) {
            const productReviews = await response.json();
            setReviews(productReviews);

            // Calculate average rating
            if (productReviews.length > 0) {
              const avgRating =
                productReviews.reduce(
                  (acc: number, review: ProductReview) => acc + review.rating,
                  0
                ) / productReviews.length;
              setRating(avgRating);
            }
          }
        } catch (error) {
          console.error("Failed to fetch reviews:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchReviews();
  }, [activeTab, productSlug]);

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);

    // Refresh reviews after submission
    try {
      const response = await fetch(
        `/api/public/products/${productSlug}/reviews`
      );
      if (response.ok) {
        const productReviews = await response.json();
        setReviews(productReviews);

        // Recalculate average rating
        if (productReviews.length > 0) {
          const avgRating =
            productReviews.reduce(
              (acc: number, review: ProductReview) => acc + review.rating,
              0
            ) / productReviews.length;
          setRating(avgRating);
        }
      }
    } catch (error) {
      console.error("Failed to refresh reviews:", error);
    }

    alert("Thank you for your review!");
  };

  const tabs = [
    { id: "description" as const, name: "Description", count: null },
    {
      id: "specifications" as const,
      name: "Specifications",
      count: specifications.length,
    },
    { id: "reviews" as const, name: "Reviews", count: reviews.length },
  ];

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
              {tab.count !== null && tab.count > 0 && (
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-6">
        {/* Description Tab */}
        {activeTab === "description" && (
          <div className="prose prose-lg max-w-none">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Product Description
            </h3>
            <div className="text-gray-700 leading-relaxed space-y-4">
              {description.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Additional description content can go here */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Key Features
                </h4>
                <ul className="text-gray-700 space-y-1">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    High-quality materials
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Premium craftsmanship
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Designed for durability
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Care Instructions
                </h4>
                <ul className="text-gray-700 space-y-1">
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Handle with care
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-4 h-4 text-blue-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Clean with soft cloth
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Specifications Tab */}
        {activeTab === "specifications" && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Product Specifications
            </h3>
            {specifications.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 divide-y divide-gray-200">
                  {specifications.map((spec, index) => (
                    <div key={index} className="grid grid-cols-3">
                      <div className="col-span-1 bg-gray-50 px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {spec.key}
                        </span>
                      </div>
                      <div className="col-span-2 px-6 py-4">
                        <span className="text-gray-700">{spec.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-gray-500 text-lg">
                  No specifications available for this product.
                </p>
              </div>
            )}

            {/* Additional technical info */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-2">
                Technical Support
              </h4>
              <p className="text-blue-700">
                Need more technical information? Contact our support team for
                detailed specifications and technical documentation.
              </p>
            </div>
          </div>
        )}
        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Customer Reviews
              </h3>
              <div className="flex items-center mt-2 md:mt-0">
                <div className="flex items-center">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.floor(rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {rating.toFixed(1)} out of 5 ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading reviews...</p>
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div
                    key={review.id || index}
                    className="border-b border-gray-200 pb-6 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {review.username?.charAt(0).toUpperCase() || "U"}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {review.username || "Anonymous"}
                          </h4>
                          <div className="flex items-center space-x-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-sm text-gray-500">
                              {review.rating}.0
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>

                    {review.verified && (
                      <div className="flex items-center mt-2 text-sm text-green-600">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Verified Purchase
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-gray-500 text-lg mb-4">
                  No reviews yet for this product.
                </p>
                <p className="text-gray-400">
                  Be the first to share your thoughts!
                </p>
              </div>
            )}

            {/* Write Review Button */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Write a Review
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productSlug={productSlug}
          productName={productName}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          productSlug={productSlug}
          productName={productName}
          onReviewSubmitted={handleReviewSubmitted}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}
