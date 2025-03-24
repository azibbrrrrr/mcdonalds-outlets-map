"use client";

import { useState } from "react";

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      // Ensure results is always an array
      setResults(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search McDonald's outlet..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()} // Press Enter to search
        className="border p-2 w-full rounded"
      />
      <button
        onClick={handleSearch}
        className="bg-red-500 text-white p-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search"}
      </button>

      {/* Display Search Results */}
      {results.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {results.map((outlet, index) => (
            <li key={index} className="border p-2 rounded">
              <p className="font-semibold">{outlet.name}</p>
              <p>{outlet.address}</p>
              <a
                href={outlet.waze_link}
                target="_blank"
                className="text-blue-500 underline"
              >
                Open in Waze
              </a>
            </li>
          ))}
        </ul>
      ) : (
        !loading && query && <p className="text-gray-500">No outlets found.</p>
      )}
    </div>
  );
}
