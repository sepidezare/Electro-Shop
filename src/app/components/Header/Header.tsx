"use client";
import Link from "next/link";
import Image from "next/image";
import CategorySearch from "./CategorySearch";
import MegaMenu from "./MegaMenu";
import CartHeader from "../cart/HeaderCart";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-4 relative z-50">
      <div className="container mx-auto px-4">
        {/* Desktop: flex-row, Mobile: flex-col */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
          {/* Left + Right in one flex row */}
          <div className="flex items-center justify-between w-full md:w-auto md:flex-1">
            {/* Left */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <span className="text-xl font-bold">ElectroShop</span>
              </Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3 md:gap-6">
              <MegaMenu />
              <CartHeader />
            </div>
          </div>

          {/* Search — full width on mobile/tablet, centered on desktop */}
          <div className="w-full md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-2xl">
            <CategorySearch />
          </div>
        </div>
      </div>
    </header>
  );
}
