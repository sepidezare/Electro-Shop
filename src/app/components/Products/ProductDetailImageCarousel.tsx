// src/components/Products/ProductDetailImageCarousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";

interface ProductImageCarouselProps {
  images: string[];
  productName: string;
  variantImages?: string[];
  variantName?: string;
  initialIndex?: number;
}

export default function ProductDetailImageCarousel({
  images,
  productName,
  variantImages = [],
  variantName,
  initialIndex = 0,
}: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Update currentIndex when variantImages change to show variant image first
  useEffect(() => {
    if (variantImages.length > 0 && images.length > 0) {
      const variantImageIndex = images.findIndex((img) =>
        variantImages.includes(img)
      );
      if (variantImageIndex !== -1) {
        setCurrentIndex(variantImageIndex);
        setModalIndex(variantImageIndex);
      }
    }
  }, [variantImages, images]);

  // Update currentIndex when initialIndex changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setModalIndex(initialIndex);
  }, [initialIndex]);

  // Handle modal open/close and body scroll
  useEffect(() => {
    if (isModalOpen) {
      // Prevent background scroll completely
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.height = "100%";
      document.body.style.top = `-${window.scrollY}px`;
      // Ensure modal covers everything by using highest z-index
      document.body.style.zIndex = "40";
    } else {
      // Restore scroll and styles
      const scrollY = document.body.style.top;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.top = "";
      document.body.style.zIndex = "";
      window.scrollTo(0, parseInt(scrollY || "0") * -1);
    }

    return () => {
      // Cleanup on unmount
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.height = "";
      document.body.style.top = "";
      document.body.style.zIndex = "";
    };
  }, [isModalOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          prevModalImage();
          break;
        case "ArrowRight":
          nextModalImage();
          break;
        case "Escape":
          closeModal();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, modalIndex, images.length]);

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        isModalOpen
      ) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isModalOpen]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalImage = () => {
    setModalIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevModalImage = () => {
    setModalIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Check if current image is a variant image
  const isVariantImage = variantImages.includes(images[currentIndex]);

  return (
    <div className="space-y-4">
      {/* Main Carousel */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
        {images.length > 0 ? (
          <>
            <button
              onClick={() => openModal(currentIndex)}
              className="w-full h-full cursor-zoom-in"
              aria-label="View full size image"
            >
              <img
                src={images[currentIndex]}
                alt={`${productName}${
                  variantName ? ` - ${variantName}` : ""
                } - Image ${currentIndex + 1}`}
                className="h-full w-full object-cover object-center transition-transform hover:scale-105"
              />
            </button>

            {/* Variant Badge */}
            {isVariantImage && variantName && (
              <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                {variantName}
              </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                  aria-label="Previous image"
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all hover:scale-110"
                  aria-label="Next image"
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-2 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-3 min-w-max pb-2">
            {images.map((image, index) => {
              const isVariantThumb = variantImages.includes(image);
              return (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200 ${
                    index === currentIndex
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />

                  {/* Variant indicator dot */}
                  {isVariantThumb && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border border-white"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Full Size Image Modal - Covers entire screen including header */}
      {isModalOpen && images.length > 0 && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm">
          {/* Modal Content - Full viewport with click outside area */}
          <div className="absolute inset-0" aria-hidden="true">
            {/* This invisible div covers the entire screen and handles outside clicks */}
            <div className="w-full h-full" onClick={closeModal} />
          </div>

          {/* Modal Content Container - Won't close when clicking inside */}
          <div
            ref={modalRef}
            className="relative w-full h-full flex items-center justify-center p-4"
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 z-50 text-white p-4 bg-black/70 rounded-full backdrop-blur-sm hover:bg-black/90 shadow-2xl cursor-pointer"
              aria-label="Close modal"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Main Image Container */}
            <div className="flex items-center justify-center w-full h-full max-w-7xl mx-auto">
              <img
                src={images[modalIndex]}
                alt={`${productName} - Image ${modalIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Variant Badge in Modal */}
            {variantImages.includes(images[modalIndex]) && variantName && (
              <div className="absolute top-8 left-8 bg-blue-600 text-white px-4 py-2 rounded-full text-base font-medium backdrop-blur-sm border border-white/20 shadow-2xl">
                {variantName}
              </div>
            )}

            {/* Modal Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevModalImage}
                  className="cursor-pointer absolute left-8 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-5 transition-all hover:scale-110 backdrop-blur-sm border border-white/30 shadow-2xl"
                  aria-label="Previous image"
                >
                  <svg
                    className="w-7 h-7"
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
                  onClick={nextModalImage}
                  className="cursor-pointer absolute right-8 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white rounded-full p-5 transition-all hover:scale-110 backdrop-blur-sm border border-white/30 shadow-2xl"
                  aria-label="Next image"
                >
                  <svg
                    className="w-7 h-7"
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
              </>
            )}

            {/* Modal Image Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white text-lg px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 shadow-2xl">
              {modalIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
