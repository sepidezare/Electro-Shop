import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongoDb';
import { ObjectId } from 'mongodb';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { Product, ProductVariant } from '../../../../types/product';

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

// Validate attributes structure
function validateAttributes(attributes: any): attributes is Array<{ name: string; values: string[] }> {
  if (!Array.isArray(attributes)) {
    return false;
  }
  return attributes.every(
    (attr) =>
      typeof attr === 'object' &&
      attr !== null &&
      typeof attr.name === 'string' &&
      attr.name.trim() !== '' &&
      Array.isArray(attr.values) &&
      attr.values.every((value: any) => typeof value === 'string' && value.trim() !== '')
  );
}

// Validate variant attributes
function validateVariantAttributes(
  variants: any[],
  productAttributes: Array<{ name: string; values: string[] }>
): variants is ProductVariant[] {
  if (!Array.isArray(variants)) {
    return false;
  }
  const productAttrNames = new Set(productAttributes.map((attr) => attr.name));
  return variants.every((variant) => {
    if (!variant || typeof variant !== 'object') return false;
    if (typeof variant.name !== 'string' || variant.name.trim() === '') return false;
    if (typeof variant.price !== 'number' || variant.price <= 0) return false;
    if (typeof variant.inStock !== 'boolean') return false;
    if (typeof variant.stockQuantity !== 'number' || variant.stockQuantity < 0) return false;
    if (!Array.isArray(variant.specifications)) return false;
    if (!Array.isArray(variant.attributes)) return false;

    const variantAttrNames = new Set(variant.attributes.map((attr: any) => attr.name));
    return (
      variant.attributes.every(
        (attr: any) =>
          typeof attr === 'object' &&
          attr !== null &&
          typeof attr.name === 'string' &&
          attr.name.trim() !== '' &&
          typeof attr.value === 'string' &&
          attr.value.trim() !== ''
      ) &&
      productAttrNames.size === variantAttrNames.size &&
      [...productAttrNames].every((name) => variantAttrNames.has(name))
    );
  });
}

// GET all products with category names
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const products = await db
      .collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const categories = await db.collection('categories').find({}).toArray();

    const categoryMap = new Map();
    categories.forEach((cat) => {
      categoryMap.set(cat._id.toString(), cat.name);
    });

    const serializedProducts = products.map((product) => ({
      _id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      discountPrice: product.discountPrice || 0,
      categories: product.categories || [],
      categoryNames: (product.categories || []).map((catId: string) =>
        categoryMap.get(catId) || 'Unknown Category'
      ),
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
      variants: (product.variants || []).map((variant: any) => ({
        ...variant,
        _id: variant._id.toString(),
      })),
      todayOffer: product.todayOffer || false,
      featuredProduct: product.featuredProduct || false,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    }));

    return NextResponse.json(serializedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
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

    console.log('📝 Creating product with data:', {
      name,
      description,
      price,
      discountPrice,
      categories,
      type,
      variants,
    });

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
      // Assign proper ObjectIds to variations
      variants = variants.map((variant: any) => ({
        ...variant,
        _id: new ObjectId().toString(),
      }));
    } else {
      variants = []; // Clear variants for simple products
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
      console.log('✅ Main image saved:', mainImageUrl);
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

    console.log('📸 Media files to process:', mediaFiles.length);

    for (const mediaFile of mediaFiles) {
      if (mediaFile && mediaFile.size > 0) {
        const fileType = mediaFile.type.startsWith('image/') ? 'image' : mediaFile.type.startsWith('video/') ? 'video' : null;
        if (!fileType) {
          console.warn(`Skipping invalid file type: ${mediaFile.type}`);
          continue;
        }
        const validationError = validateFile(mediaFile, fileType);
        if (validationError) {
          console.warn(`Skipping invalid media file: ${validationError}`);
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
        console.log('✅ Additional media saved:', { url: mediaUrl, type: fileType });
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

    console.log('💾 Saving to database:', productData);

    const result = await db.collection('products').insertOne(productData);

    console.log('✅ Product created with ID:', result.insertedId);

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

// PUT - Update product
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    console.log('🔄 PUT Product API: Updating product with ID:', params.id);

    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

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

    console.log('📝 Update data received:', {
      name,
      description,
      price,
      discountPrice,
      categories,
      type,
      variants,
    });

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
      // Assign proper ObjectIds to new variations
      variants = variants.map((variant: any) => ({
        ...variant,
        _id: variant._id.startsWith('temp-') ? new ObjectId().toString() : variant._id,
      }));
    } else {
      variants = []; // Clear variants for simple products
    }

    // Validate discount price
    if (discountPrice > price) {
      return NextResponse.json(
        { error: 'Discount price cannot be greater than regular price' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await db.collection('products').findOne({
      _id: new ObjectId(params.id),
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
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
      if (existingProduct.image && existingProduct.image.startsWith('/uploads/')) {
        await deleteFile(existingProduct.image);
      }
    } else {
      mainImageUrl = existingProduct.image;
    }

    // Handle additional media files
    const mediaFiles = formData.getAll('mediaFiles') as File[];
    const mediaToRemoveInput = formData.get('mediaToRemove') as string;
    const mediaToRemove: Array<{ url: string }> = mediaToRemoveInput ? JSON.parse(mediaToRemoveInput) : [];
    let additionalMedia: Array<{
      url: string;
      type: 'image' | 'video';
      name?: string;
      size?: number;
      mimeType?: string;
    }> = existingProduct.additionalMedia || [];

    console.log('📸 Media files to process:', mediaFiles.length);
    console.log('🗑️ Media to remove:', mediaToRemove);

    // Remove media files marked for deletion
    if (mediaToRemove.length > 0) {
      for (const media of mediaToRemove) {
        if (media.url && media.url.startsWith('/uploads/')) {
          await deleteFile(media.url);
        }
      }
      additionalMedia = additionalMedia.filter(
        (existingMedia: { url: string }) =>
          !mediaToRemove.some((mediaToRemove: { url: string }) => mediaToRemove.url === existingMedia.url)
      );
    }

    // Add new media files
    for (const mediaFile of mediaFiles) {
      if (mediaFile && mediaFile.size > 0) {
        const fileType = mediaFile.type.startsWith('image/') ? 'image' : mediaFile.type.startsWith('video/') ? 'video' : null;
        if (!fileType) {
          console.warn(`Skipping invalid file type: ${mediaFile.type}`);
          continue;
        }
        const validationError = validateFile(mediaFile, fileType);
        if (validationError) {
          console.warn(`Skipping invalid media file: ${validationError}`);
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
        console.log('✅ Added new media:', { url: mediaUrl, type: fileType });
      }
    }

    // Generate slug if name changed
    const slug = existingProduct.slug && existingProduct.name === name ? existingProduct.slug : generateSlug(name);

    // Update product in database
    const updateData: Partial<Product> = {
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
      updatedAt: new Date().toISOString(),
    };

    console.log('💾 Saving to database:', updateData);

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    console.log('📊 Update result:', result);

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    console.log('✅ PUT Product API: Successfully updated product');
    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      message: 'Product updated successfully',
    });
  } catch (error) {
    console.error('❌ PUT Product API Error:', error);
    return NextResponse.json(
      { error: 'Failed to update product', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
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
  const timestamp = Date.now();
  const fileExtension = path.extname(file.name).toLowerCase();
  const originalName = path.basename(file.name, fileExtension).replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${timestamp}-${originalName}${fileExtension}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const filePath = path.join(uploadDir, fileName);
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
  await writeFile(filePath, buffer);
  console.log(`File saved: ${fileName} (${file.size} bytes)`);
  return `/uploads/${fileName}`;
}

async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const fileName = fileUrl.split('/').pop();
    if (!fileName) return;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);
    await unlink(filePath);
    console.log(`File deleted: ${fileName}`);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}