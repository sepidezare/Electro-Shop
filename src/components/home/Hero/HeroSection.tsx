import { Product } from "@/types/product";
import { Banner } from "@/types/banner";
import ProductOfTheDay from "./ProductOfTheDay";
import BannerCarousel from "./BannerCarousel";
import ProductCarousel from "./ProductCarousel";
export default function HeroSection() {
  const productOfTheDay: Product = {
    _id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    discountPrice: 129.99,
    price: 199.99,
    image: "/images/home/product/1.webp",
    categories: ["electronics", "audio"],
    inStock: true,
    rating: 4.5,
    additionalMedia: [],
    todayOffer: false,
    featuredProduct: false,
    hasChange: false,
    hasGuarantee: false,
    hasReferal: false,
    slug: "",
    type: "simple",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01",
  };

  const featuredProducts: Product[] = [
    {
      _id: "1",
      name: "Smart Watch",
      description: "Feature-rich smartwatch with health monitoring",
      discountPrice: 199.99,
      price: 249.99,
      image: "/images/home/product/pro1.png",
      categories: ["electronics", "wearables"],
      inStock: true,
      rating: 4.3,
      additionalMedia: [],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      todayOffer: false,
      featuredProduct: false,
      hasChange: false,
      hasGuarantee: false,
      hasReferal: false,
      slug: "",
      type: "simple",
    },
    {
      _id: "2",
      name: "Bluetooth Speaker",
      description: "Portable Bluetooth speaker with excellent sound quality",
      discountPrice: 79.99,
      price: 99.99,
      image: "/images/home/product/pro2.png",
      categories: ["electronics", "audio"],
      inStock: true,
      rating: 4.2,
      additionalMedia: [],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      todayOffer: false,
      featuredProduct: false,
      hasChange: false,
      hasGuarantee: false,
      hasReferal: false,
      slug: "",
      type: "simple",
    },
    {
      _id: "3",
      name: "Gaming Mouse",
      description: "High-precision gaming mouse with RGB lighting",
      price: 49.99,
      image: "/images/home/product/pro3.png",
      categories: ["electronics", "gaming"],
      inStock: true,
      rating: 4.4,
      additionalMedia: [],
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
      todayOffer: false,
      featuredProduct: false,
      hasChange: false,
      hasGuarantee: false,
      hasReferal: false,
      slug: "",
      type: "simple",
    },
  ];

  const banners: Banner[] = [
    {
      id: "1",
      image: "/images/home/banner/headphone-black.jpg",
      title: "BOSE HEADPHONE",
      category: "SOUND $ AUDIO",
      description: "wireless noise canceling",
      link: "/summer-sale",
    },
    {
      id: "2",
      image: "/images/home/banner/home10-slider-1.jpg",
      title: "NEW ARRIVALS",
      category: "GAMING CONSOLE",
      description: "Discover the latest trends",
      link: "/new-arrivals",
    },
    {
      id: "3",
      image: "/images/home/banner/3.webp",
      title: "APPLE VISION",
      category: "VIRTUAL GLASSES",
      description: "A new dimention for entertainment",
      link: "/free-shipping",
    },
  ];

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-8 font-jamjuree">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 h-auto lg:h-[600px]">
        <div className="md:col-span-2 lg:col-span-6 xl:col-span-8 order-1 lg:order-2">
          <BannerCarousel banners={banners} />
        </div>

        <div className="md:col-span-1 lg:col-span-3 xl:col-span-2 order-2 lg:order-1">
          <ProductCarousel products={featuredProducts} />
        </div>

        <div className="md:col-span-1 lg:col-span-3 xl:col-span-2 order-3 lg:order-3">
          <ProductOfTheDay product={productOfTheDay} />
        </div>
      </div>
    </section>
  );
}
