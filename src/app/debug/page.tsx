"use client";
import TestComponent from "../components/debug";

export default function DebugPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Database Test Page</h1>
      <p className="mb-6 text-gray-600 text-lg">
        Test your MongoDB connection by adding a sample product to the{" "}
        <code className="bg-gray-100 px-1 rounded">products</code> collection.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="font-semibold text-blue-800 mb-2">What this does:</h2>
        <ul className="list-disc list-inside text-blue-700 space-y-1">
          <li>Connects to your MongoDB database</li>
          <li>Adds a test product to the "products" collection</li>
          <li>Returns the inserted document ID</li>
          <li>Includes random price, rating, and unique name</li>
        </ul>
      </div>

      <TestComponent />
    </div>
  );
}
