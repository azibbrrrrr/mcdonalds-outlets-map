"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, List, Search } from "lucide-react";

type Outlet = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  operating_hours: string;
  waze_link: string;
  features: string[];
};

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function Home() {
  const [activeTab, setActiveTab] = useState("map");
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [filteredOutlets, setFilteredOutlets] = useState<Outlet[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all outlets from API on page load
  useEffect(() => {
    const fetchOutlets = async () => {
      try {
        const response = await fetch("/api/outlets");
        const data = await response.json();
        setOutlets(data);
        setFilteredOutlets(data); // Default to showing all outlets
      } catch (error) {
        console.error("Error fetching outlets:", error);
      }
    };
    fetchOutlets();
  }, []);

  // Handle Search API Call
  const handleSearch = async () => {
    if (!query.trim()) {
      setFilteredOutlets(outlets); // Reset to all outlets if search is empty
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      setFilteredOutlets(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error("Search API Error:", error);
      setFilteredOutlets([]); // Clear outlets on error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-400 text-4xl mr-2">M</span>
            <h1 className="text-2xl font-bold">McDonald&apos;s Finder</h1>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <main className="container mx-auto p-4 mb-16">
        <div className="mb-6 bg-white rounded-lg shadow p-3 flex items-center">
          <input
            type="text"
            placeholder="Ask AI: Which outlets in KL operate 24 hours?"
            className="w-full outline-none text-gray-700 px-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch} className="text-gray-500 px-2">
            {loading ? "..." : <Search size={20} />}
          </button>
        </div>

        {/* Toggle Buttons for Map/List View */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full shadow-md p-1 flex">
            <button
              className={`px-6 py-2 rounded-full flex items-center transition-all ${
                activeTab === "map"
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("map")}
            >
              <MapPin size={18} className="mr-2" />
              Map View
            </button>
            <button
              className={`px-6 py-2 rounded-full flex items-center transition-all ${
                activeTab === "list"
                  ? "bg-red-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("list")}
            >
              <List size={18} className="mr-2" />
              List View
            </button>
          </div>
        </div>

        {/* Map View / List View */}
        {activeTab === "map" ? (
          <MapComponent outlets={filteredOutlets} />
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="text-xl p-4 border-b border-gray-100 text-black font-semibold">
              {query ? "Search Results" : "All McDonald's Outlets"}
            </h2>
            {filteredOutlets.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No outlets found
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {filteredOutlets.map((outlet) => (
                  <li
                    key={outlet.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-red-700">
                          {outlet.name}
                        </h3>
                        <p className="text-gray-600 mb-2">{outlet.address}</p>
                        <div className="flex flex-wrap gap-2">
                          {outlet.features.map((feature, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <a
                        href={outlet.waze_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 transition-colors text-white rounded-lg px-3 py-2 text-sm flex items-center whitespace-nowrap"
                      >
                        <MapPin size={14} className="mr-1" /> Waze
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
