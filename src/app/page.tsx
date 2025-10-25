import HeroSection from "../components/home/Hero/HeroSection";
import Latest from "@/components/home/Latest";
import BestSellerCarousel from "@/components/home/BestSellersCarousel";
import ProductCarouselBanner from "@/components/home/ProductCarouselBanner";
import BlogSection from "@/components/home/BlogSection";
import Categories from "@/components/home/Categories";
import ThreeCards from "@/components/home/3cards";
import TwoCards from "@/components/home/2cards";
import OneCard from "@/components/home/1card";
import CartSidebar from "@/components/cart/CartSidebar";
export default function Home() {
  return (
    <main className="px-2">
      <HeroSection />
      <Categories />
      <Latest />
      <ThreeCards />
      <BestSellerCarousel />
      <ProductCarouselBanner />
      <TwoCards />
      <Latest />
      <OneCard />
      <BlogSection />
    </main>
  );
}
