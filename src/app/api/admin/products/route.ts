import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongoDb';
import { ObjectId } from 'mongodb';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { Product, ProductVariant } from '../../../../types/product';
import { put } from '@vercel/blob';
// File upload configuration
const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: {
    IMAGE: 5 * 1024 * 1024, // 5MB for images
    VIDEO: 50 * 1024 * 1024, // 50MB for videos
  },
  ALLOWED_IMAGE_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/avif',
  ],
  ALLOWED_VIDEO_TYPES: [
    'video/mp4',
    'video/mpeg',
    'video/ogg',
    'video/webm',
    'video/quicktime',
  ],
  ALLOWED_EXTENSIONS: {
    IMAGE: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'],
    VIDEO: ['.mp4', '.mpeg', '.ogg', '.webm', '.mov'],
  },
};

// Define attribute types
interface ProductAttribute {
  name: string;
  values: string[];
}

interface VariantAttribute {
  name: string;
  value: string;
}

// Validate attributes structure
function validateAttributes(attributes: unknown): attributes is ProductAttribute[] {
  if (!Array.isArray(attributes)) {
    return false;
  }
  return attributes.every(
    (attr) =>
      typeof attr === 'object' &&
      attr !== null &&
      typeof (attr as ProductAttribute).name === 'string' &&
      (attr as ProductAttribute).name.trim() !== '' &&
      Array.isArray((attr as ProductAttribute).values) &&
      (attr as ProductAttribute).values.every((value: unknown) => typeof value === 'string' && value.trim() !== '')
  );
}

// Validate variant attributes
function validateVariantAttributes(
  variants: unknown[],
  productAttributes: ProductAttribute[]
): variants is ProductVariant[] {
  if (!Array.isArray(variants)) {
    return false;
  }

  return variants.every((variant) => {
    const v = variant as ProductVariant;
    
    // Validate attributes structure
    const attributesValid = Array.isArray(v.attributes) && v.attributes.every((attr: unknown) => {
      const attribute = attr as VariantAttribute;
      return typeof attribute === 'object' &&
        attribute !== null &&
        typeof attribute.name === 'string' &&
        attribute.name.trim() !== '' &&
        typeof attribute.value === 'string' &&
        attribute.value.trim() !== '';
    });

    return attributesValid;
  });
}

// GET all products
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const products = await db
      .collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serializedProducts = products.map(product => ({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      categories: product.categories || [],
      image: product.image,
      inStock: product.inStock,
      rating: product.rating || 0,
      additionalMedia: product.additionalMedia || [],
      type: product.type || 'simple',
      sku: product.sku || '',
      brand: product.brand || '',
      stockQuantity: product.stockQuantity || 0,
      weight: product.weight || 0,
      dimensions: product.dimensions || { width: 0, height: 0, depth: 0 },
      shippingClass: product.shippingClass || '',
      hasGuarantee: product.hasGuarantee || false,
      hasReferal: product.hasReferal || false,
      hasChange: product.hasChange || false,
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || '',
      attributes: product.attributes || [],
      specifications: product.specifications || [],
      variants: (product.variants || []).map((variant: unknown) => ({
        ...(variant as ProductVariant),
        _id: (variant as ProductVariant)._id?.toString() || new ObjectId().toString(),
      })),
      todayOffer: product.todayOffer || false,
      featuredProduct: product.featuredProduct || false,
      slug: product.slug || '',
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error) {
  console.error('Error creating product:', error);

  return NextResponse.json(
    {
      error: error instanceof Error ? error.message : JSON.stringify(error),
      stack: error instanceof Error ? error.stack : undefined,
    },
    { status: 500 }
  );
}


}

// POST - Create new product
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();

    const formData = await request.formData();

    // Extract form fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const discountPrice = parseFloat(formData.get('discountPrice') as string) || 0;
    const categoriesJson = formData.get('categories') as string;
    const inStock = formData.get('inStock') === 'true';
    const rating = parseFloat(formData.get('rating') as string) || 0;
    const categories = categoriesJson ? JSON.parse(categoriesJson) : [];
    const rawType = formData.get('type') as string;
    const type: 'simple' | 'variable' = rawType === 'variable' ? 'variable' : 'simple';
    const sku = formData.get('sku') as string || '';
    const brand = formData.get('brand') as string || '';
    const stockQuantity = parseInt(formData.get('stockQuantity') as string) || 0;
    const weight = parseFloat(formData.get('weight') as string) || 0;
    const dimensionsJson = formData.get('dimensions') as string;
    const shippingClass = formData.get('shippingClass') as string || '';
    const hasGuarantee = formData.get('hasGuarantee') === 'true';
    const hasReferal = formData.get('hasReferal') === 'true';
    const hasChange = formData.get('hasChange') === 'true';
    const seoTitle = formData.get('seoTitle') as string || '';
    const seoDescription = formData.get('seoDescription') as string || '';
    const attributesJson = formData.get('attributes') as string;
    const specificationsJson = formData.get('specifications') as string;
    const variantsJson = formData.get('variants') as string;
    const todayOffer = formData.get('todayOffer') === 'true';
    const featuredProduct = formData.get('FeaturedProduct') === 'true';

    const dimensions = dimensionsJson
      ? JSON.parse(dimensionsJson)
      : { width: 0, height: 0, depth: 0 };
    const attributes = attributesJson ? JSON.parse(attributesJson) : [];
    const specifications = specificationsJson ? JSON.parse(specificationsJson) : [];
    let variants = variantsJson ? JSON.parse(variantsJson) : [];

    // Validate required fields
    if (!name || !description || categories.length === 0) {
      return NextResponse.json(
        { error: 'Name, description, and at least one category are required' },
        { status: 400 }
      );
    }

    // Validate all categories exist
    for (const categoryId of categories) {
      if (!ObjectId.isValid(categoryId)) {
        return NextResponse.json({ error: `Invalid category ID: ${categoryId}` }, { status: 400 });
      }
      const categoryExists = await db.collection('categories').findOne({
        _id: new ObjectId(categoryId),
      });
      if (!categoryExists) {
        return NextResponse.json({ error: `Category not found: ${categoryId}` }, { status: 400 });
      }
    }

    // Validate attributes
    if (!validateAttributes(attributes)) {
      return NextResponse.json({ error: 'Invalid attributes format' }, { status: 400 });
    }

    // Validate variations for variable products
    if (type === 'variable') {
      if (!variants || variants.length === 0) {
        return NextResponse.json(
          { error: 'Variable products must have at least one variation' },
          { status: 400 }
        );
      }
      if (!validateVariantAttributes(variants, attributes)) {
        return NextResponse.json({ error: 'Invalid variant attributes format' }, { status: 400 });
      }
      
      // Process variant images
      variants = await Promise.all(
        variants.map(async (variant: unknown, index: number) => {
          const v = variant as ProductVariant;
          const variantImageFile = formData.get(`variantImage-${index}`) as File;
          let variantImageUrl = v.image;

          if (variantImageFile && variantImageFile.size > 0) {
            const validationError = validateFile(variantImageFile, 'image');
            if (validationError) {
              console.error(`Variant ${index} image validation error:`, validationError);
            } else {
              variantImageUrl = await saveUploadedFile(variantImageFile);
            }
          }

          return {
            ...v,
            _id: new ObjectId().toString(),
            image: variantImageUrl,
          };
        })
      );
    } else {
      variants = [];
    }

    // Validate discount price
    if (discountPrice > price) {
      return NextResponse.json(
        { error: 'Discount price cannot be greater than regular price' },
        { status: 400 }
      );
    }

    // Handle main image
    let mainImageUrl = formData.get('imageUrl') as string;
    const mainImageFile = formData.get('mainImage') as File;

    if (mainImageFile && mainImageFile.size > 0) {
      const validationError = validateFile(mainImageFile, 'image');
      if (validationError) {
        return NextResponse.json({ error: `Main image: ${validationError}` }, { status: 400 });
      }
      mainImageUrl = await saveUploadedFile(mainImageFile);
    }

    if (!mainImageUrl) {
      return NextResponse.json({ error: 'Main image is required' }, { status: 400 });
    }

    // Handle additional media files
    const mediaFiles = formData.getAll('mediaFiles') as File[];
    const additionalMedia: Array<{
      url: string;
      type: 'image' | 'video';
      name?: string;
      size?: number;
      mimeType?: string;
    }> = [];

    for (const mediaFile of mediaFiles) {
      if (mediaFile && mediaFile.size > 0) {
        const fileType = mediaFile.type.startsWith('image/') ? 'image' : mediaFile.type.startsWith('video/') ? 'video' : null;
        if (!fileType) {
          continue;
        }
        const validationError = validateFile(mediaFile, fileType);
        if (validationError) {
          continue;
        }
        const mediaUrl = await saveUploadedFile(mediaFile);
        additionalMedia.push({
          url: mediaUrl,
          type: fileType,
          name: mediaFile.name,
          size: mediaFile.size,
          mimeType: mediaFile.type,
        });
      }
    }

    // Generate slug from name
    const slug = generateSlug(name);

    // Create product in database
    const productData: Omit<Product, '_id'> = {
      name,
      description,
      price,
      discountPrice,
      categories,
      image: mainImageUrl,
      inStock,
      rating,
      additionalMedia,
      type,
      sku,
      brand,
      stockQuantity,
      weight,
      dimensions,
      shippingClass,
      hasGuarantee,
      hasReferal,
      hasChange,
      seoTitle,
      seoDescription,
      attributes,
      specifications,
      variants,
      todayOffer,
      featuredProduct,
      slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection('products').insertOne(productData);
    return NextResponse.json({
      success: true,
      insertedId: result.insertedId.toString(),
      product: {
        ...productData,
        _id: result.insertedId.toString(),
      },
      message: 'Product created successfully',
    });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

// Helper functions
function validateFile(file: File, expectedType: 'image' | 'video'): string | null {
  if (expectedType === 'image') {
    if (!UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `Image type not allowed. Allowed types: ${UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.join(', ')}`;
    }
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE.IMAGE) {
      const maxSizeMB = UPLOAD_CONFIG.MAX_FILE_SIZE.IMAGE / (1024 * 1024);
      return `Image size too large. Maximum size: ${maxSizeMB}MB`;
    }
  } else if (expectedType === 'video') {
    if (!UPLOAD_CONFIG.ALLOWED_VIDEO_TYPES.includes(file.type)) {
      return `Video type not allowed. Allowed types: ${UPLOAD_CONFIG.ALLOWED_VIDEO_TYPES.join(', ')}`;
    }
    if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE.VIDEO) {
      const maxSizeMB = UPLOAD_CONFIG.MAX_FILE_SIZE.VIDEO / (1024 * 1024);
      return `Video size too large. Maximum size: ${maxSizeMB}MB`;
    }
  }
  const fileExtension = path.extname(file.name).toLowerCase();
  const allowedExtensions = expectedType === 'image' ? UPLOAD_CONFIG.ALLOWED_EXTENSIONS.IMAGE : UPLOAD_CONFIG.ALLOWED_EXTENSIONS.VIDEO;
  if (!allowedExtensions.includes(fileExtension)) {
    return `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`;
  }
  const dangerousTypes = [
    'application/x-msdownload',
    'application/x-sh',
    'application/x-bat',
    'application/x-csh',
    'application/x-php',
    'text/x-php',
    'application/x-httpd-php',
  ];
  if (dangerousTypes.includes(file.type)) {
    return 'File type is not allowed for security reasons';
  }
  if (file.size === 0) {
    return 'File is empty';
  }
  return null;
}



async function saveUploadedFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // If running on Vercel, use Blob storage
  if (process.env.VERCEL === '1' || process.env.VERCEL_ENV) {
    const blob = await put(file.name, buffer, {
      access: 'public',
      contentType: file.type,
    });
    return blob.url;
  }

  // Local file saving (for dev)
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadDir, { recursive: true });
  const timestamp = Date.now();
  const ext = path.extname(file.name);
  const safeName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${safeName}${ext}`;
  const filePath = path.join(uploadDir, fileName);
  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
}


function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}