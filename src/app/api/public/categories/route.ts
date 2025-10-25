import clientPromise from '../../../../lib/mongoDb';
import { NextResponse } from 'next/server';
import type { Category } from '../../../../types/category';

export async function GET() {
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
      const categoryMap = new Map<string, Category>();
      const roots: Category[] = [];

      // Create a map of all categories
      categories.forEach((category: any) => {
        const categoryData: Category = {
          id: category._id.toString(),
          name: category.name,
          description: category.description,
          parentId: category.parentId ? category.parentId.toString() : null,
          slug: category.slug,
          image: category.image,
          createdAt: category.createdAt.toISOString(),
          updatedAt: category.updatedAt.toISOString(),
          productCount: categoryProductCount[category._id.toString()] || 0,
          children: []
        };
        categoryMap.set(category._id.toString(), categoryData);
      });

      // Build the tree structure
      categories.forEach((category: any) => {
        const categoryData = categoryMap.get(category._id.toString());
        if (category.parentId && categoryData) {
          const parent = categoryMap.get(category.parentId.toString());
          if (parent && parent.children) {
            parent.children.push(categoryData);
          }
        } else if (categoryData) {
          roots.push(categoryData);
        }
      });

      return roots;
    };

    const categoryTree = buildCategoryTree(categories);
    return NextResponse.json(categoryTree);
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json([], { status: 500 });
  }
}