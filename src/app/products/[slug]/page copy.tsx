import { notFound } from "next/navigation";
import { Product } from "../../../types/product";
import ProductDetails from "@/components/Products/ProductDetails";

async function fetchProduct(slug: string): Promise<Product | null> {
  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        : "";
    const url = `${baseUrl}/api/public/products/${slug}`;
    console.log("🧭 Fetching product from:", url);

    const res = await fetch(url, { cache: "no-store" });
    console.log("📦 Response status:", res.status);

    if (!res.ok) return null;

    const product: Product = await res.json();
    console.log("✅ Product fetched:", product.name);
    return product;
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await fetchProduct(params.slug);

  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  );
}
