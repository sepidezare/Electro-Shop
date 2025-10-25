// components/HeroCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Types
interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
}

interface HeroCarouselProps {
  slides?: CarouselSlide[]; // Make slides optional
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showThumbnails?: boolean;
}

// Main Component
export default function HeroCarousel({
  slides = [], // Provide default empty array
  autoPlay = true,
  autoPlayInterval = 5000,
  showThumbnails = false,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample data - you can replace this with props or keep it internal
  const defaultSlides: CarouselSlide[] = [
    {
      id: "1",
      image: "/home/hero/hero-1.png",
      title: "Summer Collection 2024",
      subtitle: "Discover the Latest Trends",
      description:
        "Get ready for summer with our exclusive collection. Fresh styles, vibrant colors, and comfortable fabrics.",
      ctaText: "Shop Now",
      ctaLink: "/collection/summer-2024",
      badge: "New Arrival",
    },
    {
      id: "2",
      image: "/home/hero/hero-2.png",
      title: "Up to 50% Off",
      subtitle: "End of Season Sale",
      description:
        "Don't miss our biggest sale of the year. Limited time offers on selected items.",
      ctaText: "Explore Deals",
      ctaLink: "/sale",
      badge: "Sale",
    },
    {
      id: "3",
      image: "/home/hero/hero-3.png",
      title: "Premium Quality",
      subtitle: "Luxury Meets Comfort",
      description:
        "Experience the finest materials and craftsmanship in our premium collection.",
      ctaText: "Discover Luxury",
      ctaLink: "/collection/premium",
    },
  ];

  const displaySlides = slides.length > 0 ? slides : defaultSlides;
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (!autoPlay || isPaused) return;

    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, displaySlides.length, isPaused]);

  const handleUserInteraction = () => {
    setIsPaused(true);

    // Optional: Resume auto-play after some time of inactivity
    setTimeout(() => {
      setIsPaused(false);
    }, 20000); // Resume after 20 seconds of inactivity
  };

  // Update your navigation functions to trigger pause
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + displaySlides.length) % displaySlides.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Thumbnail Component
  const Thumbnails = () => (
    <div className="w-80 bg-black/20 backdrop-blur-sm border-l border-white/10">
      <div className="p-6 h-full flex flex-col justify-center space-y-4">
        {displaySlides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => goToSlide(index)}
            className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
              index === currentSlide
                ? "bg-white/20 border-2 border-white"
                : "bg-white/10 border-2 border-transparent hover:bg-white/15"
            }`}
          >
            <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-left">
              <h3
                className={`font-semibold text-sm mb-1 ${
                  index === currentSlide ? "text-white" : "text-gray-300"
                }`}
              >
                {slide.title}
              </h3>
              <p
                className={`text-xs ${
                  index === currentSlide ? "text-gray-200" : "text-gray-400"
                }`}
              >
                {slide.subtitle}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // Main Carousel Content
  const MainCarousel = () => (
    <div className="flex-1 relative">
      <div className="relative h-full w-full">
        {displaySlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            <div className="relative z-10 flex h-full items-center">
              <div
                className={`container mx-auto px-6 ${
                  showThumbnails ? "pr-12" : ""
                }`}
              >
                <div
                  className={`text-white ${
                    showThumbnails ? "max-w-2xl" : "max-w-lg"
                  }`}
                >
                  {slide.badge && (
                    <span className="mb-4 inline-block rounded-full bg-red-600 px-4 py-2 text-sm font-semibold uppercase tracking-wide">
                      {slide.badge}
                    </span>
                  )}

                  <h1
                    className={`mb-4 font-bold leading-tight ${
                      showThumbnails
                        ? "text-5xl md:text-6xl"
                        : "text-4xl md:text-5xl"
                    }`}
                  >
                    {slide.title}
                  </h1>

                  <h2
                    className={`mb-4 font-light text-gray-200 ${
                      showThumbnails
                        ? "text-2xl md:text-3xl"
                        : "text-xl md:text-2xl"
                    }`}
                  >
                    {slide.subtitle}
                  </h2>

                  <p
                    className={`mb-8 text-gray-300 leading-relaxed ${
                      showThumbnails
                        ? "text-lg md:text-xl"
                        : "text-base md:text-lg"
                    }`}
                  >
                    {slide.description}
                  </p>

                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center rounded-lg bg-white px-6 py-3 md:px-8 md:py-4 font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:shadow-lg hover:scale-105"
                  >
                    {slide.ctaText}
                    <svg
                      className="ml-2 h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          prevSlide();
          handleUserInteraction();
        }}
        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg
          className="h-5 w-5 md:h-6 md:w-6"
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
        onClick={() => {
          nextSlide();
          handleUserInteraction();
        }}
        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-110"
        aria-label="Next slide"
      >
        <svg
          className="h-5 w-5 md:h-6 md:w-6"
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

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 space-x-3">
        {displaySlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-8 rounded-full transition-all ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section
      className={`relative w-full overflow-hidden bg-gray-100 ${
        showThumbnails ? "h-[700px]" : "h-[500px] md:h-[600px]"
      }`}
    >
      <div className="flex h-full">
        <MainCarousel />
        {showThumbnails && <Thumbnails />}
      </div>

      {/* Progress Bar */}
      {autoPlay && (
        <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-white/20">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{
              width: `${((currentSlide + 1) / displaySlides.length) * 100}%`,
            }}
          />
        </div>
      )}
    </section>
  );
}
