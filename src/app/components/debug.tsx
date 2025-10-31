// pages/test-page.tsx or components/TestComponent.tsx
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
    <div>
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "Testing..." : "Test MongoDB Connection"}
      </button>
      {result && <pre className="mt-4 p-4 bg-gray-100 rounded">{result}</pre>}
    </div>
  );
}
