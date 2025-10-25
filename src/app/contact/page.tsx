"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    category: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Handle form submission here
    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    // Reset form or show success message
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-blue-900 to-purple-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Let's Connect
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-blue-200"
            >
              Your ideas, our technology - let's build something amazing
              together
            </motion.p>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border border-blue-400 rounded-lg animate-float opacity-60"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 border border-purple-400 rounded-full animate-float animation-delay-2000 opacity-40"></div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-100"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Send Us a Message
              </h2>
              <p className="text-gray-600 mb-8">
                We typically respond within 2 hours during business days
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="category"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Inquiry Type *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="sales">Sales Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="careers">Careers</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="What's this regarding?"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Tell us about your project, question, or how we can help..."
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-2xl"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </div>
                  ) : (
                    "Send Message →"
                  )}
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Information & Support Cards */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Quick Support Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: (
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    ),
                    title: "Live Chat",
                    desc: "Instant help from our experts",
                    action: "Start Chat",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: (
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
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    ),
                    title: "Call Us",
                    desc: "Mon-Fri, 9AM-6PM EST",
                    action: "+1 (555) 123-TECH",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: (
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
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    ),
                    title: "Email Direct",
                    desc: "Send us an email directly",
                    action: "hello@technex.com",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    icon: (
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    ),
                    title: "Response Time",
                    desc: "Typically within 2 hours",
                    action: "Quick Support",
                    color: "from-blue-500 to-cyan-500",
                  },
                ].map((card, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-r ${card.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      {card.icon}
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">{card.desc}</p>
                    <p className="font-semibold text-gray-900">{card.action}</p>
                  </div>
                ))}
              </div>
              {/* Contact Details */}
              <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: "📍",
                      title: "Visit Our Office",
                      detail: "123 Tech Boulevard, Digital District, CA 94105",
                    },
                    {
                      icon: "🌐",
                      title: "Connect Online",
                      detail: "Follow us on social media for updates",
                    },
                    {
                      icon: "⚡",
                      title: "Emergency Support",
                      detail: "24/7 critical technical support available",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="text-2xl mt-1">{item.icon}</div>
                      <div>
                        <h4 className="font-semibold text-blue-300">
                          {item.title}
                        </h4>
                        <p className="text-gray-300">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map & Location Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-35">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Find Our Tech Hub
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Visit our flagship store and experience the latest technology in
              person
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Container */}
            <div className="lg:col-span-2 bg-gray-100 rounded-2xl overflow-hidden border border-gray-300">
              <div className="h-96 bg-gradient-to-br from-blue-50 to-gray-100 relative">
                {/* Simplified Map Layout */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-20 h-20 mx-auto mb-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p className="text-gray-500 font-medium">Interactive Map</p>
                    <p className="text-gray-400 text-sm">
                      Location services enabled
                    </p>
                  </div>
                </div>

                {/* Map Marker */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white px-3 py-1 rounded-lg shadow-lg border border-gray-200">
                      <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">
                        TechNex Store
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Controls */}
              <div className="bg-white p-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">
                      Silicon Valley Tech Campus
                    </span>
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Get Directions
                  </button>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Store Information
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">
                    📍 Main Store Address
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    123 Innovation Drive
                    <br />
                    Suite 450
                    <br />
                    Silicon Valley, CA 94025
                    <br />
                    United States
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    🕒 Store Hours
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Monday - Friday:</span>
                      <span className="font-medium">9:00 AM - 9:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="font-medium">10:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="font-medium">11:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    📞 Store Contact
                  </h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      Phone:{" "}
                      <span className="font-medium">+1 (650) 123-4567</span>
                    </p>
                    <p>
                      Email:{" "}
                      <span className="font-medium">store@technex.com</span>
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    🚗 Parking & Access
                  </h4>
                  <div className="text-sm text-gray-600">
                    <p>Free underground parking available</p>
                    <p>Wheelchair accessible</p>
                    <p>EV charging stations on-site</p>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 mt-4">
                  Get Directions ↗
                </button>
              </div>
            </div>
          </div>

          {/* Additional Locations */}
          <div className="mt-12 bg-blue-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Other Locations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  city: "San Francisco",
                  address: "789 Market Street, Downtown, SF 94102",
                  phone: "+1 (415) 123-4567",
                  hours: "10AM-8PM Daily",
                },
                {
                  city: "New York",
                  address: "456 Broadway, Manhattan, NY 10012",
                  phone: "+1 (212) 123-4567",
                  hours: "9AM-9PM Mon-Sat",
                },
                {
                  city: "Austin",
                  address: "321 Tech Ridge, Austin, TX 78701",
                  phone: "+1 (512) 123-4567",
                  hours: "10AM-7PM Daily",
                },
              ].map((location, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <h4 className="font-bold text-gray-800 mb-2">
                    {location.city}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {location.address}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">{location.phone}</p>
                  <p className="text-xs text-gray-500">{location.hours}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mb-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 w-full max-w-7xl">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Quick Answers
              </h3>
              <div className="space-y-3">
                {[
                  "How do I track my order?",
                  "What is your return policy?",
                  "Do you offer bulk discounts?",
                  "Technical specifications help",
                ].map((question, index) => (
                  <Link
                    key={index}
                    href="#"
                    className="block p-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors duration-200 border border-transparent hover:border-blue-200"
                  >
                    {question} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Check out our comprehensive FAQ section or browse our knowledge base
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#"
              className="bg-white text-blue-600 font-bold py-4 px-8 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              Visit FAQ Section
            </Link>
            <Link
              href="#"
              className="border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-300"
            >
              Knowledge Base
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
