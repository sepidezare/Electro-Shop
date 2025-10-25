import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongoDb';
import { ObjectId } from 'mongodb';

interface CategoryData {
  name: string;
  description?: string;
  parentId?: string | null;
  image?: string;
}

// Define MongoDB category document type
interface CategoryDocument {
  _id: ObjectId;
  name: string;
  description?: string;
  parentId?: ObjectId | null;
  slug: string;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Define serialized category type for response (recursive)
interface SerializedCategory {
  _id: string;
  name: string;
  description?: string;
  parentId: string | null;
  slug: string;
  image?: string;
  children?: SerializedCategory[];
  createdAt: string;
  updatedAt: string;
}

// GET all categories with hierarchical structure
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const categories = await db
      .collection<CategoryDocument>('categories')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Convert to hierarchical structure
    const categoryTree = buildCategoryTree(categories);
    
    const serializedCategories: SerializedCategory[] = categoryTree.map(category => ({
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      parentId: category.parentId ? category.parentId.toString() : null,
      slug: category.slug,
      image: category.image || undefined,
      children: category.children ? serializeCategoryChildren(category.children) : [],
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    }));

    return NextResponse.json(serializedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    
    const data: CategoryData = await request.json();
    const { name, description, parentId, image } = data;
    
    console.log('📝 Creating category with data:', { name, description, parentId, image });

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = generateSlug(name);
    
    // Validate parent category exists if provided
    if (parentId) {
      if (!ObjectId.isValid(parentId)) {
        return NextResponse.json(
          { error: 'Invalid parent category ID' },
          { status: 400 }
        );
      }
      
      const parentCategory = await db.collection('categories').findOne({ 
        _id: new ObjectId(parentId) 
      });
      
      if (!parentCategory) {
        return NextResponse.json(
          { error: 'Parent category not found' },
          { status: 404 }
        );
      }
    }

    // Create category in database
    const categoryData = {
      name: name.trim(),
      description: description?.trim() || '',
      parentId: parentId ? new ObjectId(parentId) : null,
      slug,
      image: image || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('categories').insertOne(categoryData);
    return NextResponse.json({ 
      success: true, 
      insertedId: result.insertedId,
      category: {
        ...categoryData,
        _id: result.insertedId.toString(),
        parentId: parentId,
        image: image || null
      },
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// Extended interface for categories with children
interface CategoryWithChildren extends CategoryDocument {
  children?: CategoryWithChildren[];
}

// Helper function to build hierarchical category tree
function buildCategoryTree(
  categories: CategoryDocument[], 
  parentId: string | null = null
): CategoryWithChildren[] {
  const tree: CategoryWithChildren[] = [];
  
  categories
    .filter(cat => {
      if (parentId === null) {
        return cat.parentId === null || cat.parentId === undefined;
      }
      return cat.parentId && cat.parentId.toString() === parentId;
    })
    .forEach(cat => {
      const children = buildCategoryTree(categories, cat._id.toString());
      const categoryWithChildren: CategoryWithChildren = {
        ...cat,
        children: children.length > 0 ? children : undefined
      };
      tree.push(categoryWithChildren);
    });
  
  return tree;
}

// Helper function to recursively serialize category children
function serializeCategoryChildren(children: CategoryWithChildren[]): SerializedCategory[] {
  return children.map(child => ({
    _id: child._id.toString(),
    name: child.name,
    description: child.description,
    parentId: child.parentId ? child.parentId.toString() : null,
    slug: child.slug,
    image: child.image || undefined,
    children: child.children ? serializeCategoryChildren(child.children) : [],
    createdAt: child.createdAt.toISOString(),
    updatedAt: child.updatedAt.toISOString()
  }));
}

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}