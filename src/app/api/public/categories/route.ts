// app/api/public/categories/route.ts
import clientPromise from '../../../../lib/mongoDb';
import { NextRequest } from 'next/server';
import type { Category } from '../../../../types/category';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db();

    // Get all categories
    const categories = await db
      .collection('categories')
      .find({})
      .toArray();

    // Get all products to count category occurrences
    const products = await db
      .collection('products')
      .find({})
      .toArray();

    // Create a map to count products per category
    const categoryProductCount: { [categoryId: string]: number } = {};

    // Count products for each category
    products.forEach(product => {
      if (product.categories && Array.isArray(product.categories)) {
        product.categories.forEach(categoryId => {
          categoryProductCount[categoryId] = (categoryProductCount[categoryId] || 0) + 1;
        });
      }
    });

    // Convert flat categories to tree structure
    const buildCategoryTree = (categories: any[]): Category[] => {
      const categoryMap = new Map();
      const roots: Category[] = [];

      // Create a map of all categories
      categories.forEach(category => {
        const categoryData: Category = {
          id: category._id.toString(),
          name: category.name,
          description: category.description,
          parentId: category.parentId,
          slug: category.slug,
          image: category.image, // Include the image from database
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
          productCount: categoryProductCount[category._id.toString()] || 0,
          children: []
        };
        categoryMap.set(category._id.toString(), categoryData);
      });

      // Build the tree structure
      categories.forEach(category => {
        const categoryData = categoryMap.get(category._id.toString());
        if (category.parentId) {
          const parent = categoryMap.get(category.parentId.toString());
          if (parent && parent.children) {
            parent.children.push(categoryData);
          }
        } else {
          roots.push(categoryData);
        }
      });

      return roots;
    };

    const categoryTree = buildCategoryTree(categories);
    console.log('Category tree with images:', categoryTree); 

    return Response.json(categoryTree);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return Response.json([], { status: 500 });
  }
}