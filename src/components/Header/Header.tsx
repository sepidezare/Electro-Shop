"use client";
import Link from "next/link";
import Image from "next/image";
import CategorySearch from "./CategorySearch";
import MegaMenu from "./MegaMenu";
import CartHeader from "../cart/HeaderCart";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 py-4 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-8">
          {/* Left*/}
          <div className="flex-shrink-0 flex w-1/4 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold">ElectroShop</span>
            </Link>
          </div>
          {/* Center: Search */}
          <div className="flex-1 max-w-2xl">
            <CategorySearch />
          </div>

          {/* Right: Logo */}
          <div className="flex-shrink-0 w-1/4 flex justify-end">
            {/* <Link href="/" className="flex items-center">
              <Image
                src="/images/electron.png"
                alt="logo"
                width={120}
                height={40}
                className=" w-auto"
              />
            </Link> */}
            <MegaMenu />
            <CartHeader />
          </div>
        </div>
      </div>
    </header>
  );
}
