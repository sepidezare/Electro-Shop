"use client";

import Link from "next/link";
import { useState } from "react";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Animated Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-blue-900 to-purple-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              We Don&apos;t Just Sell Tech
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-200">
              We deliver{" "}
              <span className="font-bold text-white">digital experiences</span>{" "}
              that power your world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full transform hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Explore Our Universe
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Tech Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-blue-400 rounded-lg animate-float opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 border border-purple-400 rounded-full animate-float animation-delay-2000 opacity-40"></div>
        <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-cyan-400 animate-pulse opacity-30"></div>
      </section>

      {/* Interactive Timeline Story */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Digital Evolution
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From garage dreams to tech reality - follow our journey through
              the digital revolution
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {[
                { id: "story", label: "The Spark" },
                { id: "mission", label: "The Mission" },
                { id: "vision", label: "The Vision" },
                { id: "future", label: "The Future" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100">
              {activeTab === "story" && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Where It All Began
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg leading-relaxed">
                      In a world drowning in tech jargon and overwhelming
                      choices, four friends decided to build something
                      different.
                      <span className="font-semibold text-blue-600">
                        {" "}
                        Not just another store, but a tech sanctuary.
                      </span>
                    </p>
                    <p className="leading-relaxed">
                      We started in 2020 with a simple belief: technology should
                      empower, not confuse. What began as late-night coding
                      sessions and passionate debates about processor speeds has
                      evolved into a platform trusted by thousands.
                    </p>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-blue-500 mt-6">
                      <p className="font-semibold text-gray-800">
                        &quot;Our first sale was a refurbished laptop to a
                        college student. The thank you note we received
                        confirmed we were on the right path.&quot;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "mission" && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Our Digital Compass
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg leading-relaxed">
                      We&apos;re on a mission to{" "}
                      <span className="font-semibold text-purple-600">
                        democratize technology
                      </span>{" "}
                      by making premium devices accessible and understandable to
                      everyone.
                    </p>
                    <ul className="space-y-3">
                      {[
                        "Break down complex tech into simple, human language",
                        "Curate only the most reliable and innovative products",
                        "Provide unparalleled support that actually helps",
                        "Build a community, not just a customer base",
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === "vision" && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    The Horizon We Chase
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg leading-relaxed">
                      We envision a future where technology seamlessly enhances
                      every aspect of human life, and everyone has access to the
                      tools that make it possible.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-6 rounded-xl">
                        <h4 className="font-bold text-lg mb-2">Smart Living</h4>
                        <p className="text-blue-100">
                          Creating connected ecosystems that simplify daily life
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl">
                        <h4 className="font-bold text-lg mb-2">
                          Digital Inclusion
                        </h4>
                        <p className="text-gray-300">
                          Bridging the gap between technology and accessibility
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "future" && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Tomorrow&apos;s Tech, Today
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p className="text-lg leading-relaxed">
                      We&apos;re constantly exploring emerging technologies to
                      bring you the future, today. From AI-powered devices to
                      sustainable tech solutions.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {[
                        "AI Integration",
                        "Sustainable Tech",
                        "Quantum Computing",
                        "IoT Ecosystems",
                        "AR/VR Experiences",
                      ].map((tech, index) => (
                        <span
                          key={index}
                          className="bg-gradient-to-r from-green-100 to-blue-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Values Showcase */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Our Digital DNA
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Innovation First",
                desc: "We stay ahead of the curve, bringing you tomorrow&apos;s technology today",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
                title: "Quality Uncompromised",
                desc: "Every product is vetted, tested, and approved by our tech experts",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
                title: "Human Connection",
                desc: "Behind every device is a team that cares about your experience",
              },
              {
                icon: (
                  <svg
                    className="w-10 h-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Global Impact",
                desc: "We believe in technology that makes the world better, smarter, and more connected",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-blue-500 transition-all duration-500 hover:transform hover:-translate-y-2"
              >
                <div className="flex justify-center mb-4">
                  <div className="text-white group-hover:scale-110 transition-transform duration-300">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white text-center">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-center">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Stats */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "50K+", label: "Tech Lovers Served" },
              { number: "1000+", label: "Products Curated" },
              { number: "24/7", label: "Expert Support" },
              { number: "99%", label: "Happy Customers" },
            ].map((stat, index) => (
              <div key={index} className="group">
                <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Write Your Tech Story?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Join thousands of innovators, creators, and visionaries who trust us
            with their digital journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Start Your Journey
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              Talk to Our Experts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
