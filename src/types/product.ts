export interface ProductSpecification {
  key: string; 
  value: string; 
}

export interface ProductVariant {
  _id: string;
  name?: string;
  sku?: string;
  price: number;
  discountPrice?: number;
  inStock: boolean;
  stockQuantity: number;
  specifications: ProductSpecification[];
  additionalMedia?: Array<{
    url: string;
    type: "image" | "video";
    name?: string;
    size?: number;
    mimeType?: string;
  }>;
  attributes?: Array<{ name: string; value: string }>;

  image: string; // This should be the permanent URL from the database
  imageFile?: File; // Temporary file object for new uploads
  imagePreview?: string; // Temporary blob URL for preview only
}

export interface ProductReview {
  userId: string;
  username: string;
  rating: number; // 1–5
  comment: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string; 
  description: string;
  price: number;
  discountPrice?: number;
  sku?: string;
  brand?: string;
  type: "simple" | "variable"; 
  categories: string[];
  categoryNames?: string[];
  image: string;
  additionalMedia: Array<{
    url: string;
    type: "image" | "video";
    name?: string;
    size?: number;
    mimeType?: string;
  }>;
  specifications?: ProductSpecification[]; 
  variants?: ProductVariant[]; 
  attributes?: Array<{ name: string; values: string[] }>; 
  defaultVariantId?: string; 
  inStock: boolean;
  stockQuantity?: number; 
  todayOffer: boolean;
  featuredProduct: boolean;
  seoTitle?: string;
  seoDescription?: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  shippingClass?: string;
  hasGuarantee: boolean;
  hasReferal: boolean;
  hasChange: boolean;
  createdAt: string;
  updatedAt: string;
  reviews?: ProductReview[];
  rating?: number;
  reviewCount?: number;
}
export interface Attribute {
  name: string;
  values: string[];
}
export interface ReviewSubmission {
  username: string;
  email: string;
  rating: number;
  comment: string;
}

export interface ProductReview extends ReviewSubmission {
  id: string;
  createdAt: string;
  verified?: boolean;
  helpful?: number;
  productSlug?: string;
}
