// lib/category-service.ts
import clientPromise from './mongoDb';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

class CategoryService {
  private categories: Category[] = [];
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    try {
      const client = await clientPromise;
      const db = client.db();
      const categories = await db
        .collection('categories')
        .find({})
        .toArray();

      this.categories = categories.map(cat => ({
        _id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description
      }));

      this.initialized = true;
      console.log('Categories loaded:', this.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }

  getCategoryById(id: string): Category | undefined {
    return this.categories.find(cat => cat._id === id);
  }

  getCategoryByName(name: string): Category | undefined {
    return this.categories.find(cat => 
      cat.name.toLowerCase() === name.toLowerCase()
    );
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find(cat => cat.slug === slug);
  }

  getAllCategories(): Category[] {
    return this.categories;
  }

  // Find category by name, slug, or ID
  findCategory(identifier: string): Category | undefined {
    return this.categories.find(cat => 
      cat._id === identifier ||
      cat.name.toLowerCase() === identifier.toLowerCase() ||
      cat.slug === identifier.toLowerCase()
    );
  }
}

export const categoryService = new CategoryService();