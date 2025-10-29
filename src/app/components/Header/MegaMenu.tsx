"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Category } from "@/types/category";

export default function MegaMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeParent, setActiveParent] = useState<Category | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1200);
    handleResize();
    console.log("resized");
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/public/categories");
        const data: Category[] = await res.json();
        setCategories(data);

        // Set default active category (first category in the list)
        if (data.length > 0) {
          setActiveParent(data[0]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Hover/click control
  const handleMouseEnter = () => {
    if (!isMobile) setIsMenuOpen(true);
  };
  const handleMouseLeave = () => {
    if (!isMobile) setIsMenuOpen(false);
  };

  // Close menu function
  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsLocked(false);
  };

  // Handle link click - close the menu
  const handleLinkClick = () => {
    closeMenu();
  };

  return (
    <div className="relative">
      {/* Menu Icon */}
      <button
        onClick={() => isMobile && setIsMenuOpen((prev) => !prev)}
        onMouseEnter={() => !isMobile && setIsMenuOpen(true)}
        className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Fullscreen Menu */}
      {isMenuOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-white z-40 flex transition-all duration-300"
          onMouseLeave={() => !isMobile && setIsMenuOpen(false)}
          onMouseEnter={() => !isMobile && setIsMenuOpen(true)}
        >
          {/* Close button */}
          <button
            className="cursor-pointer absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100 z-50"
            onClick={closeMenu}
          >
            <svg
              className="w-6 h-6"
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
          {/* Close (mobile only) */}
          {isMobile && (
            <button
              className="absolute top-6 right-6 p-2 rounded-lg hover:bg-gray-100"
              onClick={closeMenu}
            >
              <svg
                className="w-6 h-6"
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
          )}

          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">Categories</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat.id}
                  // Only change active on hover if not locked
                  onMouseEnter={() =>
                    !isMobile && !isLocked && setActiveParent(cat)
                  }
                  className={`cursor-pointer px-3 py-2 rounded-md hover:bg-blue-100 ${
                    activeParent?.id === cat.id ? "bg-blue-50" : ""
                  }`}
                >
                  <Link
                    href={`/shop?category=${cat.slug}`}
                    onClick={handleLinkClick}
                    className="w-full h-full block" // Make the link fill the entire li
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* Right Section */}
          <div className="flex-1 p-1 md:p-8 overflow-y-auto">
            {activeParent ? (
              <>
                <h3 className="text-2xl font-semibold mb-6">
                  {activeParent.name}
                </h3>
                {activeParent.children && activeParent.children.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {activeParent.children.map((child) => (
                      <Link
                        key={child.id}
                        href={`/shop?category=${child.slug}`}
                        onClick={handleLinkClick}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        {/* Image */}
                        {/* <div className="relative w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-xl overflow-hidden">
                          {child.image ? (
                            <Image
                              src={child.image}
                              alt={child.name}
                              fill
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                              No Image
                            </div>
                          )}
                        </div> */}

                        {/* Text: Name + Product Count */}
                        <div className="flex flex-col">
                          <span className="text-gray-800 font-medium hover:text-[#00aaff]">
                            {child.name}
                          </span>
                          {child.productCount !== undefined && (
                            <span className="text-sm text-gray-500">
                              {child.productCount} products
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No subcategories available.</p>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                {isMobile
                  ? "Tap a category to view subcategories"
                  : "Hover a category to view subcategories"}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
