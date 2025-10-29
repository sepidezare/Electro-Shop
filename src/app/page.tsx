import HeroSection from "@/app/components/home/Hero/HeroSection";
import BestSellerCarousel from "@/app/components/home/BestSellersCarousel";
import ProductCarouselBanner from "@/app/components/home/ProductCarouselBanner";
import BlogSection from "@/app/components/home/BlogSection";
import Categories from "@/app/components/home/Categories";
import ThreeCards from "@/app/components/home/3cards";
import TwoCards from "@/app/components/home/2cards";
import LatestCat from "@/app/components/home/LatestCat";
import OneCard from "@/app/components/home/1card";
import CartSidebar from "@/app/components/cart/CartSidebar";

export default function Home() {
  return (
    <main className="px-2">
      <HeroSection />
      <Categories />
      <LatestCat
        category="smart phone"
        title="New Smartphone Arrivals"
        limit={5}
      />
      <ThreeCards />
      <BestSellerCarousel />
      <ProductCarouselBanner />
      <TwoCards />
      <LatestCat
        category="smart watch"
        title="New Smartwatch Arrivals"
        limit={5}
      />
      <OneCard />
      <BlogSection />
    </main>
  );
}
