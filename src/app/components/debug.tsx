// src/app/components/debug.tsx
import { useState } from "react";

export default function TestComponent() {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const testConnection = async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/debug", {
        method: "POST",
      });

      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:bg-gray-400"
      >
        {loading ? "Adding Product..." : "Add Test Product to Database"}
      </button>

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Result:</h3>
          <pre className="p-4 bg-gray-100 rounded-lg border border-gray-300 whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
