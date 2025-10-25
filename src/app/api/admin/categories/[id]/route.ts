// app/api/admin/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongoDb';
import { ObjectId } from 'mongodb';

interface UpdateCategoryData {
  name?: string;
  description?: string;
  parentId?: string | null;
  image?: string;
}

interface UpdateData {
  updatedAt: Date;
  name?: string;
  description?: string;
  parentId?: ObjectId | null;
  image?: string;
  slug?: string;
}

interface Params {
  params: {
    id: string;
  }
}

// GET single category
export async function GET(request: Request, { params }: Params) {
  try {
    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const category = await db.collection('categories').findOne({ 
      _id: new ObjectId(params.id) 
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const serializedCategory = {
      _id: category._id.toString(),
      name: category.name,
      description: category.description,
      parentId: category.parentId ? category.parentId.toString() : null,
      slug: category.slug,
      image: category.image || undefined, // Add image field
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    };

    return NextResponse.json(serializedCategory);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(request: Request, { params }: Params) {
  try {
    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    const data: UpdateCategoryData = await request.json();
    const { name, description, parentId, image } = data;

    // Check if category exists
    const existingCategory = await db.collection('categories').findOne({ 
      _id: new ObjectId(params.id) 
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

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

    // Generate new slug if name changed
    let slug = existingCategory.slug;
    if (name && name !== existingCategory.name) {
      slug = generateSlug(name);
      
      // Check if new slug already exists (excluding current category)
      const slugExists = await db.collection('categories').findOne({ 
        slug, 
        _id: { $ne: new ObjectId(params.id) } 
      });
      
      if (slugExists) {
        return NextResponse.json(
          { error: 'A category with this name already exists' },
          { status: 400 }
        );
      }
    }

    const updateData: UpdateData = {
      updatedAt: new Date()
    };

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (parentId !== undefined) updateData.parentId = parentId ? new ObjectId(parentId) : null;
    if (image !== undefined) updateData.image = image; // Add image field
    if (slug !== existingCategory.slug) updateData.slug = slug;

    const result = await db.collection('categories').updateOne(
      { _id: new ObjectId(params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete category
export async function DELETE(request: Request, { params }: Params) {
  try {
    const client = await clientPromise;
    const db = client.db();

    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category has children
    const childCategories = await db.collection('categories').find({
      parentId: new ObjectId(params.id)
    }).toArray();

    if (childCategories.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category that has subcategories. Please delete or reassign subcategories first.' },
        { status: 400 }
      );
    }

    const result = await db.collection('categories').deleteOne({
      _id: new ObjectId(params.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
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