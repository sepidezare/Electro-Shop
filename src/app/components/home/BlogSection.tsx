"use client";
import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  readTime: string;
  category: string;
  featured: boolean;
}

const BlogSection = () => {
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Amazon cuts its workforce by 14,000 in further embrace of AI",
      excerpt:
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
      image: "/images/home/blog/big.webp",
      date: "May 15, 2023",
      readTime: "5 min read",
      category: "Technology",
      featured: true,
    },
    {
      id: 2,
      title:
        "Insta360 X4 Air is a lightweight 8K 360-degree camera Insta360 X4 Air is a lightweight 8K 360-degree camera",
      excerpt:
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
      image: "/images/home/blog/small1.webp",
      date: "May 10, 2023",
      readTime: "3 min read",
      category: "Technology",
      featured: false,
    },
    {
      id: 3,
      title:
        "Amazon Echo Studio (2025) review: A comprehensive redesign for Alexa",
      excerpt:
        "Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",

      image: "/images/home/blog/small2.webp",
      date: "May 5, 2023",
      readTime: "4 min read",
      category: "Technology",
      featured: false,
    },
  ];

  const featuredPost = blogPosts.find((post) => post.featured);
  const sidePosts = blogPosts.filter((post) => !post.featured);

  // If no featured post exists, use the first post as featured
  const displayFeaturedPost = featuredPost || blogPosts[0];
  const displaySidePosts = featuredPost ? sidePosts : blogPosts.slice(1);

  // Refs and state to manage heights
  const featuredRef = useRef<HTMLDivElement>(null);
  const sidePostsRef = useRef<HTMLDivElement>(null);
  const [featuredHeight, setFeaturedHeight] = useState<number | null>(null);

  // Measure the height of the featured post and apply it to side posts container
  useEffect(() => {
    const updateHeight = () => {
      if (featuredRef.current) {
        const height = featuredRef.current.getBoundingClientRect().height;
        setFeaturedHeight(height);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Early return if no posts exist
  if (blogPosts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Latest Blog Posts
        </h2>
        <p className="text-center text-gray-500">No blog posts available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 font-jamjuree">
            Latest News
          </h2>
        </div>

        <Link
          href="/products"
          className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
        >
          See All
          <svg
            className="w-4 h-4 ml-1"
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
        </Link>
      </div>

      {/* Mobile & Tablet Layout - 3 posts with image at top, full width */}
      <div className="lg:hidden flex flex-col gap-8">
        {[displayFeaturedPost, ...displaySidePosts.slice(0, 2)].map(
          (post, index) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 md:h-76 object-cover"
              />
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {post.readTime}
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
                  Read More
                </button>
              </div>
            </div>
          )
        )}
      </div>

      {/* Desktop Layout - Original layout */}
      <div className="hidden lg:flex flex-col lg:flex-row gap-8">
        <div className="lg:w-6/12">
          <div
            ref={featuredRef}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={displayFeaturedPost.image}
              alt={displayFeaturedPost.title}
              className="w-full h-64 md:h-76 object-cover"
            />
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {displayFeaturedPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {displayFeaturedPost.readTime}
                </span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  {displayFeaturedPost.category}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {displayFeaturedPost.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {displayFeaturedPost.excerpt}
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-300">
                Read More
              </button>
            </div>
          </div>
        </div>

        {/* Side Posts (Right) - Exact height match with left, square full-height images */}
        <div
          ref={sidePostsRef}
          className="lg:w-7/12 flex flex-col gap-6"
          style={{ height: featuredHeight ? `${featuredHeight}px` : "auto" }}
        >
          {displaySidePosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{
                height: featuredHeight
                  ? `calc((${featuredHeight}px - 1.5rem) / 2)` // Subtract gap (1.5rem = 24px) and split height
                  : "auto",
              }}
            >
              <div className="flex h-full">
                <div className="flex-shrink-0 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 md:p-6 flex flex-col flex-1 min-h-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-2">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-1 overflow-hidden">
                    {post.excerpt}
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center gap-1 transition-colors duration-300 mt-auto">
                    Read More
                    <svg
                      className="w-4 h-4"
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogSection;
