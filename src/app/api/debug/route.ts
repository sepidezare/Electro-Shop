import { NextResponse } from 'next/server';
import clientPromise from "@/lib/mongoDb";

export async function POST() {
  try {
    const client = await clientPromise;
    const db = client.db("myDB");

    // Add a test product to the products collection
    const result = await db.collection("products").insertOne({
      name: "Test Product " + Math.random().toString(36).substring(7),
      price: Math.floor(Math.random() * 100) + 1, // Random price between 1-100
      category: "electronics",
      description: "This is a test product added from Vercel",
      inStock: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      features: ["feature1", "feature2", "feature3"],
      rating: Math.floor(Math.random() * 5) + 1 // Random rating 1-5
    });

    return NextResponse.json({
      success: true,
      insertedId: result.insertedId,
      message: "Product added successfully to the database!",
      product: {
        name: "Test Product",
        price: "Random price between $1-100",
        category: "electronics"
      }
    });
  } catch (error) {
    console.error("MongoDB error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}