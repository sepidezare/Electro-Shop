//src/app/admin/products/edit/[id]/page.tsx
import { notFound } from "next/navigation";
import { Product } from "../../../../../types/product";
import ProductForm from "@/app/components/admin/ProductForm";
import clientPromise from "../../../../../lib/mongoDb";
import { ObjectId } from "mongodb";

async function getProduct(id: string): Promise<Product | null> {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }
    const client = await clientPromise;
    const db = client.db();
    const product = await db.collection("products").findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return null;
    }

    return {
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      categories: product.categories || [],
      image: product.image || "",
      inStock: product.inStock ?? true,
      rating: product.rating || 0,
      todayOffer: product.todayOffer || false,
      featuredProduct: product.featuredProduct || false,
      type: product.type || "simple",
      specifications: product.specifications || [],
      variants: product.variants || [],
      additionalMedia: product.additionalMedia || [],
      sku: product.sku || "",
      brand: product.brand || "",
      createdAt:
        product.createdAt instanceof Date
          ? product.createdAt.toISOString()
          : product.createdAt || new Date().toISOString(),

      updatedAt:
        product.updatedAt instanceof Date
          ? product.updatedAt.toISOString()
          : product.updatedAt || new Date().toISOString(),
    } as Product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  // Await the params
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Add debug logging to verify additionalMedia is being loaded
  console.log("🔄 EditProductPage - Product data:", {
    id: product._id,
    name: product.name,
    additionalMediaCount: product.additionalMedia?.length || 0,
    additionalMedia: product.additionalMedia,
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Edit Product</h2>
          <p className="text-gray-600 mt-1">Update product information</p>
          {/* Debug info */}
          <div className="mt-2 text-sm text-gray-500">
            Product ID: {product._id} | Additional Media:{" "}
            {product.additionalMedia?.length || 0} files
          </div>
        </div>

        <ProductForm product={product} />
      </div>
    </div>
  );
}
