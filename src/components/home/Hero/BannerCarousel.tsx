"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { Banner } from "@/types/banner";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface BannerCarouselProps {
  banners: Banner[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  return (
    <div className="w-full h-[570px] rounded-lg overflow-hidden group relative">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        speed={1000}
        loop={true} // Add this for infinite loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: true,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Autoplay, Pagination, Navigation]}
        className="h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div
              className="w-full h-full bg-cover bg-center relative"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="absolute inset-0 pl-5 bg-opacity-30 flex items-center justify-left">
                <div className="text-left text-white p-8">
                  <h6 className="text-md font-bold mb-4 opacity-0 animate-[fadeInUp_0.3s_ease-out_0.1s_forwards]">
                    {banner.category}
                  </h6>
                  <h2 className="text-4xl font-bold mb-4 opacity-0 animate-[fadeInUp_0.3s_ease-out_0.2s_forwards]">
                    {banner.title}
                  </h2>
                  <p className="text-md mb-8 opacity-0 animate-[fadeInUp_0.3s_ease-out_0.3s_forwards]">
                    {banner.description}
                  </p>
                  <button className="bg-white text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors opacity-0 animate-[fadeInUp_0.3s_ease-out_0.4s_forwards]">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom navigation arrows */}
        <div className="custom-prev absolute left-4 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg">
          <svg
            className="w-5 h-5 text-gray-800"
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
        </div>

        <div className="custom-next absolute right-4 top-1/2 transform -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer shadow-lg">
          <svg
            className="w-5 h-5 text-gray-800"
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
        </div>
      </Swiper>
    </div>
  );
}
